async function addInstituteToOrganization(urlParam){
    console.log(urlParam);

}
async function addCollegeToInstitute(urlParam){
    console.log(urlParam);
}
function organizationList(urlParam){

}
function instituteList(urlParam){

}
function createprogram(){
    
}
function hideStage(stage){
	// you can validate here
	$('#stage'+stage).removeClass('active');
	$('#stage-'+stage+'-step').addClass('done');
}

function showStage(stage) {
    $(".stage_head").addClass("d-none");
    $("#stage_head_"+stage).removeClass("d-none");
	$('#stage'+stage).addClass('active');
	$('#stage-'+stage+'-step').addClass('active');
    $("#preview_institute").addClass("d-none");
    if(stage == 3){
        $("#preview_institute").removeClass("d-none");
    }
}
function getSetOrgCode(e){
    console.log(e);
    var org_id = $("#ins_organization").select2().find(":selected").val();
    if(org_id){
        var cms_ins_param = getUrlParamquery();
        console.log(cms_ins_param);
        var ins_id = cms_ins_param.ins_id;
        var user_id = cms_ins_param.user_id;
        var extra_param = "";
        if(ins_id){
            extra_param = '&ins_id='+ins_id;
        }
        if(user_id){
            extra_param = '&user_id='+user_id;
        }
        var org_code = $("#ins_organization").select2().find(":selected").data("org_code");
        console.log(org_code);
        var refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + '?org_id='+org_id+extra_param;    
        window.history.pushState({ path: refresh }, '', refresh);
        if(org_code){
            $("#ins_organization_code").val(org_code);
        }
    }
}

//Expand collapse modules starts here
function toggle_collapse_expand(e){
    var childrendivs = [];
    var unique_id = e.parentElement.parentElement.parentElement.getAttribute("data-unique_id");
    //var children = e.parentElement.parentElement.nextElementSibling.children;
    console.log(unique_id);
  
    var uni_mod_id_str = unique_id.replace(/\./g, '_');
    var children = document.getElementsByClassName('ul'+uni_mod_id_str)[0].children;
    for(var i = 0; i < children.length; i++){
        if (children[i].tagName == "LI") {
          if(children[i].classList.contains('disp_none')){
              e.src="../assets/images/arrow_up_icon.png";
              children[i].classList.add('disp_block');
              children[i].classList.remove('disp_none');
              childrendivs.push(children[i]);
          }else{
              e.src="../assets/images/arrow_down_icon.png";
              children[i].classList.add('disp_none');
              children[i].classList.remove('disp_block');
              childrendivs.push(children[i]);
          }
        }
    }
  }

// function callNestedSort(){
//     var ns = $('.coursesortable').nestedSortable({
//     scroll: true,
//     forcePlaceholderSize: true,
//     listType:"ul",
//     handle: 'div',
//     helper: 'clone',
//     items: 'li:not(.cattach):not(.nondraggable)',
//     toleranceElement: 'div>',
//     opacity: .6,
//     placeholder: 'placeholder',
//     revert: 250,
//     isTree: true,
//     expandOnHover: 700,
//     startCollapsed: false,
//     isAllowed: function(item, parent) { 
//       console.log(item);
//       var hasnoDroppable = item.parent().parent().hasClass('nondroppableelem');
//       if(hasnoDroppable){
//         console.log('hasnoDroppable');
//         return false;
//       }else{
//         return true;
//       }
//       return false;
//     },
//     update: function(event, ui){
//       var item = ui.item;
//       var target = ui.item.parent().parent();
//       var parent_id = target.attr("data-this_parent_id");
//       var parent_id_val = "";
//       if(parent_id && parent_id != "null" && parent_id != null){
//         parent_id_val = String(parent_id);
//       }else{
//         parent_id_val = null;
//       }
//       var module_id = item.attr("data-this_parent_id");
//       var level_number = item.index() + 1;
//       //var module_name = item.children().eq(0).children().eq(1).children().eq(1).attr("data-prev_val")
//       var get_submodule_level_values = {
//         //module_name: String(decodeURIComponent(module_name)),
//         rearrange: "yes",
//         level: parseInt(level_number), 
//         course_id:String(document.getElementById("cms_course_details").getAttribute("data-cid")),
//         parent_id:parent_id_val
//       }
  
