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

$(document).ready(function () {
  stream_list_select(stream_list, "");
  course_list_select(course_list, "");
  call_all_AccadmeicYear();
  list_PR_Trigger("");
  //list_PR_programs('');
  list_PR_Programs_Trigger("");

  $('#pr_searchOrganization').on('blur', function (e) {
    e.stopImmediatePropagation();
    prorg_search_onblur();
  });


  $('#pr_searchprograms').on('blur', function (e) {
    e.stopImmediatePropagation();
    programs_search_onblur();
  });
});





function stream_list_select(stream_list_data, stream_selected_list) {
  $("#stream_list").empty();
  var stream_list = `<option value="">Select Stream</option>`;
  $.each(stream_list_data, function (i, val) {
    if (stream_selected_list === val.id) {
      stream_list += `<option value="${val.id}" selected>${val.name}</option>`;
    } else {
      stream_list += `<option value="${val.id}">${val.name}</option>`;
    }
  });
  $("#stream_list").append(stream_list);
}
function course_list_select(course_list_data, course_selected_list) {
  $("#courses_list").empty();
  var course_list = `<option value="">Select Course Type</option>`;
  $.each(course_list_data, function (i, val) {
    if (course_selected_list === val.id) {
      course_list += `<option value="${val.id}" selected>${val.name}</option>`;
    } else {
      course_list += `<option value="${val.id}">${val.name}</option>`;
    }
  });
  $("#courses_list").append(course_list);
}

function call_all_AccadmeicYear() {
  $("#acc_year_list").empty();
  var course_list = `<option value="">Select Academic Year</option>`;
  $.each(academic_year_options, function (i, val) {
    // if (course_selected_list === val.id) {
    //   course_list +=`<option value="${val.id}" selected>${val.name}</option>`;
    // }else{
    //   course_list +=`<option value="${val.id}">${val.name}</option>`;
    // }
    course_list += `<option value="${val.year}">${val.year}</option>`;
  });
  $("#acc_year_list").append(course_list);
}

/**
 * PROGRAM LIST AND FILTERS
 */


let program_params = '';


document.addEventListener("keypress", function (event) {

  if (event.target.id === 'pr_searchprograms') {
    if (event.key === "Enter") {
      event.preventDefault();
      var searchVal = $("#pr_searchprograms").val().trim();
      list_PR_Programs_Trigger(searchVal);
    }
  }

  if (event.target.id === 'go_to_page2') {
    if (event.key === "Enter") {
      event.preventDefault();
      $("#go_to_page2").trigger("click");
    }
  }

});

$(document).on("click", "#pr_resetButtonprograms", function () {

  localStorage.setItem("pr_prlist_pageNum", "");
  localStorage.setItem("pr_prlist_search", "");
  $("#go_to_page2").val("");
  $("#stream_list").val("");
  $("#courses_list").val("");
  $("#acc_year_list").val("");
  $("#pr_searchprograms").val("");
  $("#pr_resetButtonprograms").addClass("d-none");
  $('#institute_namer').text('All Programs');

  list_PR_Programs_Trigger("");
});

window.onbeforeunload = function (e) {
  window.onunload = function () {
    emtpy_localstorage_programs();
  }
  return undefined;
};

function programs_search_onblur() {
  searchprogram_param();
}

function emtpy_localstorage_programs() {
  localStorage.setItem("pr_prlist_pageNum", "");
  localStorage.setItem("pr_prlist_search", "");
  $("#go_to_page2").val("");
}


//Trigger on clicking the organization list
$(document).on("click", "#org-program-listings li", function (e) {
  let programId = $(this).attr("id");
  if (programId) {
    //$('#pr_resetButtonprograms').trigger('click');
    $("#stream_list").val("");
    $("#courses_list").val("");
    $("#acc_year_list").val("");
    $("#pr_searchprograms").val("");
    localStorage.setItem("pr_prlist_pageNum", "");
    localStorage.setItem("pr_prlist_search", "");
    $("#progran_go_to_pageto").val("");
    $("#pr_resetButtonprograms").addClass("d-none");

    let universityNames = $(this).closest('.accordion-item').find('button').text();
    let universityEle = $('#institute_namer');

    if (universityNames) {
      universityEle.text(universityNames);
    } else {
      universityEle.text('All Programs');
    }

    document.getElementById("orgid_includer").value = programId;
    document.getElementById("progorgcreate").setAttribute('data-n-url-ins_id', programId);
    searchprogram_param();
  }


});

//Trigger on changing the Stream list
$(document).on("change", "#stream_list", function (e) {
  searchprogram_param();
});

