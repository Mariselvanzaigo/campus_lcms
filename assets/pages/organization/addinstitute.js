
//var org_data = '';

/**** multistep form global functions Starts ****/
var cms_ins_param = getUrlParamquery();
console.log(cms_ins_param);
var org_id = cms_ins_param.org_id;
var ins_id = cms_ins_param.ins_id;
var parent_id = cms_ins_param.parent_id;
var user_id = cms_ins_param.user_id;
var page_from = cms_ins_param.page_from;
var ins_type = cms_ins_param.type;
var csc_token = localStorage.getItem("csc_token");
if(!csc_token){
  get_csc_accesstoken();
}
function get_csc_accesstoken(){
alert(1);
  $.ajax({
    url: 'https://www.universal-tutorial.com/api/getaccesstoken',
    type: 'GET',
    dataType: 'json',
    headers: { "Accept": "application/json;", 
    "api-token": "7KLcA2sWSe4hh3xi9ou-vIY8mV5Q6E1Dom5fFerfiwy-j6xlk15z8Urd8ujKUtZ081c", 
    "user-email": "mari.s@zaigoinfotech.com" },
    success: function (response) {
      console.log(response);
      localStorage.setItem("csc_token", response.auth_token);
      csc_token = response.auth_token;
    },
    error: function(error){
      console.log(error);
    }
  }); 
}
$("<link/>", {
  rel: "stylesheet",
  type: "text/css",
  href: "https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css"
}).appendTo("head");  
$.getScript('https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js');
var org_list = function () {
  var tmp_org = null;
  $.ajax({
    'async': false,
    url: API_BASE_URL + 'organization/drop_down',
    type: 'get',
    global: false,
    dataType: 'json',
    headers: { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token },
    success: function (response) {
      tmp_org = response?.data;
    }
  }); 
  return tmp_org;
}();

var stream_list = function () {
  var tmp_stream = null;
  $.ajax({
    'async': false,
    url: API_BASE_URL + 'stream/details',
    type: 'get',
    global: false,
    dataType: 'json',
    headers: { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token },
    success: function (response) {
      tmp_stream = response?.data;
    }
  }); 
  return tmp_stream;
}();

