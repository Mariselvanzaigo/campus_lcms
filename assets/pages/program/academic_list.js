var acc_id = '';
var url_strings = window.location.href;
var url = new URL(url_strings);
acc_id = url.searchParams.get("acc_id") ? url.searchParams.get("acc_id") : '';
const academic_Callbacks = () => {  
    console.log('acc_id: ', acc_id); 
    list_accademic_Trigger();
    // $('#pr_searchaccdemic').on('blur', function (e) {
    //   e.stopImmediatePropagation();
    //   prorg_search_onblur();
    // });
  }
/**
 * ACADEMIC FILTERS AND LISTS
 */




/*
let pr_searchaccdemic_inp = document.getElementById("pr_searchaccdemic");
pr_searchaccdemic_inp.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    var searchVal = $("#pr_searchaccdemic").val().trim();
    list_PR_Trigger(searchVal);
  }
});

let academic_go_to_pageto_inp = document.getElementById("academic_go_to_pageto");
academic_go_to_pageto_inp.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    $("#academic_gotoques").trigger("click");
  }
});

$(document).on("click", "#pr_resetButtonaccdemic", function () {

  $("#pr_searchaccdemic").val("");
  //$("#search_data_sortby").val("");

  localStorage.setItem("pr_acc_pageNum", "");
  localStorage.setItem("pr_orgl_search", "");
  $("#academic_go_to_pageto").val("");
  list_PR_Trigger("");
});
window.onbeforeunload = function (e) {
  window.onunload = function () {
    emtpy_localstorage_preorg();
  }
  return undefined;
};

function prorg_search_onblur() {
  var searchVal = $("#pr_searchaccdemic").val().trim();
  list_PR_Trigger(searchVal);
}
function emtpy_localstorage_preorg() {
  localStorage.setItem("pr_acc_pageNum", "");
  localStorage.setItem("pr_orgl_search", "");
  $("#academic_go_to_pageto").val("");
}
*/

function list_accademic_Trigger(searchVal) {
  

  localStorage.setItem("pr_acc_pageNum", "");
  localStorage.setItem("pr_acc_search", "");
  //$("#academic_go_to_pageto").val("");

//   if (searchVal) {
//     searchVal = "?search=" + searchVal;
//     $('#pr_resetButtonaccdemic').removeClass("d-none");
//   } else {
//     $('#pr_resetButtonaccdemic').addClass("d-none");
//   }
  list_PR_academic(searchVal);
}


//To Paginate platform list Data
function list_PR_academic(parameter) {
  if (typeof parameter === 'undefined') {
    parameter = '';
    } else if (parameter === null) {
        parameter = '';
      }
  let accids = '';
  if(acc_id){
    accids = acc_id + '/';
  }
  let isFirst = true;
  var pr_acc_pageNum = localStorage.getItem("pr_acc_pageNum");
  //console.log('pr_acc_pageNum', pr_acc_pageNum);
  if (isFirst == true && pr_acc_pageNum != "") {
    var url = new URLSearchParams(pr_acc_pageNum);
    var search_inp = url.get("search");
    var searchval = 0;
    if (search_inp != "" && search_inp != null) {
      $("#pr_searchaccdemic").val(search_inp);
      searchval++;
    }
    if (searchval > 0) {
      $('#pr_resetButtonaccdemic').removeClass("d-none");
    } else {
      $('#pr_resetButtonaccdemic').addClass("d-none");
    }
    parameter = pr_acc_pageNum;
    console.log('parameterinloop: ', parameter);
  }
  if ($("#acc_pagination-container-to").length > 0) {
    $('#acc_pagination-container-to').pagination({
      dataSource: API_CMS_URL + 'program/academic_list/'+ accids + parameter,
      locator: 'data',
      totalNumberLocator: function (response) {
        setTimeout(function () {
          $(".paginationjs-prev").attr("data-num", "1");
          $(".paginationjs-next").attr("data-num", response.total_pages);
          $("#academic_go_to_pageto").attr("min", 1);
          $("#academic_go_to_pageto").attr("max", response.total_pages);
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
            var orgl_pageNum = localStorage.getItem("pr_acc_pageNum");
            if (isFirst == true && orgl_pageNum != "") {
              $("#academic_go_to_pageto").val(orgl_pageNum);
              $("#academic_gotoques").trigger('click');
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
          //$("#acc_pagination-container-to").hide();
          $(".academiclistPagination").attr("style", "display:none");
        } else {
          //$("#acc_pagination-container-to").show();
          $(".academiclistPagination").attr("style", "display:block");
          $(".paginationjs-next").attr("title", "Last Page");
          $(".paginationjs-prev").attr("title", "First Page");
        }
        //console.log(parameter);
        if (parameter != '') {
          localStorage.setItem("platforml_search", parameter);
        }
        $("#academic_list-loader").removeClass("disp_block");
        $("#academic_list-loader").addClass("disp_none");
        $("#academic_table_container").removeClass("disp_none");
        $("#academic_table_container").addClass("disp_block");

        $("#acc_pagination-container-to ul li").click(function () {
          $("#academic_go_to_pageto").val("");
        });
        var html = list_PR_academicData(data);
        if (isFirst == false) {
          if (pagination.pageNumber) {
            localStorage.setItem("pr_acc_pageNum", pagination.pageNumber);
          }
        }
      }
    });
  }
}

function list_PR_academicData(acc_data) {
  let acc_Element = $('#academic_table_container');
  acc_Element.empty();
  console.log('org_data: ', acc_data);
  let acctd = `<table class="table table-bordered responsive">
  <thead>
      <tr>
          <th>Academic Name</th>
          <th>Academic Year</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Section</th>
          <th>&nbsp;</th>
      </tr>
  </thead>
  <tbody>`;

  if (acc_data.length > 0) {
    $.each(acc_data, function (index, element) {
      acctd += '<tr><td>'+  element.academic_name +'</td>';
      acctd += '<td>'+  element.year +'</td>';
      acctd += '<td>'+  element.start_date +'</td>';
      acctd += '<td>'+  element.end_date +'</td>';
      acctd += '<td><span class="as_links" data-n-linkto="programsectionlist" data-n-url-batch_id="'+ element.id +'" data-n-url-acc_yearid="'+ acc_id +'">' + element.batch_count + '</span> </td>';
      acctd += '<td class="action-icons">';
      acctd += '<span class="eye-icon"><a href="#"><img src="/assets/images/eyeicon.png"></a></span>';
      acctd += '<span class="edit-icon"><a href="#"><img src="/assets/images/edit.png"></a></span>';
      acctd += '<span class="delete-icon"><a href="#" data-bs-toggle="modal" data-bs-target="#deletemodal"><img src="/assets/images/deleteicon.png"></a></span>';
      acctd += '</td>';
      acctd += '</tr>';
    });
  }

  acctd += '</tbody></table>';
  acc_Element.append(acctd);
}
 