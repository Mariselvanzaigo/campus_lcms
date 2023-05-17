
var selector = ".org-list ul li a";

$(selector).on("click", function () {
  $(selector).removeClass("active");
  $(this).addClass("active");
});
$(document).ready(function(){
  getOrglistCall("");
  $('#searchOrganization').on('blur', function(e) {
    e.stopImmediatePropagation();
    searchOrgOnBlur();
  });
});

var searchOrganization_inp = document.getElementById("searchOrganization");
searchOrganization_inp.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    var searchVal = $("#searchOrganization").val().trim();
    getOrglistCall(searchVal);
  }
});

var go_to_pageto_inp = document.getElementById("go_to_pageto");
go_to_pageto_inp.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    $("#gotoques").trigger("click");
  }
});

$(document).on("click", "#resetButtonOrglist", function(e){
e.stopImmediatePropagation();
  $("#searchOrganization").val("");
  //$("#search_data_sortby").val("");

  localStorage.setItem("orgl_pageNum", "");
  localStorage.setItem("orgl_search", "");
  $("#go_to_pageto").val("");
  getOrglistCall("");
});
window.onbeforeunload = function (e) {
  window.onunload = function () {
    emptylocalStorageOrgList();
  }
  return undefined;
};

function searchOrgOnBlur(){
  var searchVal = $("#searchOrganization").val().trim();
  getOrglistCall(searchVal);
}
function emptylocalStoragePlatform(){
  localStorage.setItem("orgl_pageNum", "");
  localStorage.setItem("orgl_search", "");
  $("#go_to_pageto").val(""); 
}
function getOrglistCall(searchVal){

  localStorage.setItem("orgl_pageNum", "");
  localStorage.setItem("orgl_search", "");
  $("#go_to_pageto").val("");

  console.log(searchVal);
  if(searchVal){
    searchVal = "?search="+searchVal;
    $('#resetButtonOrglist').removeClass("d-none");
  }else{
    $('#resetButtonOrglist').addClass("d-none");
  }
  getOrglist(searchVal);
}