var course_list = function () {
  var tmp_course = null;
  $.ajax({
    'async': false,
    url: API_BASE_URL + 'course_type/details',
    type: 'get',
    global: false,
    dataType: 'json',
    headers: { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token },
    success: function (response) {
      tmp_course = response?.data;
    }
  }); 
  return tmp_course;
}();
$(document).ready(function(){
  $("#ins_country").select2({
    templateResult: formatState,
    width: '100%'
  });
  $("#ins_state").select2({
    templateResult: formatState,
    width: '100%'
  });
  $("#ins_city").select2({
    templateResult: formatState,
    width: '100%'
  });
  $("#user_country").select2({
    templateResult: formatState,
    width: '100%'
  });
  $("#user_state").select2({
    templateResult: formatState,
    width: '100%'
  });
  $("#user_city").select2({
    templateResult: formatState,
    width: '100%'
  });
  if(ins_type == "group"){
    $("#institute_label").text("Group name");
  }else if(ins_type == "college"){
    $("#institute_label").text("College name");
  }
  if(page_from){
    $("#toOrganizationList").attr("data-n-linkto", page_from);
    $(".cancelredirect").attr("data-n-linkto", page_from);
  }
  //hideStage(1);showStage(3);
  if(ins_id){
    $("#save_manage_academic").attr("data-status", "Updated");
    $("#save_institute").text("Update & Next");
    if(ins_type == "group"){
      $("#stage_head_1").text("Edit Group");
      $("#stage-1-step small").text("Edit Group");
      $("#header_breadcrumbs").text("Organization / Edit Group");
    }else{
      $("#stage_head_1").text("Edit College");
      $("#stage-1-step small").text("Edit College");
      $("#header_breadcrumbs").text("Organization / Edit College");
    }
    // $("#stage_head_2").text("Edit Admin");
    // $("#stage-2-step small").text("Edit Admin");
    $.ajax({
      url: API_BASE_URL + 'institute/details/'+ins_id+'/',
      type: "GET",
      headers: {
        "Authorization": "Bearer " + getUserInfo().access_token,
        "Content-Type": "application/json"
      },
      success:function(response){
        if(response){
            $("#ins_name").val(response.name ? response.name : "");
            $("#ins_website").val(response.website ? response.website : "");
            $("#ins_email_id").val(response.email_id ? response.email_id : "");
            $("#ins_address_line_1").val(response.address_line_1 ? response.address_line_1 : "");
            $("#ins_address_line_2").val(response.address_line_2 ? response.address_line_2 : "");
            $("#ins_city").val(response.city ? response.city : "");
            $("#ins_state").val(response.state ? response.state : "");
            $("#ins_country").val(response.country ? response.country : "");
            var country = response.country ? response.country : "";
            var state = response.state ? response.state : "";
            var city = response.city ? response.city : "";

            if(csc_token){
              get_country(country, "ins");
              get_state(country,state, "ins");
              get_city(state, city, "ins");
            }
            $("#ins_zip_code").val(response.zip_code ? response.zip_code : "");
            $("#ins_registration_details").val(response.registration_details ? response.registration_details : "");
            $("#ins_recogonition_details").val(response.recognition_detail ? response.recognition_detail : "");
            if(response.logo && response.logo !== ''){
              $(".dropzone_4_prev").attr("style", "display:block;");
              $(".dropzone_4_image_preview").attr('src', response.logo);
              $(".dropzone_4_image_preview").attr('style', "width: 100%;height: 250px;");
              $("#demo-upload_4 .dz-default").attr("id", "CourseSettingsBanner4");
              $("#demo-upload_4 .dz-default").after(`<img id="CourseSettingsBanner4del" class="delete_file" data-file_prop_name="Logo" data-bs-toggle="modal" data-bs-target="#delete-add" src="../assets/images/delete-round.png">`);
              //$("#CourseSettingsBanner4").attr("style", "opacity:1");
            }
            if(response.cover_image && response.cover_image !== ''){
              $(".dropzone_1_prev").attr("style", "display:block;");
              $(".dropzone_1_image_preview").attr('src', response.cover_image);
              $(".dropzone_1_image_preview").attr('style', "width: 100%;height: 250px;");
              $("#demo-upload_1 .dz-default").attr("id", "CourseSettingsBanner1");
              $("#demo-upload_1 .dz-default").after(`<img id="CourseSettingsBanner1del" class="delete_file" data-file_prop_name="Cover Image" data-bs-toggle="modal" data-bs-target="#delete-add" src="../assets/images/delete-round.png">`);
              //$("#CourseSettingsBanner4").attr("style", "opacity:1");
            }
            if(org_list){
              getOrganizationDropdown(org_list, response.organization_id);
            }else{
              setTimeout(function(){
                getOrganizationDropdown(org_list, response.organization_id);
              }, 500)
            }
            if(response.stream.length > 0){
              stream_list_select(stream_list, response.stream);
            }else{
              stream_list_select(stream_list, "");
            }
            if(response.course_type.length > 0){
              course_list_select(course_list, response.course_type);
            }else{
              course_list_select(course_list, "");
            }
            insertMobilenumberwithRegion(response.phone_number, response.region_code, "ins_phone_no");
            if(response.member_details.length > 0){
              $.each(response.member_details, function( i, val ) {
                if(i == 0){
                  if(val.id){
                    user_id = val.id;
                    var refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + '?org_id='+org_id+'&ins_id='+ins_id+'&parent_id='+parent_id+"&page_from="+page_from+"&type="+ins_type;    
                    window.history.pushState({ path: refresh }, '', refresh);
                  }
                  insertMobilenumberwithRegion(val.mobile_number, val.region_code, "user_phone_no");
                  $("#user_first_name").val(val.first_name ? val.first_name : "");
                  $("#user_last_name").val(val.last_name ? val.last_name : "");
                  $("#user_email_id").val(val.email_id ? val.email_id : "");
                  $("#user_address_line_1").val(val.apartment_suit_unit ? val.apartment_suit_unit : "");
                  $("#user_address_line_2").val(val.street_address ? val.street_address : "");
                  // $("#user_city").val(val.city ? val.city : "");
                  // $("#user_state").val(val.state ? val.state : "");
                  // $("#user_country").val(val.country ? val.country : "");

                  var user_country = val.country ? val.country : "";
                  var user_state = val.state ? val.state : "";
                  var user_city = val.city ? val.city : "";
                  get_country(user_country, "user");
                  get_state(user_country,user_state, "user");
                  get_city(user_state, user_city, "user");
                  $("#user_zip_code").val(val.zip_code ? val.zip_code : "");
                  $("#user_qualification").val(val.qualification ? val.qualification : "");
                  $("#user_description").val(val.description ? val.description : "");
                  if(val.m_image && val.m_image !== ''){
                    $(".dropzone_2_prev").attr("style", "display:block;");
                    $(".dropzone_2_image_preview").attr('src', val.m_image);
                    $(".dropzone_2_image_preview").attr('style', "width: 100%;height: 250px;");
                    $("#demo-upload_2 .dz-default").attr("id", "CourseSettingsBanner2");
                    $("#demo-upload_2 .dz-default").after(`<img id="CourseSettingsBanner2del" class="delete_file" data-file_prop_name="Profile Image" data-bs-toggle="modal" data-bs-target="#delete-add" src="../assets/images/delete-round.png">`);
                    //$("#CourseSettingsBanner4").attr("style", "opacity:1");
                  }
                }
              });
            }else{
              initiateMobilenumberwithRegion("user_phone_no");
            }
        }
      },
      error: function(error) {
        if (error.status === 401) {
          alert("Session Expired, Please login again.");
          logoutSession();
        }
        //toastr.error("Response Error: " + error.message);
        console.log(error);
      }
    });
  }else{
    $("#save_manage_academic").attr("data-status", "Saved");
    $("#save_institute").text("Save & Next");
    // $("#stage_head_2").text("Create Admin");
    $("#stage-1-step small").text("Create Institute");
    // $("#stage-2-step small").text("Create Admin");
    if(ins_type == "group"){
      $("#stage_head_1").text("Create Group");
      $("#stage-1-step small").text("Create Group");
      $("#header_breadcrumbs").text("Organization / Add Group");
    }else{
      $("#stage_head_1").text("Create College");
      $("#stage-1-step small").text("Create College");
      $("#header_breadcrumbs").text("Organization / Add College");
    }

    if(csc_token){
      get_country("", "ins");
      get_state("", "", "ins");
      get_city("", "ins");
      get_country("", "user");
      get_state("", "", "user");
      get_city("", "user");
    }

    if(parent_id){
      $.ajax({
        url: API_BASE_URL + 'stream/course/details/'+parent_id+'/',
        type: 'get',
        dataType: 'json',
        headers: { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token },
        success: function (response) {
          console.log(response.course_type_list.length);
          if(response.course_type_list.length > 0){
            course_list_select_byval(course_list, response.course_type_list);
          }
          if(response.stream_list.length > 0){
            stream_list_select_byval(stream_list, response.stream_list);
          }
        }
      }); 
    }else{
      course_list_select(course_list, "");
      stream_list_select(stream_list, "");
    }
    getOrganizationDropdown(org_list, org_id);
    initiateMobilenumberwithRegion("ins_phone_no");
    initiateMobilenumberwithRegion("user_phone_no");
  }
});
$(document).on("change", "#ins_country", function(){
  var country_name = $(this).val();
  console.log(country_name);
  get_state(country_name, "", "ins");
});
$(document).on("change", "#ins_state", function(){
  var state_name = $(this).val();
  console.log(state_name);
  get_city(state_name, "", "ins");
});
$(document).on("change", "#user_country", function(){
  var country_name = $(this).val();
  console.log(country_name);
  get_state(country_name, "", "user");
});
$(document).on("change", "#user_state", function(){
  var state_name = $(this).val();
  console.log(state_name);
  get_city(state_name, "", "user");
});
function get_country(country_name, field){
  $.ajax({
    url: 'https://www.universal-tutorial.com/api/countries/',
    type: 'GET',
    dataType: 'json',
    headers: { "Accept": "application/json;", "Authorization": "Bearer "+csc_token},
    success: function (response) {
      console.log(response);

      $("#"+field+"_country").empty();
      if(response.length > 0){
        var selected = "";
        var country_options = '<option value="">Select Country</option>';
          $.each( response, function( i, val ) {
            if(country_name && country_name.toLowerCase() == val.country_name.toLowerCase()){
              selected = "selected";
            }else{
              selected = "";
            }
            country_options += `<option value="${val.country_name}"  ${selected}>${val.country_name}</option>`;
          });
          $("#"+field+"_country").append(country_options);
          $("#"+field+"_country").select2({
            templateResult: formatState,
            width: '100%'
          });
      }


    },
    error: function(error){
      console.log(error);

      var errorJson = jQuery.parseJSON(error.responseText);
      console.log(errorJson);
      if(errorJson.error.name == "TokenExpiredError"){
        localStorage.removeItem("csc_token");
        get_csc_accesstoken();
      }

    }
  }); 
}
function get_state(country_name, state_name, field){
  if(country_name){
    $.ajax({
      url: 'https://www.universal-tutorial.com/api/states/'+country_name,
      type: 'GET',
      dataType: 'json',
      headers: { "Accept": "application/json;", "Authorization": "Bearer "+csc_token},
      success: function (response) {
        console.log(response);
        $("#"+field+"_state").removeAttr("disabled");
        $("#"+field+"_state").empty();
        if(response.length > 0){
          var selected = "";
          var state_options = '<option value="">Select State</option>';
            $.each( response, function( i, val ) {
              if(state_name && state_name.toLowerCase() == val.state_name.toLowerCase()){
                selected = "selected";
              }else{
                selected = "";
              }
              state_options += `<option value="${val.state_name}"  ${selected}>${val.state_name}</option>`;
            });
            $("#"+field+"_state").append(state_options);
            $("#"+field+"_state").select2({
              templateResult: formatState,
              width: '100%'
            });
        }


      },
      error: function(error){
        $("#"+field+"_state").attr("disabled", true);
        console.log(error);
      }
    }); 
  }else{
    $("#"+field+"_state").attr("disabled", true);
  }
}
function get_city(state_name, city_name, field){
  if(state_name){
    $.ajax({
      url: 'https://www.universal-tutorial.com/api/cities/'+state_name,
      type: 'GET',
      dataType: 'json',
      headers: { "Accept": "application/json;", "Authorization": "Bearer "+csc_token},
      success: function (response) {
        console.log(response);
        $("#"+field+"_city").removeAttr("disabled");
        $("#"+field+"_city").empty();
        if(response.length > 0){
          var selected = "";
          var city_options = '<option value="">Select City</option>';
            $.each( response, function( i, val ) {
              if(city_name && city_name.toLowerCase() == val.city_name.toLowerCase()){
                selected = "selected";
              }else{
                selected = "";
              }
              city_options += `<option value="${val.city_name}"  ${selected}>${val.city_name}</option>`;
            });
            $("#"+field+"_city").append(city_options);
            $("#"+field+"_city").select2({
              templateResult: formatState,
              width: '100%'
            });
        }


      },
      error: function(error){
        $("#"+field+"_city").attr("disabled", true);
        console.log(error);
      }
    }); 
  }else{
    $("#"+field+"_city").attr("disabled", true);
  }
}
function initiateMobilenumberwithRegion(field_id){
  var input = document.getElementById(field_id);
  window.intlTelInput(input, {
      separateDialCode: true,
      initialCountry:"in",
      utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/javascript.util/0.12.12/javascript.util.min.js" // just for formatting/placeholders etc
  });
}
function insertMobilenumberwithRegion(mobile_number, region_code, field_id){
  if(mobile_number && mobile_number != "" && mobile_number != null){
    console.log('mobile_number');
    var region_code = region_code != "" && region_code != null ? region_code+" " : '+91 ';
    $("#"+field_id).val(region_code+mobile_number);
    var input = document.getElementById(field_id);
    window.intlTelInput(input, {
      utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/javascript.util/0.12.12/javascript.util.min.js" // just for formatting/placeholders etc
    });
    $(".iti--allow-dropdown").addClass("iti--separate-dial-code");
    $("#"+field_id).val(mobile_number);
  }else{
    var input = document.getElementById(field_id);
    window.intlTelInput(input, {
        separateDialCode: true,
        initialCountry:"in",
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/javascript.util/0.12.12/javascript.util.min.js" // just for formatting/placeholders etc
      });
  }
}
function getOrganizationDropdown(org_list, org_id){

  $("#ins_organization").empty();
  if(org_list){
    var selected = "";
    var organization_options = '<option value="">Select Organization</option>';
      $.each( org_list, function( i, val ) {
        if(org_id && org_id == val.id){
          selected = "selected";
          $("#ins_organization_code").val(val.organization_code);
        }else{
          selected = "";
        }
        organization_options += `<option value="${val.id}" data-org_code="${val.organization_code}" ${selected}>${val.organization_name}</option>`;
      });
      $("#ins_organization").append(organization_options);
      $("#ins_organization").select2({
        templateResult: formatState,
        width: '100%'
      });
  }
}
//dropzone delete icon click function
$(document).on("click", ".delete_file", function(e){
  var name =  $(this).attr("data-file_prop_name");
    $("#mAlertURLcourseMadeForname").text("Are you sure want to delete "+name+"?");
    if(name == "Logo"){
      $("#mAlertdeleteFor").val("org_logo");
    }else if(name == "Cover Image"){
      $("#mAlertdeleteFor").val("cover_image");
    }else if(name == "Profile Image"){
      $("#mAlertdeleteFor").val("profile_image");
    }
  });