//       var url = API_CMS_URL + 'course_meta_details/'+module_id;
//       var method = "PATCH";
//       $.ajax({
//         url: url,
//         type: method,
//         data: JSON.stringify(get_submodule_level_values),
//         headers: { "Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token },
//         success:function(response){
//           console.log(response);
//           //location.reload();
//           $('#cms_course_details').trigger('click');
//         },
//         error: function(error) {
//           if (error.status === 401) {
//             alert("Session Expired, Please login again.");
//             logoutSession();
//           }
//           tags_response = "1";
//           toastr.error("Response Error: " + error.message);
//           console.log(error);
//         }
//       });
      
//     }
//   });
//   }
  function previewInstitute(ins_id, ins_type, org_ins_id, current_id){
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
                $("#previewmodal").modal("toggle");
                if(ins_type == "institute"){
                  $("#prev-edit_icon").attr("data-n-linkto", "addinstitute");
                  $("#prev-edit_icon").attr("data-n-url-org_id", org_ins_id);
                  $("#prev-edit_icon").attr("data-n-url-ins_id", response.id);
                }else{
                  $("#prev-edit_icon").attr("data-n-linkto", "addcollege");
                  $("#prev-edit_icon").attr("data-n-url-ins_id", org_ins_id);
                  $("#prev-edit_icon").attr("data-n-url-clg_id", response.id);
                }
              //prev-stream_list
                var ins_city_state_zip = response.city ? response.city: "";
                if(ins_city_state_zip){
                  ins_city_state_zip+= ", "+response.state ? response.state : "";
                }else{
                  ins_city_state_zip+= response.state ? response.state : "";
                }
                if(ins_city_state_zip){
                  ins_city_state_zip+= " "+response.zip_code ? response.zip_code : "";
                }else{
                  ins_city_state_zip+= response.zip_code ? response.zip_code : "";
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
                if(!response.logo){
                    $("#prev-org_logo").addClass("d-none");
                }else{
                    $("#prev-org_logo").removeClass("d-none");
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
                        user_city_state_zip+= ", "+val.state ? val.state : "";
                      }else{
                        user_city_state_zip+= val.state ? val.state : "";
                      }
                      if(user_city_state_zip){
                        user_city_state_zip+= " "+val.zip_code ? val.zip_code : "";
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
                      if(!val.m_image){
                          $("#prev-user_profile_image").addClass("d-none");
                      }else{
                          $("#prev-user_profile_image").removeClass("d-none");
                      }
                      $("#prev-user_profile_image").attr("src", val.m_image ? val.m_image : "");
                      $("#prev-user_name_qualification").text(user_name_qualification);
                      $("#prev-user_address_line_1").text(val.apartment_suit_unit ? val.apartment_suit_unit : "");
                      $("#prev-user_address_line_2").text(val.street_address ? val.street_address : "");
                      $("#prev-user_city_state_zip").text(user_city_state_zip);
                      $("#prev-user_description").text(val.description ? val.description : "");
                      $("#prev-user_email_id").text(val.email_id ? val.email_id : "");
                    }
                  });
                }else{
                    $("#prev-user_profile_image").addClass("d-none");
                }
                $("#prev-stream_list").empty();
                if(response.stream.length > 0){
                    $.each(response.stream, function( i, val ) {
                        $("#prev-stream_list").append(`<li class="form-label li_item mb-3">${val.name}</li>`);
                    });
                }
                $("#prev-course_list").empty();
                if(response.course_type.length > 0){
                    $.each(response.course_type, function( i, val ) {
                        $("#prev-course_list").append(`<li class="form-label li_item mb-3">${val.name}</li>`);
                    });
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
      }
  }

function deleteModule(e, ins_id, mod_type){
  if(ins_id){
    var module_name = $(e).attr("data-module_name");
    if(ins_id != "" && ins_id != null && ins_id != undefined){
      var module_type = mod_type == "institute" ? "Institute" : "College";
      $("#delete_module_name_msg").html(`<p> Are you sure you want to delete the ${module_type} : ${module_name} ? </p>`);
      $("#delete_org_id").val(ins_id);
      $("#deletemodal").modal('toggle');
      $("#delete_org_id").attr("data-delete_module_type", mod_type);
      if (window.location.href.indexOf("organization") > -1) {
        $("#delete_org_id").attr("data-page", "organization");
      }else if (window.location.href.indexOf("institute") > -1) {
        $("#delete_org_id").attr("data-page", "institute");
      }
    }
  }

}