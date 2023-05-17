var batch_id = '', accyear_id = '';
var program_param = getUrlParamquery();
batch_id = program_param.batch_id;
accyear_id = program_param.acc_yearid;


$(document).ready(function () {
    list_batch_Trigger("");
});

/**
 * ACADEMIC FILTERS AND LISTS
 */




/*
let pr_searchbatch_inp = document.getElementById("pr_searchbatch");
pr_searchbatch_inp.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    var searchVal = $("#pr_searchbatch").val().trim();
    list_PR_Trigger(searchVal);
  }
});

let batch_go_to_pageto_inp = document.getElementById("batch_go_to_pageto");
batch_go_to_pageto_inp.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    $("#batch_gotoques").trigger("click");
  }
});

$(document).on("click", "#pr_resetButtonbatch", function () {

  $("#pr_searchbatch").val("");
  //$("#search_data_sortby").val("");

  localStorage.setItem("pr_batch_pageNum", "");
  localStorage.setItem("pr_orgl_search", "");
  $("#batch_go_to_pageto").val("");
  list_PR_Trigger("");
});
window.onbeforeunload = function (e) {
  window.onunload = function () {
    emtpy_localstorage_preorg();
  }
  return undefined;
};

function prorg_search_onblur() {
  var searchVal = $("#pr_searchbatch").val().trim();
  list_PR_Trigger(searchVal);
}
function emtpy_localstorage_preorg() {
  localStorage.setItem("pr_batch_pageNum", "");
  localStorage.setItem("pr_orgl_search", "");
  $("#batch_go_to_pageto").val("");
}
*/

function list_batch_Trigger(searchVal) {


    localStorage.setItem("pr_batch_pageNum", "");
    localStorage.setItem("pr_batch_search", "");
    //$("#batch_go_to_pageto").val("");

    //   if (searchVal) {
    //     searchVal = "?search=" + searchVal;
    //     $('#pr_resetButtonbatch').removeClass("d-none");
    //   } else {
    //     $('#pr_resetButtonbatch').addClass("d-none");
    //   }
    list_PR_batch(searchVal);
}