//Trigger on changing the Stream list
$(document).on("change", "#courses_list", function (e) {
  searchprogram_param();
});

//Trigger on changing the Stream list
$(document).on("change", "#acc_year_list", function (e) {
  searchprogram_param();
});


function list_PR_Programs_Trigger(searchVal) {
  console.log(searchVal);

  localStorage.setItem("pr_prlist_pageNum", "");
  localStorage.setItem("pr_prlist_search", "");
  $("#go_to_page2").val("");
  searchprogram_param();

}


function searchprogram_param() {
  var search_param = "";
  var search_inp_val = document.getElementById("pr_searchprograms").value;
  if (search_inp_val !== '') {
    search_param += "?name=" + search_inp_val;
  }
  var courses_list_val = document.getElementById("stream_list").value;
  if (courses_list_val !== "") {
    if (search_param == "") {
      search_param += "?stream_id=" + courses_list_val;
    } else {
      search_param += "&stream_id=" + courses_list_val;
    }
  }
  var stream_recent_val = document.getElementById("courses_list").value;
  if (stream_recent_val !== "") {
    if (search_param == "") {
      search_param += "?course_type_id=" + stream_recent_val;
    } else {
      search_param += "&course_type_id=" + stream_recent_val;
    }
  }
  var academic_year_val = document.getElementById("acc_year_list").value;
  if (academic_year_val !== "") {
    if (search_param == "") {
      search_param += "?academic_year=" + academic_year_val;
    } else {
      search_param += "&academic_year=" + academic_year_val;
    }
  }

  //$(".btnReset").removeClass("d-none");
  //console.log(search_param);
  if (search_param != "") {
    $("#pr_resetButtonprograms").removeClass("d-none");
  }

  var institute_id_val = document.getElementById("orgid_includer").value;
  if (institute_id_val !== "") {
    if (search_param == "") {
      search_param += "?institute_id=" + institute_id_val;
    } else {
      search_param += "&institute_id=" + institute_id_val;
    }
  }
  list_PR_programs(search_param);
}


