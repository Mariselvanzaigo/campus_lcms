var acc_id = '';
var program_param = getUrlParamquery();
acc_id = program_param.acc_id;

if (acc_id) {
  document.getElementById('sectiontab').setAttribute('data-n-url-batch_id', acc_id);
  document.getElementById('academictab').setAttribute('data-n-url-acc_id', acc_id);
  document.getElementById('academicedit').setAttribute('data-n-url-program_id', acc_id);
}


$(document).ready(function () {
  list_PR_academic("");
});
//To Paginate platform list Data
function list_PR_academic(parameter) {
  if (typeof parameter === 'undefined') {
    parameter = '';
  } else if (parameter === null) {
    parameter = '';
  }
  var accids = '';
  if (acc_id) {
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
      dataSource: API_CMS_URL + 'program/academic_list/' + accids,
      locator: 'data.academic_data',
      totalNumberLocator: function (response) {
        setTimeout(function () {
          $(".paginationjs-prev").attr("data-num", "1");
          $(".paginationjs-next").attr("data-num", response.total_pages);
          $("#academic_go_to_pageto").attr("min", 1);
          $("#academic_go_to_pageto").attr("max", response.total_pages);
          $('#prg__name').text(response.data.program_name);
          $('#stream__name').text(response.data.program_stream_name);
          $('#course__name').text(response.data.program_course_type_name);

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
            //alert("Session Expired, Please login again.");
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
  //console.log("acc_Elementacc_Element", acc_Element)
  acc_Element.empty();
  //console.log('org_data: ', acc_data);
  let acctd = `<table class="table table-bordered responsive">
  <thead>
      <tr>
          <th>Academic Name</th>
          <th>Academic Year</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Section</th>
          <th>Action</th>
      </tr>
  </thead>
  <tbody>`;

  if (acc_data.length > 0) {
    $.each(acc_data, function (index, element) {

      // console.log("elementelementelement", element)
      let academic_linkto = '';
      if (element.batch_count > 0) {
        academic_linkto = 'class="" data-n-url-batch_id="' + acc_id + '" data-n-url-acc_yearid="' + element.id + '"';
      } else {
        academic_linkto = 'class=""';
      }

      //  console.log("saravana batch count" , element.batch_count)
      //  console.log("saravana batch details" , element.batch_details)




      acctd += '<tr><td>' + element.academic_name + '</td>';
      acctd += '<td>' + element.year + '</td>';
      acctd += '<td>' + dateFormat_slash(element.start_date) + '</td>';
      acctd += '<td>' + dateFormat_slash(element.end_date) + '</td>';
      acctd += '<td><span ' + academic_linkto + '>' + element.batch_count + '</span> </td>';
      acctd += '<td class="action-icons">';
      //acctd += '<span class="eye-icon"><img src="/assets/images/eyeicon.png"></span>';
      acctd += '<span class="edit-icon" data-n-linkto="createprogram" data-n-url-program_id="' + acc_id + '" data-n-url-page_from="programacademiclist"><img data-n-linkto="createprogram" data-n-url-program_id="' + acc_id + '" data-n-url-page_from="programacademiclist" src="/assets/images/edit.png"></span>';
      acctd += '<span class="delete-icon"><img class="delete-academic" data-academicid="' + element.id + '" data-academicname="' + element.academic_name + '" src="/assets/images/deleteicon.png"></span>';
      acctd += '<span class="details-icon outer-table" id="details-icon-' + index + '" ></span>';
      acctd += '</td>';
      acctd += '</tr>';
      acctd += '<tr>';
      acctd += '<td colspan="12" style="display:none" class=" inner-table p-0" id="add-table-' + index + '">';
      acctd += '<div class="accordian-body">';
      acctd += '<table class="table table-bordered responsive mb-0 "><thead><tr>';
      acctd += '<th>Section Name</th>';
      acctd += '<th>Batch Student count</th>'
      acctd += '</tr></thead>';
      acctd += '<tbody>';
      let batch_details_view = element.batch_details;
      if (batch_details_view.length > 0) {
        $.each(batch_details_view, function (index, element) {
          acctd += '<tr>';
          acctd += '<td>' + element.section_name + '</td>';
          // acctd += '<td>' + element.batch_student_count + '</td>'
          acctd += '<td>' + 0 + '</td>'
          acctd += '</tr>';
        });

      } else {
        acctd += '<tr><td colspan="2"><div class="text-center"><b>No Data Found !</b></div></td>';
      }
      acctd += '</tbody>';
      acctd += '</table>';
      acctd += '</div>';
      acctd += '</td>';
      acctd += '</tr>';
    });
  } else {
    acctd += '<tr><td colspan="6"><div class="text-center"><b>No Data Found !</b></div></td>';
  }

  acctd += '</tbody></table>';
  acc_Element.append(acctd);

}
//accordion js start
$(document).on('click', '.outer-table', function (e) {
  let getIdFromTable = e.target.id.split("-");
  let IndexId = getIdFromTable[2];
  let elementInnerTable = document.getElementById(`add-table-${IndexId}`);
  //console.log(elementInnerTable);
 
    if($(elementInnerTable).css('display') == 'none'){
      $(elementInnerTable).show(700);
      $(this).addClass("details-icon-up")
      $(this).removeClass("details-icon")
    } else {
      $(elementInnerTable).hide(300);
      $(this).addClass("details-icon")
      $(this).removeClass("details-icon-up")
    }
})
//accordion js End

$(document).on('click', '.delete-academic', function (e) {
  e.stopImmediatePropagation();
  let academic_id = $(this).attr("data-academicid");
  let academic_name = $(this).attr("data-academicname");
  if (academic_id != "" && academic_id != null && academic_id != undefined) {
    $("#delete_module_name_msg").html(`<p> Are you sure you want to delete the academic: ${academic_name} ? </p>`);
    $("#delete_academic_id").val(academic_id);
    $("#academicmodal").modal('toggle');
  }
});

$(document).on("click", ".close_delete_modal_pop", function (e) {
  e.stopImmediatePropagation();
  $("#academicmodal").modal('toggle');
});

$(document).on("click", "#delete_program_academic", function (e) {
  e.stopImmediatePropagation();
  let academic_id = $("#delete_academic_id").val();

  if (academic_id != "" && academic_id != null && academic_id != undefined) {
    $.ajax({
      url: API_CMS_URL + "academic_year/delete/" + academic_id + "/",
      type: "DELETE",
      data: JSON.stringify({ "status": "2" }),
      headers: {
        "Authorization": "Bearer " + getUserInfo().access_token,
        "Content-Type": "application/json"
      },
      success: function (response) {
        $("#academicmodal").modal('toggle');
        toastr.success("Academic Deleted Successfully.");
        //var searchVal = $("#pr_searchprograms").val().trim();
        list_PR_academic("");
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