//delete file confirmation popup
$("#mAlertDeletecourseMadeFor").on("click", function(){
  var deleteFor = $("#mAlertdeleteFor").val();
  if(deleteFor == "org_logo"){
      updateCourseSettingsFile("org_logo", null); 
  }
  if(deleteFor == "cover_image"){
    updateCourseSettingsFile("cover_image", null); 
  }
  if(deleteFor == "profile_image"){
    updateCourseSettingsFile("profile_image", null); 
  }
});

//delete confirmation popup call remove uploaded files and related changes
function updateCourseSettingsFile(inpLabel, inpValue){
  if(inpLabel == "org_logo"){
    $("#demo-upload_4 .dz-default").attr("id", "CourseSettingsBanner");
    $("#demo-upload_4 .dz-default").empty();
    $(".dropzone_4_image_preview").attr("src", "");
    $(".dropzone_4_image_preview").attr("style", "display:none;");
    $("#CourseSettingsBanner4del").remove();
    dropzone_4.removeAllFiles(true); 
    currentLogoFile = "";
  }
  if(inpLabel == "cover_image"){
    $("#demo-upload_1 .dz-default").attr("id", "CourseSettingsBanner");
    $("#demo-upload_1 .dz-default").empty();
    $(".dropzone_1_image_preview").attr("src", "");
    $(".dropzone_1_image_preview").attr("style", "display:none;");
    $("#CourseSettingsBanner1del").remove();
    dropzone_1.removeAllFiles(true); 
    currentCoverFile = "";
  }
  if(inpLabel == "profile_image"){
    $("#demo-upload_2 .dz-default").attr("id", "CourseSettingsBanner");
    $("#demo-upload_2 .dz-default").empty();
    $(".dropzone_2_image_preview").attr("src", "");
    $(".dropzone_2_image_preview").attr("style", "display:none;");
    $("#CourseSettingsBanner2del").remove();
    dropzone_2.removeAllFiles(true); 
    currentProfileFile = "";
  }
  $(".btn-close").trigger("click");
}
/**** multistep form global functions Ends ****/

/**** Institute section Starts ****/
//dropzone with image upload for Institute logo
//var acceptedFiles_image = "image/jpeg,image/png,image/jpg,image/svg+xml,";
var acceptedFiles_image = "image/jpeg,image/png,image/jpg,";
var currentLogoFile = null;
acceptedFiles_image = acceptedFiles_image.replace(/,\s*$/, "");
var dropzone_4options = {
  previewTemplate: document.querySelector('#preview-template_4').innerHTML,
  parallelUploads: 1,
  thumbnailHeight: 250,
  thumbnailWidth: 470,
  maxFilesize: 4,
  maxFiles:1,
  filesizeBase: 1000,
  autoProcessQueue: false,
  acceptedFiles: acceptedFiles_image,
   init: function ()  {
    this.hiddenFileInput.removeAttribute('multiple');
      this.on("error", function (file, message) {
          if (file.size > this.options.maxFilesize * 1000 * 1000) {
            this.removeFile(file);
          }
          var split_str = acceptedFiles_image.split(",");
          if (split_str.indexOf(file.type) === -1 && file.size > this.options.maxFilesize * 1000 * 1000) {
            toastr.error("Accepts only images");
            this.removeFile(file);
            return true;
          }
          if(message.substring(0,16) == "You can't upload" ){
            toastr.error("Accepts only images");
            this.removeFile(file);
            return true;
          }
      }); 
      this.on("addedfile", function(file) {
        $("#CourseSettingsBanner4del").remove();
        if (currentLogoFile) {
          this.removeFile(currentLogoFile);
        }
        currentLogoFile = file;
      });
  },
  thumbnail: function(file, dataUrl) {
      if (file.size > this.options.maxFilesize * 1000 * 1000) {
          toastr.error("File size is too big, Max file size allowed is 4MB");
          return true;
      }
      if (file.previewElement) {
        file.previewElement.classList.remove("dz-file-preview");
        var images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
        for (var i = 0; i < images.length; i++) {
            var thumbnailElement = images[i];
            thumbnailElement.alt = file.name;
            thumbnailElement.src = dataUrl;
            $("#dropzoneTestimonial").next().remove(); 
            $(".dropzone_4_prev").attr("style", "display:block;");
            $(".dropzone_4_image_preview").attr('src', dataUrl);
            $(".dropzone_4_image_preview").attr('style', "width: 100%;height: 250px;");
            $("#demo-upload_4 .dz-default").attr("id", "CourseSettingsBanner4");
            $("#demo-upload_4 .dz-default").after(`<img id="CourseSettingsBanner4del" class="delete_file" data-file_prop_name="Logo" data-bs-toggle="modal" data-bs-target="#delete-add" src="../assets/images/delete-round.png">`);
        }
        file.previewElement.classList.add("dz-image-preview");
      }
  }
};
var dropzone_4 = new Dropzone('#demo-upload_4', dropzone_4options);
$("#demo-upload_4 .dz-default").attr("id", "CourseSettingsBanner");
$("#demo-upload_4 .dz-default").empty();