//To Paginate platform list Data
function list_PR_programs(parameter) {
  // if (typeof parameter === 'undefined') {
  //   parameter = '';
  // } else if (parameter === null) {
  //   parameter = '';
  // }
  // console.log('parameter: ', parameter);
  let isFirst = true;
  var pr_prlist_pageNum = localStorage.getItem("pr_prlist_pageNum");
  //console.log('pr_prlist_pageNum', pr_prlist_pageNum);
  if (isFirst == true && pr_prlist_pageNum != "") {
    var url = new URLSearchParams(pr_prlist_pageNum);
    var search_inp = url.get("search");
    var searchval = 0;
    if (search_inp != "" && search_inp != null) {
      $("#pr_searchprograms").val(search_inp);
      searchval++;
    }
    if (searchval > 0) {
      $('#pr_resetButtonprograms').removeClass("d-none");
    } else {
      $('#pr_resetButtonprograms').addClass("d-none");
    }
    parameter = pr_prlist_pageNum;
  }
  if ($("#prorg_pagination-container-to").length > 0) {
    $('#prorg_pagination-container-to').pagination({
      dataSource: API_CMS_URL + 'program/list/' + parameter,
      locator: 'data',
      totalNumberLocator: function (response) {
        setTimeout(function () {
          $(".paginationjs-prev").attr("data-num", "1");
          $(".paginationjs-next").attr("data-num", response.total_pages);
          $("#progran_go_to_pageto").attr("min", 1);
          $("#progran_go_to_pageto").attr("max", response.total_pages);
        }, 500);
        return response.total;
      },
      alias: {
        pageNumber: 'page',
        pageSize: 'per_page',
      },
      pageSize: 7,
      ajax: {
        beforeSend: function (request) {
          if (getUserInfo() == null) {
            console.log(SITE_URL_PROTOCOL);
            window.location.href = SITE_URL_PROTOCOL + "/login";
          }
          request.setRequestHeader("Authorization", "Bearer " + getUserInfo().access_token);
        },
        complete: function (jqXHR, textStatus) {
          if (jqXHR.status === 200 || jqXHR.readyState === 0 || jqXHR.status === 0) {
            var prlist_pageNum = localStorage.getItem("pr_prlist_pageNum");
            if (isFirst == true && prlist_pageNum != "") {
              $("#progran_go_to_pageto").val(prlist_pageNum);
              $("#program_gotoques").trigger('click');
            }
            if (isFirst) {
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
            if (isFirst) {
              isFirst = false;
            }
            //alert("Session Expired, Please login again.");
          }

        },
      },
      callback: function (data, pagination) {
        console.log(pagination.totalNumber);
        if (pagination.totalNumber < 8) {
          //$("#program_pagination-container-goto").hide();
          $(".programlistPagination").attr("style", "display:none");
        } else {
          //$("#program_pagination-container-goto").show();
          $(".programlistPagination").attr("style", "display:block");
          $(".paginationjs-next").attr("title", "Last Page");
          $(".paginationjs-prev").attr("title", "First Page");
        }
        //console.log(parameter);
        if (parameter != '') {
          localStorage.setItem("platforml_search", parameter);
        }
        $("#program_list-loader").removeClass("disp_block");
        $("#program_list-loader").addClass("disp_none");
        $("#program_container").removeClass("disp_none");
        $("#program_container").addClass("disp_block");

        $("#program_pagination-container-goto ul li").click(function () {
          $("#progran_go_to_pageto").val("");
        });
        var html = list_PR_ProgramData(data);
        if (isFirst == false) {
          if (pagination.pageNumber) {
            localStorage.setItem("pr_prlist_pageNum", pagination.pageNumber);
          }
        }
      }
    });
  }
}


function list_PR_ProgramData(prg_data) {
  let program_Element = $('#program_inner_container');
  program_Element.empty();
  console.log('org_data: ', prg_data);
  let prgtd = `<table class="table table-bordered responsive">
      <thead>
        <tr>
          <th>PROGRAM NAME</th>
          <th>STREAM</th>
          <th>COURSE</th>
          <th>ACADEMIC YEAR</th>
          <th>SECTION</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>`;

  if (prg_data.length > 0) {
    $.each(prg_data, function (index, element) {
      let academic_linkto = '', batch_linkto = '';
      if (element.academic_count > 0) {
        academic_linkto = 'class="as_links" data-n-linkto="programacademiclist" data-n-url-acc_id="' + element.id + '"';
      } else {
        academic_linkto = 'class=""';
      }
      if (element.batch_count > 0) {
        batch_linkto = 'class="as_links" data-n-linkto="programsectionlist" data-n-url-batch_id="' + element.id + '"';
      } else {
        batch_linkto = 'class=""';
      }

      prgtd += '<tr><td>' + element.program_name + '</td>';
      prgtd += '<td>' + element.stream_name + '</td>';
      prgtd += '<td>' + element.course_type_name + '</td>';
      prgtd += '<td><span ' + academic_linkto + '>' + element.academic_count + '</span> </td>';
      prgtd += '<td><span ' + batch_linkto + '>' + element.batch_count + '</span> </td>';
      prgtd += '<td class="">';
      prgtd += '<div class="dropdown ahide">';
      prgtd += '<button class="btn dropdown-toggle dbtn" type="button" id="dropdownMenuButton3" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-ellipsis-v"></i></button>';
      prgtd += '<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton3" style="">';
      prgtd += '<li><a class="dropdown-item" href="#">View</a></li>';
      prgtd += '<li><a class="dropdown-item" data-n-linkto="createprogram" data-n-url-program_id="' + element.id + '" data-n-url-page_from="programlist">Edit</a></li>';
      prgtd += '<li><a href="javascript:void(0)" class="delete-program dropdown-item" data-programid="' + element.id + '" data-programname="' + element.program_name + '">Delete</a></li>';
      prgtd += '</ul>';
      prgtd += '</div>';
      prgtd += '</td>';
      prgtd += '</tr>';
    });
  } else {
    prgtd += '<tr><td colspan="6"><div class="text-center"><b>No Data Found !</b></div></td>';
  }

  prgtd += '</tbody></table>';
  program_Element.append(prgtd);

}


/**
 * ORGANIZATION LIST FILTERS AND LISTS
 */


document.addEventListener("keypress", function (event) {

  if (event.target.id === 'pr_searchOrganization') {
    if (event.key === "Enter") {
      event.preventDefault();
      var searchVal = $("#pr_searchOrganization").val().trim();

      list_PR_Trigger(searchVal);

    }
  }

  if (event.target.id === 'prorg_go_to_pageto') {
    if (event.key === "Enter") {
      event.preventDefault();
      $("#prorg_gotoques").trigger("click");
    }
  }

});

$(document).on("click", "#pr_resetButtonOrglist", function () {

  $("#pr_searchOrganization").val("");
  //$("#search_data_sortby").val("");

  localStorage.setItem("pr_orgl_pageNum", "");
  localStorage.setItem("pr_orgl_search", "");
  $("#prorg_go_to_pageto").val("");
  list_PR_Trigger("");
});
window.onbeforeunload = function (e) {
  window.onunload = function () {
    emtpy_localstorage_preorg();
  }
  return undefined;
};

function prorg_search_onblur() {
  var searchVal = $("#pr_searchOrganization").val().trim();
  list_PR_Trigger(searchVal);
}
function emtpy_localstorage_preorg() {
  localStorage.setItem("pr_orgl_pageNum", "");
  localStorage.setItem("pr_orgl_search", "");
  $("#prorg_go_to_pageto").val("");
}

function list_PR_Trigger(searchVal) {
  $('#orgid_includer').val('');
  $('#progorgcreate').attr('data-n-url-ins_id', '');
  $("#stream_list").val("");
  $("#courses_list").val("");
  $("#acc_year_list").val("");
  $("#pr_searchprograms").val("");
  localStorage.setItem("pr_prlist_pageNum", "");
  localStorage.setItem("pr_prlist_search", "");
  $("#progran_go_to_pageto").val("");
  $("#pr_resetButtonprograms").addClass("d-none");
  $('#institute_namer').text('All Programs');

  list_PR_programs('');

  console.log(searchVal);

  localStorage.setItem("pr_orgl_pageNum", "");
  localStorage.setItem("pr_orgl_search", "");
  $("#prorg_go_to_pageto").val("");

  if (searchVal) {
    searchVal = "?search=" + searchVal;
    $('#pr_resetButtonOrglist').removeClass("d-none");
  } else {
    $('#pr_resetButtonOrglist').addClass("d-none");
  }
  list_PR_Organizaiton(searchVal);
}


//To Paginate platform list Data
function list_PR_Organizaiton(parameter) {
  let isFirst = true;
  var pr_orgl_pageNum = localStorage.getItem("pr_orgl_pageNum");
  //console.log('pr_orgl_pageNum', pr_orgl_pageNum);
  if (isFirst == true && pr_orgl_pageNum != "") {
    var url = new URLSearchParams(pr_orgl_pageNum);
    var search_inp = url.get("search");
    var searchval = 0;
    if (search_inp != "" && search_inp != null) {
      $("#pr_searchOrganization").val(search_inp);
      searchval++;
    }
    if (searchval > 0) {
      $('#pr_resetButtonOrglist').removeClass("d-none");
    } else {
      $('#pr_resetButtonOrglist').addClass("d-none");
    }
    parameter = pr_orgl_pageNum;
  }
  if ($("#prorg_pagination-container-by").length > 0) {
    $('#prorg_pagination-container-by').pagination({
      dataSource: API_BASE_URL + 'parent_institute/list/' + parameter,
      locator: 'data',
      totalNumberLocator: function (response) {
        setTimeout(function () {
          $(".paginationjs-prev").attr("data-num", "1");
          $(".paginationjs-next").attr("data-num", response.total_pages);
          $("#prorg_go_to_pageto").attr("min", 1);
          $("#prorg_go_to_pageto").attr("max", response.total_pages);
        }, 500);
        return response.total;
      },
      alias: {
        pageNumber: 'page',
        pageSize: 'per_page',
      },
      pageSize: 9,
      ajax: {
        beforeSend: function (request) {
          if (getUserInfo() == null) {
            console.log(SITE_URL_PROTOCOL);
            window.location.href = SITE_URL_PROTOCOL + "/login";
          }
          request.setRequestHeader("Authorization", "Bearer " + getUserInfo().access_token);
        },
        complete: function (jqXHR, textStatus) {
          if (jqXHR.status === 200 || jqXHR.readyState === 0 || jqXHR.status === 0) {
            var orgl_pageNum = localStorage.getItem("pr_orgl_pageNum");
            if (isFirst == true && orgl_pageNum != "") {
              //$("#prorg_go_to_pageto").val(orgl_pageNum);
              //$("#prorg_gotoques").trigger('click');
            }
            if (isFirst) {
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
            if (isFirst) {
              isFirst = false;
            }
            //alert("Session Expired, Please login again.");
          }

        },
      },
      callback: function (data, pagination) {
        ////console.log(data);
        if (pagination.totalNumber < 10) {
          //$("#prorg_pagination-container-to").hide();
          $(".OrglistPagination").attr("style", "display:none");
        } else {
          //$("#prorg_pagination-container-to").show();
          $(".OrglistPagination").attr("style", "display:block");
          $(".paginationjs-next").attr("title", "Last Page");
          $(".paginationjs-prev").attr("title", "First Page");
        }
        //console.log(parameter);
        if (parameter != '') {
          localStorage.setItem("platforml_search", parameter);
        }
        $("#prg_orglist-loader").removeClass("disp_block");
        $("#prg_orglist-loader").addClass("disp_none");
        $("#prg_orglist_items").removeClass("disp_none");
        $("#prg_orglist_items").addClass("disp_block");

        $("#prorg_pagination-container-by ul li").click(function () {
          $("#prorg_go_to_pageto").val("");
        });
        var html = list_PR_OrganizaitonData(data);
        if (isFirst == false) {
          if (pagination.pageNumber) {
            localStorage.setItem("pr_orgl_pageNum", pagination.pageNumber);
          }
        }
      }
    });
  }
}

function list_PR_OrganizaitonData(org_data) {
  let org_Element = $('#prg_orglist_items');
  org_Element.empty();
  if (org_data.length > 0) {
    $.each(org_data, function (index, element) {
      let accrd = '';
      let collapsedClass = (index == 0) ? '' : 'collapsed';
      let expandBool = (index == 0) ? 'true' : 'false';
      let collspaeShow = (index == 0) ? 'show' : '';
      accrd += '<div class="accordion-item">';
      accrd += '<h2 class="accordion-header" id="h_' + element.id + '">';
      accrd += '<button class="accordion-button ' + collapsedClass + '"  type="button" data-bs-toggle="collapse" data-bs-target="#i_' + element.id + '" aria-expanded="' + expandBool + '" aria-controls="i_' + element.id + '">' + element.organization_name + '</button></h2>';
      accrd += '<div id="i_' + element.id + '" class="accordion-collapse collapse ' + collspaeShow + '" aria-labelledby="h_' + element.id + '" data-bs-parent="#i_' + element.id + '">';
      accrd += '<div class="accordion-body">';
      accrd += '<ul id="org-program-listings">';
      let org_sublist = element.children;
      //console.log('org_sublist', org_sublist);
      if (org_sublist.length > 0) {
        $.each(org_sublist, function (index, ele) {
          accrd += `<li class="sub__program" id="${ele.id}">${ele.name}</li>`;
        });
      } else {
        accrd += `<li class="no__program">No Data Found !</li>`;
      }
      accrd += '</ul>';
      accrd += '</div>';
      accrd += '</div>';
      accrd += '</div>';
      org_Element.append(accrd);
    });
  }
}

$(document).on('click', '.delete-program', function (e) {
  e.stopImmediatePropagation();
  let prg_id = $(this).attr("data-programid");
  let prg_name = $(this).attr("data-programname");
  if (prg_id != "" && prg_id != null && prg_id != undefined) {
    $("#delete_module_name_msg").html(`<p> Are you sure you want to delete the program: ${prg_name} ? </p>`);
    $("#delete_prg_id").val(prg_id);
    $("#deletemodal").modal('toggle');
  }
});
$(document).on("click", ".close_delete_modal_pops", function(e){
  e.stopImmediatePropagation();
  $("#deletemodal").modal('toggle');
});

$(document).on("click", "#delete_program_prg", function (e) {
  e.stopImmediatePropagation();
  let prg_id = $("#delete_prg_id").val();

  if (prg_id != "" && prg_id != null && prg_id != undefined) {
    $.ajax({
      url: API_CMS_URL + "only_program_delete/" + prg_id + "/",
      type: "DELETE",
      data: JSON.stringify({ "status": "2" }),
      headers: {
        "Authorization": "Bearer " + getUserInfo().access_token,
        "Content-Type": "application/json"
      },
      success: function (response) {
        $("#programmodal").modal('toggle');
        toastr.success("Program Deleted Successfully.");
        var searchVal = $("#pr_searchprograms").val().trim();
        list_PR_Programs_Trigger(searchVal);
      },
      error: function (error) {
        if (error.status === 401) {
          alert("Session Expired, Please login again.");
          logoutSession();
        }
        if (error.msg) {
          toastr.error(error.msg);
        } else {
          toastr.error("Response Error: " + error.message);
        }
        console.log(error);
      }
    });
  }
});


//Set accordion item as active when click
$(document).on('click', '.sub__program', function(e){
  e.stopImmediatePropagation();
  let currentItemid = $(this).attr('id');
  if(currentItemid){
    $('#prg_orglist_items li.sub__program').each(function(e){
      if(currentItemid === $(this).attr('id')){
        $(this).addClass('active');
      }else{
        $(this).removeClass('active');
      }
    });
  }
});