//To Paginate platform list Data
function list_PR_batch(parameter) {
    if (typeof parameter === 'undefined') {
        parameter = '';
    } else if (parameter === null) {
        parameter = '';
    }
    let batchids = '';
    if (batch_id && accyear_id) {
        batchids = batch_id + '/?academic_id=' + accyear_id;
    } else if (batch_id) {
        batchids = batch_id + '/';
    }
    let isFirst = true;
    var pr_batch_pageNum = localStorage.getItem("pr_batch_pageNum");
    //console.log('pr_batch_pageNum', pr_batch_pageNum);
    if (isFirst == true && pr_batch_pageNum != "") {
        var url = new URLSearchParams(pr_batch_pageNum);
        var search_inp = url.get("search");
        var searchval = 0;
        if (search_inp != "" && search_inp != null) {
            $("#pr_searchbatch").val(search_inp);
            searchval++;
        }
        if (searchval > 0) {
            $('#pr_resetButtonbatch').removeClass("d-none");
        } else {
            $('#pr_resetButtonbatch').addClass("d-none");
        }
        parameter = pr_batch_pageNum;
        console.log('parameterinloop: ', parameter);
    }
    if ($("#batch_pagination-container-to").length > 0) {
        $('#batch_pagination-container-to').pagination({
            dataSource: API_CMS_URL + 'program/batch_list/' + batchids + parameter,
            locator: 'data.batch_details',
            totalNumberLocator: function (response) {
                setTimeout(function () {
                    $(".paginationjs-prev").attr("data-num", "1");
                    $(".paginationjs-next").attr("data-num", response.total_pages);
                    $("#batch_go_to_pageto").attr("min", 1);
                    $("#batch_go_to_pageto").attr("max", response.total_pages);
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
                        var orgl_pageNum = localStorage.getItem("pr_batch_pageNum");
                        if (isFirst == true && orgl_pageNum != "") {
                            $("#batch_go_to_pageto").val(orgl_pageNum);
                            $("#batch_gotoques").trigger('click');
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
                    //$("#batch_pagination-container-to").hide();
                    $(".batchlistPagination").attr("style", "display:none");
                } else {
                    //$("#batch_pagination-container-to").show();
                    $(".batchlistPagination").attr("style", "display:block");
                    $(".paginationjs-next").attr("title", "Last Page");
                    $(".paginationjs-prev").attr("title", "First Page");
                }
                //console.log(parameter);
                if (parameter != '') {
                    localStorage.setItem("platforml_search", parameter);
                }
                $("#batch_list-loader").removeClass("disp_block");
                $("#batch_list-loader").addClass("disp_none");
                $("#batch_table_container").removeClass("disp_none");
                $("#batch_table_container").addClass("disp_block");

                $("#batch_pagination-container-to ul li").click(function () {
                    $("#batch_go_to_pageto").val("");
                });
                var html = list_PR_batchData(data);
                if (isFirst == false) {
                    if (pagination.pageNumber) {
                        localStorage.setItem("pr_batch_pageNum", pagination.pageNumber);
                    }
                }
            }
        });
    }
}

function list_PR_batchData(batch_data) {
    let batch_Element = $('#batch_table_container');
    batch_Element.empty();
    console.log('org_data: ', batch_data);
    let batchtd = `<table class="table table-bordered responsive">
    <thead>
        <tr>    
            <th>Section Name</th>  
            <th>Academic Year</th>                
            <th>Start Date</th>
            <th>End Date</th>
            <th>No of Students</th>
            <th>&nbsp;</th>
        </tr>
    </thead>
    <tbody>`;
    if (batch_data.length > 0) {
        $.each(batch_data, function (index, element) {
            batchtd += '<tr><td>' + element.batch_name + '</td>';
            batchtd += '<td>' + element.academic_year + '</td>';
            batchtd += '<td>' + dateFormat_slash(element.academic_start_date) + '</td>';
            batchtd += '<td>' + dateFormat_slash(element.academic_end_date) + '</td>';
            batchtd += '<td>' + element.batch_student_count + '</td>';
            batchtd += '<td class="action-icons">';
            //batchtd += '<span class="eye-icon"><img src="/assets/images/eyeicon.png"></span>';
            batchtd += '<span class="edit-icon" data-n-linkto="createprogram" data-n-url-program_id="' + batch_id + '" data-n-url-page_from="programsectionlist"><img data-n-linkto="createprogram" data-n-url-program_id="' + batch_id + '" data-n-url-page_from="programsectionlist" src="/assets/images/edit.png"></span>';
            batchtd += '<span class="delete-icon"><img class="delete-section" data-sectionid="' + element.id + '" data-sectionname="' + element.batch_name + '" src="/assets/images/deleteicon.png"></span>';
            batchtd += '</td>';
            batchtd += '</tr>';
        });
    } else {
        acctd += '<tr><td colspan="6"><div class="text-center"><b>No Data Found !</b></div></td>';
    }

    batchtd += '</tbody></table>';
    batch_Element.append(batchtd);

}


$(document).on('click', '.delete-section', function (e) {
    e.stopImmediatePropagation();
    var sec_id = $(this).attr("data-sectionid");
    var sec_name = $(this).attr("data-sectionname");
    if (sec_id != "" && sec_id != null && sec_id != undefined) {
        $("#delete_module_name_msg").html(`<p> Are you sure you want to delete the section: ${sec_name} ? </p>`);
        $("#delete_sec_id").val(sec_id);
        $("#sectionmodal").modal('toggle');
    }
});

$(document).on("click", ".close_delete_modal_pop", function(e){
    e.stopImmediatePropagation();
    $("#sectionmodal").modal('toggle');
});

$(document).on("click", "#delete_program_section", function (e) {
    e.stopImmediatePropagation();
    let sec_id = $("#delete_sec_id").val();

    if (sec_id != "" && sec_id != null && sec_id != undefined) {
        $.ajax({
            url: API_CMS_URL + "section/delete/" + sec_id + "/",
            type: "DELETE",
            data: JSON.stringify({ "status": "2" }),
            headers: {
                "Authorization": "Bearer " + getUserInfo().access_token,
                "Content-Type": "application/json"
            },
            success: function (response) {
                $("#sectionmodal").modal('toggle');
                toastr.success("Section Deleted Successfully.");
                //var searchVal = $("#pr_searchprograms").val().trim();
                list_batch_Trigger();
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