//dropzone with image upload for Institute Cover Image
var currentCoverFile = null;
var dropzone_1options = {
  previewTemplate: document.querySelector('#preview-template_1').innerHTML,
  parallelUploads: 1,
  thumbnailHeight: 250,
  thumbnailWidth: 960,
  maxFilesize: 4,
  maxFiles:1,
  filesizeBase: 1000,
  autoProcessQueue: false,
  acceptedFiles: acceptedFiles_image,
   init: function ()  {
    this.hiddenFileInput.removeAttribute('multiple');
      this.on("error", function (file, message) {
          if (file.size > this.options.maxFilesize * 1000 * 1000) {
            this.removeFile(file);
          }
          var split_str = acceptedFiles_image.split(",");
          if (split_str.indexOf(file.type) === -1 && file.size > this.options.maxFilesize * 1000 * 1000) {
            toastr.error("Accepts only images");
            this.removeFile(file);
            return true;
          }
          if(message.substring(0,16) == "You can't upload" ){
            toastr.error("Accepts only images");
            this.removeFile(file);
            return true;
          }
      }); 
      this.on("addedfile", function(file) {
        $("#CourseSettingsBanner1del").remove();
        if (currentCoverFile) {
          this.removeFile(currentCoverFile);
        }
        currentCoverFile = file;
      });
  },
  thumbnail: function(file, dataUrl) {
      if (file.size > this.options.maxFilesize * 1000 * 1000) {
          toastr.error("File size is too big, Max file size allowed is 4MB");
          return true;
      }
      if (file.previewElement) {
        file.previewElement.classList.remove("dz-file-preview");
        var images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
        for (var i = 0; i < images.length; i++) {
            var thumbnailElement = images[i];
            thumbnailElement.alt = file.name;
            thumbnailElement.src = dataUrl;
            $("#dropzoneTestimonial").next().remove(); 
            $(".dropzone_1_prev").attr("style", "display:block;");
            $(".dropzone_1_image_preview").attr('src', dataUrl);
            $(".dropzone_1_image_preview").attr('style', "width: 100%;height: 250px;");
            $("#demo-upload_1 .dz-default").attr("id", "CourseSettingsBanner1");
            $("#demo-upload_1 .dz-default").after(`<img id="CourseSettingsBanner1del" class="delete_file" data-file_prop_name="Cover Image" data-bs-toggle="modal" data-bs-target="#delete-add" src="../assets/images/delete-round.png">`);
        }
        file.previewElement.classList.add("dz-image-preview");
      }
  }
};

// Form validation
$.urlParam = function(name, parameter){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(parameter);
  if (results==null) {
     return null;
  }
  return decodeURI(results[1]) || 0;
}
var frmvalidatorfrm;
var frmvalidatorfrmUser;
var frmvalidatorfrmStream;
$.validator.addMethod("pattern", function (value, element, param) {
  if (this.optional(element)) { return true; }
  if (typeof param === "string") {
    param = new RegExp("^(?:" + param + ")$");
  }
  return param.test(value);
}, "Check your inputs");
var frmvalidatorfrm = $("#frmNewCmsIns").validate({
  ignore:'',
  rules: {
    ins_name: { required: true, minlength: 1, maxlength: 256 },
    ins_website: { required: false, url: true},
    ins_phone_no: { required: false, minlength: 10, maxlength: 10 },
    ins_email_id: { required: true, email: true },
    //ins_address_line_1: { required: false},
    //ins_address_line_2: { required: false},
    //ins_city: { required: false},
    //ins_state: { required: false},
    //ins_country: { required: false},
    ins_zip_code: { required: false, minlength: 6, maxlength: 6 },
    ins_organization: { required: true },
    //ins_registration_details: { required: false },
    //ins_recogonition_details: { required: false },
  },
  messages: {
    ins_name: {
      required: "Please enter Institute Name",
      minlength: "Institute Name must consist of at least 1 characters",
      maxlength: "Institute Name must consist of max of 256 characters",
    },
    ins_website: {
      url: "Enter Valid Website",
    },
    ins_phone_no: {
      minlength: "Enter Valid Phone Number",
      maxlength: "Enter Valid Phone Number",
    },
    ins_email_id: {
      required: "Please enter Email",
      minlength: "Email must consist of at least 1 characters",
      maxlength: "Email must consist of max of 256 characters",
    },
    ins_zip_code: {
      minlength: "Enter valid Zip Code",
      maxlength: "Enter valid Zip Code",
    },
    ins_organization: {
      required: "Please select Organization",
    }
  },
  errorElement: "em",
  errorPlacement: function (error, element) {
    error.addClass("help-block");
    if (element.prop("type") === "checkbox") {
      error.insertAfter(element.parent("label"));
    } else {
      error.insertAfter(element);
    }
    if (element.attr("type") == "radio") {
        error.insertAfter(element.parent().parent());
    } else {
        error.insertAfter(element);
    }
    if (element.attr("name") == "ins_phone_no") {
        error.insertAfter($("#ins_phone_no").closest(".iti--allow-dropdown"));
    }
    if (element.attr("name") == "ins_organization") {
        error.insertAfter($("#ins_organization").closest(".org_list_container"));
    }
  },
  highlight: function (element, errorClass, validClass) {
    if (element.getAttribute("name") == "ins_phone_no") {
      $("#ins_phone_no").addClass("is-invalid");
    }else if (element.getAttribute("name") == "ins_organization") {
      $("#ins_organization").addClass("is-invalid");
    }else{
      $(element).addClass("is-invalid");
    }
  },
  unhighlight: function (element, errorClass, validClass) {
    if (element.getAttribute("name") == "ins_phone_no") {
      $("#ins_phone_no").removeClass("is-invalid");
    }else if (element.getAttribute("name") == "ins_organization") {
      $("#ins_organization").removeClass("is-invalid");
    }else{
      $(element).removeClass("is-invalid");
    }
  }
});