//To Paginate platform list Data
function getOrglist(parameter){
  let isFirst = true;
  var orgl_search = localStorage.getItem("orgl_search");
  //console.log('orgl_search', orgl_search);
  if(isFirst == true && orgl_search != ""){
    var url = new URLSearchParams(orgl_search);
    var search_inp = url.get("search");
    var searchval = 0;
    if(search_inp != "" && search_inp != null){
      $("#searchOrganization").val(search_inp);
      searchval++;
    }
    if(searchval > 0){
      $('#resetButtonOrglist').removeClass("d-none");
    }else{
      $('#resetButtonOrglist').addClass("d-none");
    }
    parameter = orgl_search;
  }
  if($( "#pagination-container-to" ).length > 0) {
    $('#pagination-container-to').pagination({
      dataSource: API_BASE_URL + 'active_organization/list'+parameter,
      locator: 'data',
      totalNumberLocator: function(response) {
        setTimeout(function() {
        $(".paginationjs-prev").attr("data-num", "1");
        $(".paginationjs-next").attr("data-num", response.total_pages);
        $("#go_to_pageto").attr("min", 1);
        $("#go_to_pageto").attr("max", response.total_pages);
        }, 500);
        return response.total;
      },
      alias: {
        pageNumber: 'page',
        pageSize: 'per_page',
      },  
      pageSize: 9,
      ajax: {
        beforeSend: function(request) {
          if(getUserInfo() == null){
            console.log(SITE_URL_PROTOCOL);
            window.location.href = SITE_URL_PROTOCOL+"/login";
          }
          request.setRequestHeader("Authorization", "Bearer " + getUserInfo().access_token);
        },
        complete: function(jqXHR, textStatus) {
          if (jqXHR.status === 200 || jqXHR.readyState === 0 || jqXHR.status === 0) {
              var orgl_pageNum = localStorage.getItem("orgl_pageNum");
             if(isFirst == true && orgl_pageNum != ""){
               $("#go_to_pageto").val(orgl_pageNum);
               $("#gotoques").trigger('click');
             }
            if(isFirst){
              isFirst = false;
            }
            return false; // do nothing
          } else if (jqXHR && (jqXHR.status === 403)) {
            //window.location.href = SITE_URL_PROTOCOL;
            logoutSession();
          } else if (jqXHR.status === 401) {
            alert("Session Expired, Please login again.");
            //window.location.href = SITE_URL_PROTOCOL;
            logoutSession();
          } else {
            if(isFirst){
              isFirst = false;
            }
            //alert("Session Expired, Please login again.");
          }

        },     
      },
      callback: function(data, pagination) {
        ////console.log(data);
        if(pagination.totalNumber < 10){
          //$("#pagination-container-to").hide();
          $(".OrglistPagination").attr("style", "display:none");
        }else{
          //$("#pagination-container-to").show();
          $(".OrglistPagination").attr("style", "display:block");
          $(".paginationjs-next").attr("title", "Last Page");
          $(".paginationjs-prev").attr("title", "First Page");
        }
        //console.log(parameter);
        if(parameter != ''){
          localStorage.setItem("platforml_search", parameter);
        }
        $("#orglist-loader").removeClass("disp_block");
        $("#orglist-loader").addClass("disp_none");
        $("#cms-org_list").removeClass("disp_none");
        $("#cms-org_list").addClass("disp_block");
        $("#no_records_org_main_p").text("No Records have been found. Click the button below to create one.");
        $("#add_org_button_main").html(`<i class="fas fa-plus"></i> Add Organization`);
        $("#add_org_button_main").removeAttr("data-n-linkto");
        $("#add_org_button_main").attr("data-bs-toggle", "modal");
        $("#add_org_button_main").attr("data-bs-target", "#exampleModalXl"); 
        $("#add_org_button_top").html(`<i class="fas fa-plus"></i> Add Organization`);
        $("#add_org_button_top").removeAttr("data-n-linkto");
        $("#add_org_button_top").attr("data-bs-toggle", "modal");
        $("#add_org_button_top").attr("data-bs-target", "#exampleModalXl");
        $("#add_org_container_main").removeClass("d-none");
        $("#cms_institute_modules").addClass("d-none");
        $("#cms_institute_module_name").addClass("d-none");
        if(data.length === 0){
          //$(".questionPagination").attr("style", "display:none");
          if(parameter != ""){
            $("#nodataFound_orglist").attr("style", "display:block");
            $("#no_records_org_main_img").addClass("d-none");
            $("#no_records_org_main_p").addClass("d-none");
            //$("#add_org_container_main").addClass("d-none");
          }else{
            $("#nodataFound_orglist").attr("style", "display:block");
            $("#no_records_org_main_img").removeClass("d-none");
            $("#no_records_org_main_p").removeClass("d-none");
            //$("#add_org_container_main").removeClass("d-none"); 
          }
        }else{
          $("#no_records_org_main_img").addClass("d-none");
          $("#no_records_org_main_p").addClass("d-none");
          //$(".questionPagination").attr("style", "display:block");
          $("#nodataFound_orglist").attr("style", "display:none");
        }

        $("#pagination-container-to ul li").click(function(){
          $("#go_to_pageto").val("");
        });
        var html = getOrglistData(data);
        if(isFirst == false){
          if(pagination.pageNumber){
            localStorage.setItem("orgl_pageNum", pagination.pageNumber);
          }
        }
      }
    });
  }
}

