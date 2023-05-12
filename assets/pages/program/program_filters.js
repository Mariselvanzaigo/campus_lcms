const programCallbacks = () => {
  list_PR_Trigger("");
  $('#pr_searchOrganization').on('blur', function (e) {
    e.stopImmediatePropagation();
    prorg_search_onblur();
  });
}



/**
 * PROGRAM LIST AND FILTERS
 */


let program_params = '';

$(document).on("click", "#org-program-listings li", function (e) {
  let programId = $(this).attr("id");
  if (programId) {
    program_params = "?institute_id=" + programId;
    list_PR_programs();
  }
});



function list_PR_Programs_Trigger(searchVal) {
  console.log(searchVal);

  localStorage.setItem("pr_prlist_pageNum", "");
  localStorage.setItem("pr_prlist_search", "");
  $("#prlist_go_to_pageto").val("");

  if (searchVal) {
    searchVal = "?search=" + searchVal;
    $('#pr_searchprograms').removeClass("d-none");
  } else {
    $('#pr_searchprograms').addClass("d-none");
  }
  list_PR_programs(searchVal);
}


//To Paginate platform list Data
function list_PR_programs(parameter) {
  if (typeof parameter === 'undefined') {
    parameter = '';
  } else if (parameter === null) {
    parameter = '';
  }
  console.log('parameter: ', parameter);
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
  if ($("#program_pagination-container-goto").length > 0) {
    $('#program_pagination-container-goto').pagination({
      dataSource: API_CMS_URL + 'program/list/' + program_params,
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
        ////console.log(data);
        if (pagination.totalNumber < 10) {
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
      prgtd += '<tr><td>'+  element.program_name +'</td>';
      prgtd += '<td>'+  element.stream_name +'</td>';
      prgtd += '<td>'+  element.course_type_name +'</td>';
      prgtd += '<td><span class="as_links" data-n-linkto="programacademiclist" data-n-url-acc_id="'+ element.id +'">' + element.academic_count + '</span> </td>';
      prgtd += '<td><span class="as_links" data-n-linkto="programsectionlist" data-n-url-batch_id="'+ element.id +'">' + element.batch_count + '</span> </td>';
      prgtd += '<td class="">';
      prgtd += '<div class="dropdown ahide">';
      prgtd += '<button class="btn dropdown-toggle dbtn" type="button" id="dropdownMenuButton3" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-ellipsis-v"></i></button>';
      prgtd += '<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton3" style="">';
      prgtd += '<li><a class="dropdown-item" data-flinkto="" href="#">View</a></li>';
      prgtd += '</ul>';
      prgtd += '</div>';
      prgtd += '</td>';
      prgtd += '</tr>';
    });
  }

  prgtd += '</tbody></table>';
  program_Element.append(prgtd);

}


/**
 * ORGANIZATION LIST FILTERS AND LISTS
 */

// let pr_searchOrganization_inp = document.getElementById("pr_searchOrganization");
// pr_searchOrganization_inp.addEventListener("keypress", function (event) {
  
// });

// let prorg_go_to_pageto_inp = document.getElementById("prorg_go_to_pageto");

document.addEventListener("keypress", function (event) {

  if(event.target.id === 'pr_searchOrganization'){
    if (event.key === "Enter") {
      event.preventDefault();
      var searchVal = $("#pr_searchOrganization").val().trim();
      list_PR_Trigger(searchVal);
    }
  }

  if(event.target.id === 'prorg_go_to_pageto'){
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
  if ($("#prorg_pagination-container-to").length > 0) {
    $('#prorg_pagination-container-to').pagination({
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
              $("#prorg_go_to_pageto").val(orgl_pageNum);
              $("#prorg_gotoques").trigger('click');
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
            alert("Session Expired, Please login again.");
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

        $("#prorg_pagination-container-to ul li").click(function () {
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
      accrd += '<div id="i_' + element.id + '" class="accordion-collapse collapse ' + collspaeShow + '" aria-labelledby="h_' + element.id + '" data-bs-parent="#orglist_items">';
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