$("#save_institute").on("click", function () {
  var current_element = $(this);
  current_element.prop('disabled', true);

  var logo_file = $('#demo-upload_4').get(0).dropzone.getAcceptedFiles();
  var cover_file = $('#demo-upload_1').get(0).dropzone.getAcceptedFiles();
  var isValidForm = frmvalidatorfrm.form();
  var logofile_exist = 0;
  var coverfile_exist = 0;
  if(!ins_id){
    if(logo_file.length > 0){
      logofile_exist++;
    }else{
      toastr.error("Add Logo Image.");
    }
    if(cover_file.length > 0){
      coverfile_exist++;
    }else{
      toastr.error("Add Cover Image.");
    }
  }else{
    if(logo_file.length > 0 || $(".dropzone_4_image_preview").attr("src") != ""){
      logofile_exist++;
    }else{
      toastr.error("Add Logo Image.");
    }
    if(cover_file.length > 0 || $(".dropzone_1_image_preview").attr("src") != ""){
      coverfile_exist++;
    }else{
      toastr.error("Add Cover Image.");
    }
  }
  if (isValidForm && logofile_exist > 0 && coverfile_exist > 0) {

    var ins_phone_no = $("#ins_phone_no").val() ? $("#ins_phone_no").val() : "";
    var input_phone_no = document.querySelector('#ins_phone_no');
    var iti = window.intlTelInputGlobals.getInstance(input_phone_no);
    var region_code = iti.getSelectedCountryData();
    console.log(region_code.dialCode);
    var org_id = $("#ins_organization").val() ? $("#ins_organization").val() : org_id;
    var formData = new FormData();
    formData.append("name", $("#ins_name").val() ? $("#ins_name").val() : "");
    formData.append("website", $("#ins_website").val() ? $("#ins_website").val() : "");
    formData.append("mobile_number", ins_phone_no);
    if(ins_phone_no){
      formData.append("region_code", "+"+region_code.dialCode);
    }else{
      formData.append("region_code", "");
    }
    formData.append("email_id", $("#ins_email_id").val() ? $("#ins_email_id").val() : "");
    formData.append("address_line_1", $("#ins_address_line_1").val() ? $("#ins_address_line_1").val() : "");
    formData.append("address_line_2", $("#ins_address_line_2").val() ? $("#ins_address_line_2").val() : "");
    formData.append("city", $("#ins_city").val() ? $("#ins_city").val() : "");
    formData.append("state", $("#ins_state").val() ? $("#ins_state").val() : "");
    formData.append("country", $("#ins_country").val() ? $("#ins_country").val() : "");
    formData.append("zip_code", $("#ins_zip_code").val() ? $("#ins_zip_code").val() : "");
    formData.append("organization_id", org_id);
    if(parent_id){
      formData.append("parent_id", parent_id);
    }
    formData.append("registration_details", $("#ins_registration_details").val() ? $("#ins_registration_details").val() : "");
    formData.append("recognition_detail", $("#ins_recogonition_details").val() ? $("#ins_recogonition_details").val() : "");
    //console.log(files);
    if(logo_file && logo_file.length > 0){
      $.each(logo_file, function (i, file) {
        //formData.append("image", file, file.name);
        //formData.append("image_name", file.name);
        formData.append("logo", file);
      });
    }
    if(cover_file && cover_file.length > 0){
      $.each(cover_file, function (i, file) {
        //formData.append("image", file, file.name);
        //formData.append("image_name", file.name);
        formData.append("cover_image", file);
      });
    }
    if(ins_type == "group"){
      formData.append("institute_type", "group");
    }else if(ins_type == "college"){
      formData.append("institute_type", "college");
    }
    var URL = API_BASE_URL + "institute_create/";
    var method = "POST";
    var type = "POST";
    if(ins_id != "" && ins_id != null && ins_id != undefined){
      method = "PUT";
      type = "PUT";
      URL = API_BASE_URL + "institute_basic_update/"+ins_id+"/";
    }
    $.ajax({
      url: URL,
      method: method,
      type: type, // For jQuery < 1.9
      cache: false,
      contentType: false,
      processData: false,
      data: formData,
      headers: {
        "Authorization": "Bearer " + getUserInfo().access_token
      },
      success: function (response) {
        ins_id = response.institute_id;
        var user_param = "&page_from="+page_from+"&type="+ins_type;
        if(user_id){
          user_param += "&user_id="+user_id;
        }
        var refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + '?org_id='+org_id+'&ins_id='+ins_id+user_param;    
        window.history.pushState({ path: refresh }, '', refresh);
        current_element.removeAttr("disabled");
        /*if(method == "POST"){
          toastr.success("Institute created successfully.");
        }else{
          toastr.success("Organization updated successfully.");
        }*/
        hideStage(1);showStage(2);
        //getOrglistCall("");
        //window.sharedEditCourseId = "";
      },
      error: function (error) {

        var errorJson = jQuery.parseJSON(error.responseText);
        console.log(errorJson);
        if(errorJson){
          toastr.error(errorJson);
        }
        current_element.removeAttr("disabled");
      } 
    });
  }else{
    //hideStage(1);showStage(2);
    current_element.removeAttr("disabled");
  }
});
/**** Institute section Ends ****/
/**** Admin section Starts ****/

var dropzone_1 = new Dropzone('#demo-upload_1', dropzone_1options);
$("#demo-upload_1 .dz-default").attr("id", "CourseSettingsBanner");
$("#demo-upload_1 .dz-default").empty();

//dropzone with image upload for User Profile Image
var currentProfileFile = null;
var dropzone_2options = {
  previewTemplate: document.querySelector('#preview-template_2').innerHTML,
  parallelUploads: 1,
  thumbnailHeight: 250,
  thumbnailWidth: 960,
  maxFilesize: 4,
  maxFiles:1,
  filesizeBase: 1000,
  autoProcessQueue: false,
  acceptedFiles: acceptedFiles_image,
   init: function ()  {
    this.hiddenFileInput.removeAttribute('multiple');
      this.on("error", function (file, message) {
          if (file.size > this.options.maxFilesize * 1000 * 1000) {
            this.removeFile(file);
          }
          var split_str = acceptedFiles_image.split(",");
          if (split_str.indexOf(file.type) === -1 && file.size > this.options.maxFilesize * 1000 * 1000) {
            toastr.error("Accepts only images");
            this.removeFile(file);
            return true;
          }
          if(message.substring(0,16) == "You can't upload" ){
            toastr.error("Accepts only images");
            this.removeFile(file);
            return true;
          }
      }); 
      this.on("addedfile", function(file) {
        $("#CourseSettingsBanner2del").remove();
        if (currentProfileFile) {
          this.removeFile(currentProfileFile);
        }
        currentProfileFile = file;
      });
  },
  thumbnail: function(file, dataUrl) {
      if (file.size > this.options.maxFilesize * 1000 * 1000) {
          toastr.error("File size is too big, Max file size allowed is 4MB");
          return true;
      }
      if (file.previewElement) {
        file.previewElement.classList.remove("dz-file-preview");
        var images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
        for (var i = 0; i < images.length; i++) {
            var thumbnailElement = images[i];
            thumbnailElement.alt = file.name;
            thumbnailElement.src = dataUrl;
            //$("#dropzoneTestimonial").next().remove(); 
            $(".dropzone_2_prev").attr("style", "display:block;");
            $(".dropzone_2_image_preview").attr('src', dataUrl);
            $(".dropzone_2_image_preview").attr('style', "width: 100%;height: 250px;");
            $("#demo-upload_2 .dz-default").attr("id", "CourseSettingsBanner2");
            $("#demo-upload_2 .dz-default").after(`<img id="CourseSettingsBanner2del" class="delete_file" data-file_prop_name="Profile Image" data-bs-toggle="modal" data-bs-target="#delete-add" src="../assets/images/delete-round.png">`);
        }
        file.previewElement.classList.add("dz-image-preview");
      }
  }
};
var dropzone_2 = new Dropzone('#demo-upload_2', dropzone_2options);
$("#demo-upload_2 .dz-default").attr("id", "CourseSettingsBanner");
$("#demo-upload_2 .dz-default").empty();