function getOrglistData(data){
  $("#cms-org_list").empty();
  if(data){
    $.each( data, function( i, val ) {
      var org_institute_count = val.institute_count < 10 ? "0"+val.institute_count : val.institute_count;
      $("#cms-org_list").append(`<li data-org_id="${val.id}" data-org_institute_count="${val.institute_count}"><a href="javascript:void(0);">${val.organization_name} </a><div class="d-flex justify-content-between align-items-center side-icons"><span>${org_institute_count}</span><span class="cursor-pointer"><img style="width:18px;margin-top: 0px;opacity: 0.7;" src="../assets/images/edits.png" class="editOrganization" data-org_id="${val.id}"></span><span class="cursor-pointer"><img style="width:16px; margin:6px;" src="../assets/images/deleteicon.png" class="deleteOrganization" title="Delete" data-org_id="${val.id}" data-org_name="${val.organization_name}""></span></div></li>`);
    });
  }
}
$.urlParam = function(name, parameter){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(parameter);
  if (results==null) {
     return null;
  }
  return decodeURI(results[1]) || 0;
}
var frmvalidatorfrm;
$.validator.addMethod("pattern", function (value, element, param) {
  if (this.optional(element)) { return true; }
  if (typeof param === "string") {
    param = new RegExp("^(?:" + param + ")$");
  }
  return param.test(value);
}, "Check your inputs");
var frmvalidatorfrm = $("#frmNewCmsOrg").validate({
  ignore:'',
  rules: {
    create_org_organization_name: { required: true, minlength: 1, maxlength: 256 },
    create_org_organization_code: { required: true, minlength: 1, maxlength: 256 },
  },
  messages: {
    create_org_organization_name: {
      required: "Please enter Organization Name",
      minlength: "Your Organization Name must consist of at least 1 characters",
      maxlength: "Your Organization Name must consist of max of 256 characters",
    },
    create_org_organization_code: {
      required: "Please enter Organization Code",
      minlength: "Organization Code must consist of at least 1 characters",
      maxlength: "Organization Code must consist of max of 256 characters",
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
    if (element.attr("name") == "master_course_selected") {
        error.insertAfter($("#search_course_data"));
    }
  },
  highlight: function (element, errorClass, validClass) {
    if (element.getAttribute("name") == "master_course_selected") {
      $("#search_course_data").addClass("is-invalid");
    }else{
      $(element).addClass("is-invalid");
    }
  },
  unhighlight: function (element, errorClass, validClass) {
    if (element.getAttribute("name") == "master_course_selected") {
      $("#search_course_data").removeClass("is-invalid");
    }else{
      $(element).removeClass("is-invalid");
    }
  }
});
$("#cancel_cms-org").click(function(e){
  e.stopImmediatePropagation();
  $("#close_cms-org").trigger("click");
});
$("#close_cms-org").click(function(e){
  e.stopImmediatePropagation();
  //$('#add-cms_org').prop('disabled', false);
  $( '#frmNewCmsOrg' ).each(function(){
      this.reset();
      frmvalidatorfrm.resetForm();
      $('#frmNewCmsOrg .form-control').removeClass('is-invalid');
      $('#create_org_organization_name').val('');
      $('#create_org_organization_code').val('');
  });

  $("#add_cms-org").text("Add");
  $("#add_cms-org").attr("data-org_id", "");
  $("#exampleModalXlLabel").text("Add Organization");
  $('#exampleModalXl').modal('hide');
});

$("#add_cms-org").on("click", function (e) {
  e.stopImmediatePropagation();
  var current_element = $(this);
  var data_organization_id = current_element.attr("data-org_id");
  current_element.prop('disabled', true);
  var isValidForm = frmvalidatorfrm.form();
  if (isValidForm) {

    var group_name = $("#create_org_group_name").val();
    var group_data = [];
    group_data.push({"name": group_name, "level": 1});

    var formData = new FormData();
    formData.append("name", $("#create_org_organization_name").val());
    formData.append("code", $("#create_org_organization_code").val());
    var URL = API_BASE_URL + "create_organization/";
    var method = "POST";
    var type = "POST";
    if(data_organization_id != "" && data_organization_id != null && data_organization_id != undefined){
      method = "PUT";
      type = "PUT";
      URL = API_BASE_URL + "update_organization/"+data_organization_id+"/";
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
        current_element.removeAttr("disabled");
        if(method == "POST"){
          toastr.success("Organization created successfully.");
        }else{
          toastr.success("Organization updated successfully.");
        }
        $("#close_cms-org").trigger("click");
         getOrglistCall("");
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

$(document).on("blur", "#create_org_organization_name", function (e) {
  e.stopImmediatePropagation();
  var str = $(this).val().trim();
  if(str){
    var acpref = str.substring(0, 4);
    $("#create_org_organization_code").val(acpref.str_replace(' ', '-').toUpperCase());
  }
});
$(document).on("click", ".editOrganization", function(e){
  e.stopImmediatePropagation();
  var org_id = $(this).attr("data-org_id");
  console.log(org_id);
  if(org_id != "" && org_id != null && org_id != undefined){
    $("#cms-org_list li").removeClass("active_org");
    $(this).closest("li").addClass("active_org");
    $.ajax({
      url: API_BASE_URL + 'single_organization_details/'+org_id,
      type: "GET",
      headers: {
        "Authorization": "Bearer " + getUserInfo().access_token,
        "Content-Type": "application/json"
      },
      success:function(response){
        var resp = response?.data;
        if(resp){
            $("#create_org_organization_name").val(resp.organization_name ? resp.organization_name : "");
            $("#create_org_organization_code").val(resp.organization_code ? resp.organization_code : "");
            $("#add_cms-org").text("Update");
            $("#add_cms-org").attr("data-org_id", org_id);
            $("#exampleModalXlLabel").text("Edit Organization");
            //$('#add-cms_org_plusbutton').trigger("click");
            $('#exampleModalXl').modal('toggle');
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

$(document).on("click", ".deleteOrganization", function(e){
  e.stopImmediatePropagation();
  var org_id = $(this).attr("data-org_id");
  var org_name = $(this).attr("data-org_name");
  console.log(org_id);
  if(org_id != "" && org_id != null && org_id != undefined){
    $("#delete_module_name_msg").html(`<p> Are you sure you want to delete the Organization: ${org_name} ? </p>`);
    $("#delete_org_id").val(org_id);
    $("#delete_org_id").attr("data-delete_module_type", "organization");
    $("#delete_org_id").attr("data-page", "organization");
    $("#deletemodal").modal('toggle');
  }
});
$(document).on("click", ".close_delete_modal_pop", function(e){
  e.stopImmediatePropagation();
  $("#deletemodal").modal('toggle');
});

$(document).on("click", "#delete_popup_confirm", function(e){
  e.stopImmediatePropagation();

    var org_id = $("#delete_org_id").val();
    var current_element = $('[data-this_parent_id="'+org_id+'"]');
    var url = "";
    var data_send = "";
    var method = "";
    var page = $("#delete_org_id").attr("data-page");
    var delete_module_type = $("#delete_org_id").attr("data-delete_module_type");
    if(delete_module_type == "organization"){
      var URL = API_BASE_URL + "delete_organization/"+org_id+"/";
      var data_send = JSON.stringify({
        "status": "2"
      });
      var method = "DELETE";
    }else if(delete_module_type == "institute"){
      var URL = API_BASE_URL + "institute/delete/"+org_id+"/";
      var data_send = JSON.stringify({
        "status": "2"
      });
      var method = "DELETE";
    }else if(delete_module_type == "college"){

      var URL = API_BASE_URL + "institute/delete/"+org_id+"/";
      var data_send = JSON.stringify({
        "status": "2"
      });
      var method = "DELETE";
    }
    if(org_id != "" && org_id != null && org_id != undefined){
      $.ajax({
        url: URL,
        type: method,
        data: data_send,
        headers: {
            "Authorization" : "Bearer " + getUserInfo().access_token,
            "Content-Type": "application/json"
        },
        success: function(response){
          $("#deletemodal").modal('toggle');
          if(delete_module_type == "organization"){
            toastr.success("Organization Deleted Successfully.");
            var searchVal = $("#searchOrganization").val().trim();
            getOrglistCall("");
          }else if(delete_module_type == "institute"){
            // if(page == "organization"){
            //   getOrglistCall("");
            // }
            current_element.remove();
            toastr.success("Institute Deleted Successfully.");
          }else if(delete_module_type == "college"){
            // if(page == "organization"){
            //   getOrglistCall("");
            // }
            toastr.success("College Deleted Successfully.");
            current_element.remove();
          }
        },
        error: function(error) {
              if (error.status === 401) {
                alert("Session Expired, Please login again.");
                logoutSession();
              }
              if (error.msg){
                toastr.error(error.msg);
              }else{
                toastr.error("Response Error: " + error.message);
              }
            console.log(error);
        }
    });
  }
});
$(document).on("click", "#cms-org_list li", function(e){
  e.stopImmediatePropagation();
  $("#cms-org_list li").removeClass("active_org");
  $(this).addClass("active_org");
  var org_id = $(this).attr("data-org_id");
  var org_institute_count = $(this).attr("data-org_institute_count");
  
  if(org_id != "" && org_id != null && org_id != undefined && org_institute_count != 0){
    orgtoNoInstitute2(org_id);
    $("#cms_institute_module-loader").removeClass("d-none");
    var organization_name = $(this).find('a').text().trim();
    $("#cms_institute_module_name_text").text(organization_name);
    $("#cms_institute_module_name_text").attr("data-org_id", org_id);
    $("#cms_institute_module_name").removeClass("d-none");
    var parent_div = $("<div class='row'></div>");
    var newDIV = $("<ul class='col-lg-12 col-md-12 course coursesortable' id='course_box'></ul>");
    var outerHtml = '';
    $.ajax({
      url: API_BASE_URL + 'institute_list/?organization_id='+org_id,
      type: "GET",
      headers: {
        "Authorization": "Bearer " + getUserInfo().access_token,
        "Content-Type": "application/json"
      },
      success:function(resp){
        if(resp){
            console.log(resp);

            var has_child = "no_child";
            if (resp.children.length > 0){
              has_child = "has_child";
            }
            $("#cms_institute_module_name_text").text(resp.organization_name);
            //$("#cms_institute_module_name_text").attr("data-org_id"+resp.organization_id);
            //newDIV.append("<li class='module module_"+resp.level+" main_mod "+has_child+"' id='"+resp.level+"' data-this_parent_id='"+org_id+"' data-parent_id='"+org_id+"' data-unique_id='module_"+resp.level+resp.id+"'></li>");
            if(resp.children.length > 0){
              get_list( resp.children, newDIV, 1);
            }
            parent_div.append(newDIV); 
            var outerHtml = parent_div.prop('outerHTML');
            document.getElementById("cms_institute_modules").innerHTML = outerHtml;
            /*setTimeout(function(){
              callNestedSort();
            }, 1000);*/
            $("#cms_institute_module-loader").addClass("d-none");
            $("#cms_institute_modules").removeClass("d-none");
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
    orgtoNoInstitute(org_id);
  }
});
function orgtoInstitute(){
  $("#cms_institute_modules").removeClass("d-none");
  $("#cms_institute_module_name").removeClass("d-none");
}
function orgtoNoInstitute(org_id){
  $("#no_records_org_main_img").removeClass("d-none");
  $("#no_records_org_main_p").removeClass("d-none");
  $("#add_org_container_main").removeClass("d-none");
  $("#no_records_org_main_p").text("No Records have been found. Click the button below to create one.");
  $("#add_org_button_main").html(`<i class="fas fa-plus"></i> Add Institute`);
  $("#add_org_button_main").attr("data-n-linkto", "addinstitute");
  $("#add_org_button_main").attr("data-n-url-org_id", org_id);
  $("#add_org_button_main").removeAttr("data-bs-toggle");
  $("#add_org_button_main").removeAttr("data-bs-target"); 
  $("#add_org_button_top").html(`<i class="fas fa-plus"></i> Add Institute`);
  $("#add_org_button_top").attr("data-n-linkto", "addinstitute");
  $("#add_org_button_top").attr("data-n-url-org_id", org_id);
  $("#add_org_button_top").removeAttr("data-bs-toggle");
  $("#add_org_button_top").removeAttr("data-bs-target");
  $("#cms_institute_modules").addClass("d-none");
  $("#cms_institute_module_name").addClass("d-none");
}
function orgtoNoInstitute2(org_id){
  $("#no_records_org_main_img").addClass("d-none");
  $("#no_records_org_main_p").addClass("d-none");
  $("#add_org_container_main").addClass("d-none");
  $("#no_records_org_main_p").text("No Records have been found. Click the button below to create one.");
  $("#add_org_button_main").html(`<i class="fas fa-plus"></i> Add Institute`);
  $("#add_org_button_main").attr("data-n-linkto", "addinstitute");
  $("#add_org_button_main").attr("data-n-url-org_id", org_id);
  $("#add_org_button_main").removeAttr("data-bs-toggle");
  $("#add_org_button_main").removeAttr("data-bs-target"); 
  $("#add_org_button_top").html(`<i class="fas fa-plus"></i> Add Institute`);
  $("#add_org_button_top").attr("data-n-linkto", "addinstitute");
  $("#add_org_button_top").attr("data-n-url-org_id", org_id);
  $("#add_org_button_top").removeAttr("data-bs-toggle");
  $("#add_org_button_top").removeAttr("data-bs-target");
}

function get_list( a, $parent , level_count_inc) {
  var levels = '';
  var newDIV = $("<div></div>");
  var org_id = $("#cms_institute_module_name_text").attr("data-org_id");
  for (var i = 0; i < a.length; i++) {
      if (a[i]) {
          var level_count = level_count_inc;
          if(a[i].parent_institute_id == null){
            var n = a[i].module_name;

            var dots = "";
            if(a[i].name.length > 75){
                dots = "...";
            }
            var input_value_substr = a[i].name.substring(0, 75)+dots;
            var input_value = a[i].name;
            var prevent_click = "";
            var style_none = "display:none;";
            var style_block = "display:block;";
            var has_child = "no_child";
            var delete_style = "display:block;";
            if (a[i].children.length > 0){
              has_child = "has_child";
            }
            var edit_icon_img = ``;
            var delete_prevent_click = "";
            var delete_case = "<ul><a data-bs-toggle='modal' data-bs-target='#mAlert' data-name='"+input_value+"' data-ins_id='"+a[i].id+"' class='dropdown-item' onClick='delete_module_confirm_chapters(this)'>Delete Chapters</a></ul>";
             
            var ins_id = a[i].id;
            var mod_type = "course";
            var can_edit = "true"; 
            var drag_drop_prevent_click = prevent_click;
            /*if(a[i].reference_case_id && a[i].is_case_delete == false){
              cid = a[i].reference_case_id;
              module_id = a[i].case_module_id;
              mod_type = "case";
              can_edit = "false"; 
              drag_drop_prevent_click = "pointer-events:none;";
            }*/
            var nondroppableelem = '';
            var nondroppableelem_addCollege = '';
            if (a[i].children.length == 0){
              nondroppableelem_addCollege = "nondroppableelem";
            }
            var uni_mod_id = "module_"+a[i].level+a[i].id;
            var uni_mod_id_str = uni_mod_id.replace(/\./g, '_');
            var final_val = '';
            newDIV = $("<li class='module module_"+a[i].level+" main_mod "+has_child+" "+nondroppableelem+"' id='"+a[i].level+"' data-this_parent_id='"+a[i].id+"' data-parent_id='"+a[i].parent_institute_id+"' data-unique_id='module_"+a[i].level+a[i].id+"'></li>");
            
            newUl = $("<ul class='main_module module_opacity ul"+uni_mod_id_str+"' style='opacity:1'></ul>");
            if (a[i].level && a[i].children.length == 0){
              //newUl.append("<li class='sub_module add_college_button add_collegemodule_"+a[i].level+" main_mod "+nondroppableelem_addCollege+"' id='"+a[i].level+"' data-parent_id='"+a[i].parent_institute_id+"'><div><span class='module_input disp_in_block flt_left' style='padding: 10px;margin-left: 40px;'><a href='javascript:void(0);' data-n-linkto='addcollege' data-n-url-ins_id='"+a[i].id+"' style='color: #F36A10;'><i class='fas fa-plus'></i> Add College</a></span></div></li>");
            }
            newUlDIV = $("<div id='"+uni_mod_id_str+"'></div>");
            newUlDIV.append("<span class='course_img_icon disp_in_block flt_left' style='"+drag_drop_prevent_click+"'><img src='../assets/images/dotline-icon.png' class='course_icon'/></span>");
            newUlDIV.append("<span class='module_input disp_in_block flt_left' style='"+prevent_click+"'><input type='text' class='input_module_fld' id='module_inp' placeholder='Add Module Name' onChange='check_value(this);' value='"+input_value+"'onblur='totextCMS(this);' style='display: none;' maxlength='256'  data-ins_id='"+a[i].id+"'/><p data-ins_id='"+a[i].id+"' id='module_module_"+a[i].level+"' data-prev_val='"+input_value+"' data-mod_type='"+mod_type+"' data-can_edit='"+can_edit+"'>"+input_value_substr+edit_icon_img+"</p></span>");
            if (a[i].children.length > 0){
              newUlDIV.append("<span class='expand_img_icon disp_in_block flt_right title-tip'><img src='../assets/images/arrow_down_icon.png' title='Expand/Collapse Children' class='expand_icon' onclick='toggle_collapse_expand(this);'/></span>");
            }else{
              newUlDIV.append("<span class='expand_img_icon disp_in_block flt_right'><p style='width: 20px;margin-top: 7px;'></p></span>");
            }
            newUlDIV.append(`<span class='expand_img_icon disp_in_block flt_right delete_module_temp'><img style='width:18px;margin-top: 6px;opacity: 0.7;margin-right: 12px' src='../assets/images/delete3.png' class='expand_icon' data-module_name="${input_value}" onclick="deleteModule(this, '${a[i].id.replace(/<[^>]*>?/gm, '').replace(/(\r\n|\n|\r)/gm, "").replace('...', '')}', 'institute');" /></span>`);
            newUlDIV.append(`<span class='expand_img_icon disp_in_block flt_right delete_module_temp'><img style='width:18px;margin-top: 6px;opacity: 0.7;margin-right: 12px' src='../assets/images/edits.png' class='expand_icon' data-n-linkto='addinstitute' data-n-url-page_from="organizationlist" data-n-url-org_id="${org_id}" data-n-url-ins_id="${a[i].id}"/></span>`);
            newUlDIV.append(`<span class='expand_img_icon disp_in_block flt_right delete_module_temp'><img style='width:25px;margin-top: 8px;opacity: 0.7;margin-right: 12px' src='../assets/images/eyeicon.png' class='expand_icon' onclick="previewInstitute('${a[i].id}', 'institute', '${org_id}', '${a[i].id}');"/></span>`);
            newUlDIV.append("<span class='expand_img_icon disp_in_block flt_right' style='margin-top: 6px;padding: 5px 10px 5px 10px;margin-right: 5px;'><a href='javascript:void(0);' data-n-linkto='addcollege' data-n-url-ins_id='"+a[i].id+"' data-n-url-page_from='organizationlist' style='color: #F36A10;'><i class='fas fa-plus'></i> Add College</a></span>");
            newDIV.append(newUlDIV);
          }else{
              var class_name = $parent.parent().prop('className').split(" ");
              var first_five_char_class = class_name[1].substring(0,5);
              if(first_five_char_class === "modul"){
                var levels = a[i].level;
              }else{
                var levels = $parent.parent().attr('id')+"."+a[i].level;
              }
              var n = a[i].name;
              var dots = "";
              if(a[i].name.length > 75){
                  dots = "...";
              }
              var input_value_substr = a[i].name.substring(0, 75)+dots;
              var input_value = a[i].name
              var prevent_click = "";
              var style_none = "display:none;";
              var style_block = "display:block;";
              var delete_style = "display:block;";
              var has_child = "no_child";
              if (a[i].children.length > 0){
                has_child = "has_child";
              }
              var edit_icon_img = '';
              var delete_prevent_click = "";
              var delete_case = "<ul><a data-bs-toggle='modal' data-bs-target='#mAlert' data-name='"+input_value+"' data-ins_id='"+a[i].id+"' class='dropdown-item' onClick='delete_module_confirm_chapters(this)'>Delete Chapters</a></ul>";
                
              var clg_id = a[i].id;
              var mod_type = "course";
              var can_edit = "true"; 
              var drag_drop_prevent_click = prevent_click;
              var levels_dotlength = levels.toString().indexOf(".");
              var parent_disp = "disp_none";
              if(levels_dotlength !== -1){
                parent_disp = "disp_block";
              }
            var nondroppableelem = '';
            /*if(a[i].asset_id != "" && a[i].asset_id != null){
              nondroppableelem = "nondroppableelem";
            }*/
            var uni_mod_id = "sub_module_"+a[i].level+a[i].id;
            var uni_mod_id_str = uni_mod_id.replace(/\./g, '_');
              var lev_mod = level_count_inc - 1;
              newDIV = $("<li class='module sub_module_"+levels+" sub_"+levels+" module_"+lev_mod+" "+has_child+" "+parent_disp+" sub_mods "+nondroppableelem+"' id='"+levels+"' data-this_parent_id='"+a[i].id+"' data-parent_id='"+a[i].parent_institute_id+"' data-unique_id='sub_module_"+levels+a[i].id+"'></li>");
              
              newUl = $("<ul class='sub_module ul"+uni_mod_id_str+"'></ul>");
              newUlDIV = $("<div id='"+uni_mod_id_str+"'></div>");
              newUlDIV.append("<span class='course_img_icon disp_in_block flt_left' style='"+drag_drop_prevent_click+"'><img src='../assets/images/dotline-icon.png' class='course_icon'/></span>");
              newUlDIV.append("<span class='module_input disp_in_block flt_left' style='"+prevent_click+"'><input type='text' class='input_module_fld' id='module_inp' placeholder='Add Module Name' onChange='check_value(this);' value='"+input_value+"'onblur='totextCMS(this);' style='display: none;' maxlength='256' data-module_id='"+a[i].id+"'/><p data-module_id='"+a[i].id+"' id='sub_"+levels+"_module_"+lev_mod+"' data-prev_val='"+input_value+"' data-mod_type='"+mod_type+"' data-can_edit='"+can_edit+"'>"+input_value_substr+edit_icon_img+"</p></span>");
              
              if (a[i].children.length > 0){
                newUlDIV.append("<span class='expand_img_icon disp_in_block flt_right'><img src='../assets/images/arrow_up_icon.png' class='expand_icon' title='Expand/Collapse Children' onclick='toggle_collapse_expand(this);'/></span>");
              }else{
                newUlDIV.append("<span class='expand_img_icon disp_in_block flt_right'><p style='width: 20px;margin-top: 7px;'></p></span>");
              }
              //newUlDIV.append("<span class='expand_img_icon disp_in_block flt_right'><img style='width:32px; margin:0;' src='../assets/images/arrow_down_icon.png' class='expand_icon' title='Details' onclick='toggle_collapse_expand_details(this);'/></span>");
              newUlDIV.append(`<span class='expand_img_icon disp_in_block flt_right delete_module_temp'><img style='width:18px;margin-top: 6px;opacity: 0.7;' src='../assets/images/delete3.png' class='expand_icon' data-module_name="${input_value}" onclick="deleteModule(this, '${a[i].id.replace(/<[^>]*>?/gm, '').replace(/(\r\n|\n|\r)/gm, "").replace('...', '')}', 'college');"/></span>`);
              newUlDIV.append(`<span class='expand_img_icon disp_in_block flt_right delete_module_temp'><img style='width:18px;margin-top: 6px;opacity: 0.7;margin-right: 12px' src='../assets/images/edits.png' class='expand_icon' data-n-linkto='addcollege' data-n-url-page_from="organizationlist" data-n-url-ins_id="${a[i].parent_institute_id}" data-n-url-clg_id="${a[i].id}"/></span>`);
              newUlDIV.append(`<span class='expand_img_icon disp_in_block flt_right delete_module_temp'><img style='width:25px;margin-top: 8px;opacity: 0.7;margin-right: 12px' src='../assets/images/eyeicon.png' class='expand_icon' onclick="previewInstitute('${a[i].id}', 'college', '${a[i].parent_institute_id}', '${a[i].id}');"/></span>`);
              newUlDIV.append("<span class='expand_img_icon disp_in_block flt_right' style='margin-top: 6px;padding: 5px 10px 5px 10px;margin-right: 5px;'><a href='javascript:void(0);' data-n-linkto='addcollege' data-n-url-ins_id='"+a[i].id+"' data-n-url-page_from='organizationlist' style='color: #F36A10;'><i class='fas fa-plus'></i> Add Group</a></span>");
              newDIV.append(newUlDIV);
          }
          if(level_count === 0){
            newDIV.append(newUl);
            $parent.append(newDIV);

          }else{ 
            newDIV.append(newUl);
            $parent.append(newDIV);
          }
          if(a[i].parent_institute_id === null){
            level_count_inc++;
          }
          if (a[i].children){
              get_list( a[i].children, newUl, level_count_inc);
          }
      }
    $parent.append(newDIV);
  }
}
$(".closepreviewmodal").on("click", function(e){
  e.stopImmediatePropagation();
  $("#previewmodal").modal("hide");
});
$("#prev-edit_icon").on("click", function(e){
  e.stopImmediatePropagation();
  $("#previewmodal").modal("hide");
});