var frmvalidatorfrmUser = $("#frmNewCmsUser").validate({
  ignore:'',
  rules: {
    user_first_name: { required: true, minlength: 1, maxlength: 256 },
    //user_last_name: { required: false},
    user_phone_no: { required: false, minlength: 10, maxlength: 10 },
    user_email_id: { required: true, email: true },
    //user_address_line_1: { required: false},
    //user_address_line_2: { required: false},
    //user_city: { required: false},
    //user_state: { required: false},
    //user_country: { required: false},
    user_zip_code: { required: false, minlength: 6, maxlength: 6 },
    //user_qualification: { required: false },
    //user_description: { required: false },
  },
  messages: {
    user_first_name: {
      required: "Please enter First Name",
      minlength: "FIrst Name must consist of at least 1 characters",
      maxlength: "First Name must consist of max of 256 characters",
    },
    user_phone_no: {
      minlength: "Enter Valid Phone Number",
      maxlength: "Enter Valid Phone Number",
    },
    user_email_id: {
      required: "Please enter Email",
      minlength: "Email must consist of at least 1 characters",
      maxlength: "Email must consist of max of 256 characters",
    },
    user_zip_code: {
      minlength: "Enter valid Zip Code",
      maxlength: "Enter valid Zip Code",
    },
    ins_organization: {
      required: "Please select Organization",
    }
  },
  errorElement: "em",
  errorPlacement: function (error, element) {
    error.addClass("help-block");
    if (element.prop("type") === "checkbox") {
      error.insertAfter(element.parent("label"));
    } else {
      error.insertAfter(element);
    }
    if (element.attr("type") == "radio") {
        error.insertAfter(element.parent().parent());
    } else {
        error.insertAfter(element);
    }
    if (element.attr("name") == "user_phone_no") {
        error.insertAfter($("#user_phone_no").closest(".iti--allow-dropdown"));
    }
  },
  highlight: function (element, errorClass, validClass) {
    if (element.getAttribute("name") == "user_phone_no") {
      $("#user_phone_no").addClass("is-invalid");
    }else{
      $(element).addClass("is-invalid");
    }
  },
  unhighlight: function (element, errorClass, validClass) {
    if (element.getAttribute("name") == "user_phone_no") {
      $("#user_phone_no").removeClass("is-invalid");
    }else{
      $(element).removeClass("is-invalid");
    }
  }
});

$("#save_user_details").on("click", function () {
  var current_element = $(this);
  current_element.prop('disabled', true);

  var profile_file = $('#demo-upload_2').get(0).dropzone.getAcceptedFiles();
  var isValidForm = frmvalidatorfrmUser.form();
  var profilefile_exist = 0;
  if(!user_id){
    if(profile_file.length > 0){
      profilefile_exist++;
    }else{
      toastr.error("Add Profile Image.");
    }
  }else{
    if(profile_file.length > 0 || $(".dropzone_2_image_preview").attr("src") != ""){
      profilefile_exist++;
    }else{
      toastr.error("Add Profile Image.");
    }
  }
  if (isValidForm && profilefile_exist > 0) {

    var user_phone_no = $("#user_phone_no").val() ? $("#user_phone_no").val() : "";
    var input_phone_no = document.querySelector('#user_phone_no');
    var iti = window.intlTelInputGlobals.getInstance(input_phone_no);
    var region_code = iti.getSelectedCountryData();
    console.log(region_code.dialCode);
    var org_id = $("#ins_organization").val() ? $("#ins_organization").val() : org_id;
    var formData = new FormData();
    formData.append("first_name", $("#user_first_name").val() ? $("#user_first_name").val() : "");
    formData.append("last_name", $("#user_last_name").val() ? $("#user_last_name").val() : "");
    formData.append("mobile_number", user_phone_no);
    if(user_phone_no){
      formData.append("region_code", "+"+region_code.dialCode);
    }else{
      formData.append("region_code", "");
    }
    formData.append("roles", "Admin");
    formData.append("email_id", $("#user_email_id").val() ? $("#user_email_id").val() : "");
    formData.append("apartment_suit_unit", $("#user_address_line_1").val() ? $("#user_address_line_1").val() : "");
    formData.append("address", $("#user_address_line_2").val() ? $("#user_address_line_2").val() : "");
    formData.append("city", $("#user_city").val() ? $("#user_city").val() : "");
    formData.append("state", $("#user_state").val() ? $("#user_state").val() : "");
    formData.append("country", $("#user_country").val() ? $("#user_country").val() : "");
    formData.append("zip_code", $("#user_zip_code").val() ? $("#user_zip_code").val() : "");
    formData.append("organization_id", org_id);
    formData.append("institute_id", ins_id);
    formData.append("qualification", $("#user_qualification").val() ? $("#user_qualification").val() : "");
    formData.append("description", $("#user_description").val() ? $("#user_description").val() : "");
    //console.log(files);
    if(profile_file && profile_file.length > 0){
      $.each(profile_file, function (i, file) {
        //formData.append("image", file, file.name);
        //formData.append("image_name", file.name);
        formData.append("profile_image", file);
      });
    }
    var URL = API_BASE_URL + "user/create/";
    var method = "POST";
    var type = "POST";
    if(user_id != "" && user_id != null && user_id != undefined){
      method = "PUT";
      type = "PUT";
      URL = API_BASE_URL + "user/update/"+user_id+"/";
    }
    $.ajax({
      url: URL,
      method: method,
      type: type, // For jQuery < 1.9
      cache: false,
      contentType: false,
      processData: false,
      data: formData,
      headers: {
        "Authorization": "Bearer " + getUserInfo().access_token
      },
      success: function (response) {
        user_id = response.member_id;
        var refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + '?org_id='+org_id+'&ins_id='+ins_id+'&user_id='+user_id+"&page_from="+page_from+"&type="+ins_type;    
        window.history.pushState({ path: refresh }, '', refresh);
        current_element.removeAttr("disabled");
        hideStage(2);showStage(3);
      },
      error: function (error) {

        var errorJson = jQuery.parseJSON(error.responseText);
        console.log(errorJson);
        if(errorJson){
          toastr.error(errorJson);
        }
        current_element.removeAttr("disabled");
      } 
    });
  }else{
    //hideStage(2);showStage(3);
    current_element.removeAttr("disabled");
  }
});
/**** Admin section Ends ****/
/*** Manage Academic section Starts ***/

function stream_list_select(stream_list_data, stream_selected_list){
  
  $("#ins_stream_list").empty();
  var stream_list = "";
  $.each(stream_list_data, function( i, val ) {
    if (stream_selected_list && stream_selected_list.find(e => e.id === val.id)) {
      stream_list +=`<div class="mb-3 relative">
                      <input type="checkbox" class="form-check-input stream_options" id="${val.id}" data-item_name="${val.name}" tabindex="${i}" checked>
                      <label for="${val.id}" class="form-label stream_options_label">${val.name}</label>
                    </div>`;
    }else{
      stream_list +=`<div class="mb-3 relative">
                      <input type="checkbox" class="form-check-input stream_options" id="${val.id}" data-item_name="${val.name}" tabindex="${i}">
                      <label for="${val.id}" class="form-label stream_options_label">${val.name}</label>
                    </div>`;
    }
  });
  $("#ins_stream_list").append(stream_list);
}
function stream_list_select_byval(stream_list_data, stream_selected_list){
  
  $("#ins_stream_list").empty();
  var stream_list = "";
  $.each(stream_list_data, function( i, val ) {
    if (stream_selected_list && stream_selected_list.find(e => e === val.id)) {
      stream_list +=`<div class="mb-3 relative">
                      <input type="checkbox" class="form-check-input stream_options" id="${val.id}" data-item_name="${val.name}" tabindex="${i}" checked>
                      <label for="${val.id}" class="form-label stream_options_label">${val.name}</label>
                    </div>`;
    }else{
      stream_list +=`<div class="mb-3 relative">
                      <input type="checkbox" class="form-check-input stream_options" id="${val.id}" data-item_name="${val.name}" tabindex="${i}">
                      <label for="${val.id}" class="form-label stream_options_label">${val.name}</label>
                    </div>`;
    }
  });
  $("#ins_stream_list").append(stream_list);
}
function course_list_select(course_list_data, course_selected_list){
  
  $("#ins_course_list").empty();
  var course_list = "";
  $.each(course_list_data, function( i, val ) {
    if (course_selected_list && course_selected_list.find(e => e.id === val.id)) {
      course_list +=`<div class="mb-3 relative">
                    <input type="checkbox" class="form-check-input course_options" id="${val.id}" data-item_name="${val.name}" tabindex="${i}" checked>
                    <label for="${val.id}" class="form-label course_options_label">${val.name}</label>
                  </div>`;
    }else{
      course_list +=`<div class="mb-3 relative">
        <input type="checkbox" class="form-check-input course_options" id="${val.id}" data-item_name="${val.name}" tabindex="${i}">
        <label for="${val.id}" class="form-label course_options_label">${val.name}</label>
      </div>`;
    }
  });
  $("#ins_course_list").append(course_list);
}
function course_list_select_byval(course_list_data, course_selected_list){
  
  $("#ins_course_list").empty();
  var course_list = "";
  $.each(course_list_data, function( i, val ) {
    if (course_selected_list && course_selected_list.find(e => e === val.id)) {
      course_list +=`<div class="mb-3 relative">
                    <input type="checkbox" class="form-check-input course_options" id="${val.id}" data-item_name="${val.name}" tabindex="${i}" checked>
                    <label for="${val.id}" class="form-label course_options_label">${val.name}</label>
                  </div>`;
    }else{
      course_list +=`<div class="mb-3 relative">
        <input type="checkbox" class="form-check-input course_options" id="${val.id}" data-item_name="${val.name}" tabindex="${i}">
        <label for="${val.id}" class="form-label course_options_label">${val.name}</label>
      </div>`;
    }
  });
  $("#ins_course_list").append(course_list);
}
$("#stream_search").on("propertychange input", function(e){
  var valueChanged = false;

  if (e.type=='propertychange') {
      valueChanged = e.originalEvent.propertyName=='value';
  } else {
      valueChanged = true;
  }
  if (valueChanged) {
      
    var searched_val = $(this).val().trim().toLowerCase();
    $('.stream_options').parent().removeClass("d-none");
    $('.stream_options').each(function () {
      var list_element_value = $(this).attr("data-item_name").trim().toLowerCase();
      if(list_element_value.search(searched_val) == -1){
        $(this).parent().addClass("d-none");
      }
    });
  }
});

$("#course_search").on("propertychange input", function(e){
  var valueChanged = false;

  if (e.type=='propertychange') {
      valueChanged = e.originalEvent.propertyName=='value';
  } else {
      valueChanged = true;
  }
  if (valueChanged) {
      
    var searched_val = $(this).val().trim().toLowerCase();
    $('.course_options').parent().removeClass("d-none");
    $('.course_options').each(function () {
      var list_element_value = $(this).attr("data-item_name").trim().toLowerCase();
      if(list_element_value.search(searched_val) == -1){
        $(this).parent().addClass("d-none");
      }
    });
  }
});
var frmvalidatorfrmStream = $("#frmNewCmsStream").validate({
  ignore:'',
  rules: {
    ins_stream_name: { required: true, minlength: 1, maxlength: 256 },
  },
  messages: {
    ins_stream_name: {
      required: "Please enter Stream Name",
      minlength: "Stream Name must consist of at least 1 characters",
      maxlength: "Stream Name must consist of max of 256 characters",
    },
  },
  errorElement: "em",
  errorPlacement: function (error, element) {
    error.addClass("help-block");
    if (element.prop("type") === "checkbox") {
      error.insertAfter(element.parent("label"));
    } else {
      error.insertAfter(element);
    }
    if (element.attr("type") == "radio") {
        error.insertAfter(element.parent().parent());
    } else {
        error.insertAfter(element);
    }
  },
  highlight: function (element, errorClass, validClass) {
    $(element).addClass("is-invalid");
  },
  unhighlight: function (element, errorClass, validClass) {
    $(element).removeClass("is-invalid");
  }
});
$("#cancel_cms-stream").click(function(){
  $("#close_cms-stream").trigger("click");
});
$("#close_cms-stream").click(function(){
  //$('#add-cms_org').prop('disabled', false);
  $( '#frmNewCmsStream' ).each(function(){
      this.reset();
      frmvalidatorfrmStream.resetForm();
      $('#frmNewCmsStream .form-control').removeClass('is-invalid');
      $('#ins_stream_name').val('');
  });

  $("#add_cms-stream").text("Add");
  $("#add_cms-stream").attr("data-org_id", "");
  $('#addstreammodal').modal('hide');
});

$("#add_cms-stream").on("click", function () {
  var current_element = $(this);
  current_element.prop('disabled', true);
  var isValidForm = frmvalidatorfrmStream.form();
  if (isValidForm) {
    var ins_stream_name = $("#ins_stream_name").val();
    var formData = new FormData();
    formData.append("name", $("#ins_stream_name").val());
    var URL = API_BASE_URL + "stream/create";
    var method = "POST";
    var type = "POST";
    $.ajax({
      url: URL,
      method: method,
      type: type, // For jQuery < 1.9
      cache: false,
      contentType: false,
      processData: false,
      data: formData,
      headers: {
        "Authorization": "Bearer " + getUserInfo().access_token
      },
      success: function (response) {
        current_element.removeAttr("disabled");
        if(method == "POST"){
          toastr.success("Stream added successfully.");
        }else{
          toastr.success("Stream updated successfully.");
        }
        if(response && response?.status == "success" && response?.stream_id){
            var stream_list =`<div class="mb-3 relative">
                              <input type="checkbox" class="form-check-input stream_options" id="${response?.stream_id}" data-item_name="${ins_stream_name}">
                              <label for="${response?.stream_id}" class="form-label stream_options_label">${ins_stream_name}</label>
                            </div>`;
            
          $("#ins_stream_list").append(stream_list);
        }
        $("#close_cms-stream").trigger("click");
        //window.sharedEditCourseId = "";
      },
      error: function (error) {

        var errorJson = jQuery.parseJSON(error.responseText);
        console.log(errorJson);
        if(errorJson){
          toastr.error(errorJson);
        }
        current_element.removeAttr("disabled");
      } 
    });
  }else{
    current_element.removeAttr("disabled");
  }
});

$("#save_manage_academic").on("click", function () {
  var current_element = $(this);
  current_element.prop('disabled', true);
  var stream_selected_checkbox = [];
  $('.stream_options:checked').each(function () {
    stream_selected_checkbox.push($(this).attr('id'))
  });
  if(stream_selected_checkbox.length ==  0){
    toastr.error("Select any Stream");
  }
  var course_selected_checkbox = [];
  $('.course_options:checked').each(function () {
    course_selected_checkbox.push($(this).attr('id'))
  });
  if(course_selected_checkbox.length == 0){
    toastr.error("Select any Course");
  }
  if (stream_selected_checkbox.length > 0 && course_selected_checkbox.length > 0) {

    //var formData = new FormData();
    //formData.append("stream", JSON.stringify(stream_selected_checkbox));
    //formData.append("course_type", JSON.stringify(course_selected_checkbox));
    var URL = API_BASE_URL + "manage_academic/"+ins_id+'/';
    var method = "PATCH";
    var type = "PATCH";
    $.ajax({
      url: URL,
      method: method,
      type: type, // For jQuery < 1.9
      cache: false,
      contentType: "application/json",
      processData: false,
      data: JSON.stringify({
        "stream": stream_selected_checkbox,
        "course_type": course_selected_checkbox
      }),
      headers: {
        "Authorization": "Bearer " + getUserInfo().access_token
      },
      success: function (response) {
        if(current_element.attr("data-status")){
          $("#toOrganizationList").trigger("click");
          toastr.success("Institute "+current_element.attr("data-status")+" Successfully");
        }else{
          toastr.success("Institute Created Successfully");
        }
        current_element.removeAttr("disabled");
      },
      error: function (error) {

        var errorJson = jQuery.parseJSON(error.responseText);
        console.log(errorJson);
        if(errorJson){
          toastr.error(errorJson);
        }
        current_element.removeAttr("disabled");
      } 
    });
  }else{
    //hideStage(2);showStage(3);
    current_element.removeAttr("disabled");
  }
});

$("#preview_institute").on("click", function(){
  $("#prev-org_logo").attr("src", "");
  $("#prev-org_name").text("");
  $("#prev-ins_name").text("");
  $("#prev-ins_website").text("");
  $("#prev-org_code").text("");
  $("#prev-ins_address_line_1").text("");
  $("#prev-ins_address_line_2").text("");
  $("#prev-ins_city_state_zip").text("");
  $("#prev-ins_email_id").text("");
  $("#prev-ins_phone_no").text("");
  $("#prev-user_profile_image").attr("src", "");
  $("#prev-user_name_qualification").text("");
  $("#prev-user_address_line_1").text("");
  $("#prev-user_address_line_2").text("");
  $("#prev-user_city_state_zip").text("");
  $("#prev-user_description").text("");
  $("#prev-user_email_id").text("");
  $("#prev-user_phone_no").text("");
  if(ins_id){
    $.ajax({
      url: API_BASE_URL + 'institute/details/'+ins_id+'/',
      type: "GET",
      headers: {
        "Authorization": "Bearer " + getUserInfo().access_token,
        "Content-Type": "application/json"
      },
      success:function(response){
        console.log(response)
        if(response){
          //prev-stream_list
            var ins_city_state_zip = response.city ? response.city: "";
            console.log(ins_city_state_zip);
            if(ins_city_state_zip){
              ins_city_state_zip += response.state ? ", " + response.state : "";
            }else{
              ins_city_state_zip += response.state ? response.state : "";
            }
            if(ins_city_state_zip){
              ins_city_state_zip += response.country ? ", " + response.country : "";
            }else{
              ins_city_state_zip += response.country ? response.country : "";
            }
            if(ins_city_state_zip){
              ins_city_state_zip += response.zip_code ? " - "+response.zip_code : "";
            }else{
              ins_city_state_zip += response.zip_code ? response.zip_code : "";
            }
            var mobile_number = "";
            if(response.phone_number){
              mobile_number = (response.region_code ? response.region_code+" " : "")+ response.phone_number;
            }else{
              $(".ins_phone_prev").addClass("d-none");
            }
            if(!response.email_id){
              $(".ins_email_prev").addClass("d-none");
            }
            $("#prev-org_logo").attr("src", response.logo ? response.logo : "");
            $("#prev-org_name").text(response.organization_name ? response.organization_name : "");
            $("#prev-ins_name").text(response.name ? response.name : "");
            $("#prev-ins_website").text(response.website ? response.website : "");
            $("#prev-org_code").text(response.organization_code ? response.organization_code : "");
            $("#prev-ins_address_line_1").text(response.address_line_1 ? response.address_line_1 : "");
            $("#prev-ins_address_line_2").text(response.address_line_2 ? response.address_line_2 : "");
            $("#prev-ins_city_state_zip").text(ins_city_state_zip);
            $("#prev-ins_email_id").text(response.email_id ? response.email_id : "");
            $("#prev-ins_email_id").attr("title", response.email_id ? response.email_id : "");
            $("#prev-ins_phone_no").text(mobile_number);
            if(response.member_details.length > 0){
              $.each(response.member_details, function( i, val ) {
                if(i == 0){
                  var user_name_qualification = val.first_name ? val.first_name +(val.last_name ? " "+val.last_name : "") : "";
                  if(user_name_qualification){
                    user_name_qualification += val.qualification ? "[ "+val.qualification+" ]" : "";
                  }
                  var user_city_state_zip = val.city ? val.city: "";
                  if(user_city_state_zip){
                    user_city_state_zip+= val.state ? ", "+val.state : "";
                  }else{
                    user_city_state_zip+= val.state ? val.state : "";
                  }
                  if(user_city_state_zip){
                    user_city_state_zip+= val.country ? ", "+val.country : "";
                  }else{
                    user_city_state_zip+= val.country ? val.country : "";
                  }
                  if(user_city_state_zip){
                    user_city_state_zip+= val.zip_code ? " - "+val.zip_code : "";
                  }else{
                    user_city_state_zip+= val.zip_code ? val.zip_code : "";
                  }var user_mobile_number = "";
                  if(val.phone_number){
                    user_mobile_number = (val.region_code ? val.region_code+" " : "")+ val.phone_number;
                  }else{
                    $(".user_phone_prev").addClass("d-none");
                  }
                  if(!val.email_id){
                    $(".user_email_prev").addClass("d-none");
                  }
                  $("#prev-user_profile_image").attr("src", val.m_image ? val.m_image : "");
                  $("#prev-user_name_qualification").text(user_name_qualification);
                  $("#prev-user_address_line_1").text(val.apartment_suit_unit ? val.apartment_suit_unit : "");
                  $("#prev-user_address_line_2").text(val.street_address ? val.street_address : "");
                  $("#prev-user_city_state_zip").text(user_city_state_zip);
                  $("#prev-user_description").text(val.description ? val.description : "");
                  $("#prev-user_email_id").text(val.email_id ? val.email_id : "");
                  $("#prev-user_email_id").attr("title", val.email_id ? val.email_id : "");
                  $("#prev-user_phone_no").text(val.phone_number ? val.phone_number : "");
                }
              });
            }
            $("#prev-stream_list").empty();
            $('.stream_options:checked').each(function (e) {
              var stream_option_name = $(this).attr("data-item_name").trim();
              if(stream_option_name){
                $("#prev-stream_list").append(`<li class="form-label li_item mb-3">${stream_option_name}</li>`);
              }
            });
            $("#prev-course_list").empty();
            $('.course_options:checked').each(function (e) {
              var course_option_name = $(this).attr("data-item_name").trim();
              if(course_option_name){
                $("#prev-course_list").append(`<li class="form-label li_item mb-3">${course_option_name}</li>`);
              }
            });
        }
      },
      error: function(error) {
        if (error.status === 401) {
          alert("Session Expired, Please login again.");
          logoutSession();
        }
        //toastr.error("Response Error: " + error.message);
        console.log(error);
      }
    });
  }
});
$("#prev-edit_icon").on("click", function(){
  hideStage(3);showStage(1);
})
/*** Manage Academic section Ends ***/