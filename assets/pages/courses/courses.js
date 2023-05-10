var search_data_inp = document.getElementById("search_data");
search_data_inp.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    localStorage.setItem("cas_courselist_pageNum", "");
    localStorage.setItem("cas_courselist_search", "");
    $("#go_to_page").val("");
    searchParam();
  }
});

var go_to_page_inp = document.getElementById("go_to_page");
go_to_page_inp.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    $(".goto_go").trigger("click");
  }
});
  function searchCourseBlur(){
    localStorage.setItem("cas_courselist_pageNum", "");
    localStorage.setItem("cas_courselist_search", "");
    $("#go_to_page").val("");
    searchParam();
  }
function searchParam(){
    var search_param = "";
    var search_inp_val = document.getElementById("search_data").value;
    if(search_inp_val !== ''){
        search_param += "?search="+search_inp_val;
    }
    var courses_list_val = document.getElementById("courses_list").value;
    if(courses_list_val !== ""){
        if(search_param == ""){
            search_param += "?id="+courses_list_val;
        }else{
            search_param += "&id="+courses_list_val;
        }
    }
    var sort_recent_val = document.getElementById("sort_recent").value;
    if(sort_recent_val !== ""){
        if(search_param == ""){
            search_param += "?status="+sort_recent_val;
        }else{
            search_param += "&status="+sort_recent_val;
        }
    }
    get_pagination(search_param);
    //$(".btnReset").removeClass("d-none");
    //console.log(search_param);
    if(search_param != ""){
      $(".btnReset").removeClass("d-none");
    }
}
window.onbeforeunload = function (e) {
    window.onunload = function () {
      emptylocalStorage();
    }
    return undefined;
};

function emptylocalStorage(){
  localStorage.setItem("cas_courselist_pageNum", "");
  localStorage.setItem("cas_courselist_search", "");
  $("#go_to_page").val("");
  localStorage.setItem("cas_course_tab_view", "grid"); 
}
$( document ).ready(function() {

    $(".btnReset").on("click", function(){
      $("#search_data, #courses_list, #sort_recent").val(null);
      localStorage.setItem("cas_courselist_pageNum", "");
      localStorage.setItem("cas_courselist_search", "");
      $("#go_to_page").val("");
      searchParam();
      setTimeout(function() {
        $(".btnReset").addClass("d-none");
      }, 500);
    });
  //load the courses list
  $.ajax({
    url: API_CONTENT_URL + '/course_list/',
    type: 'get',
    dataType: 'json',
    headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token},
    success:function(response){
      $("#courses_list").empty();
      $("#courses_list").append("<option value=''>Select Master Course</option>");
      $.each( response, function( i, val ) {
        $("#courses_list").append("<option value='"+val.id+"'>"+val.name+"</option>");
      });
    }, 
    error: function(error) {
      if (error.status === 401) {
        alert("Session Expired, Please login again.");
        logoutSession();
      }
    }
  });
  var parameter = "";

  $("#grid").click(function(){
    localStorage.setItem("cas_course_tab_view", "grid"); 
    $("#go_to_page").val("");
    activeremover();
    $(this).addClass('active');
    searchParam();
  });
  $("#list").click(function(){
    localStorage.setItem("cas_course_tab_view", "list"); 
    $("#go_to_page").val("");
    activeremover();
    $(this).addClass('active');
    searchParam();
  });
  localStorage.setItem("cas_course_tab_view", "grid"); 
  //get_pagination(parameter);
  searchParam();
});

function activeremover() {
  $('.grid-list-view span a').each(function(){
    $(this).removeClass('active');  
  });
}
function get_pagination(parameter){
  let isFirstCourse = true;
  var courselist_search = localStorage.getItem("cas_courselist_search");
  //console.log('courselist_search',courselist_search);
  if(isFirstCourse == true && courselist_search != ""){
    var url = new URLSearchParams(courselist_search);
    var search_inp = url.get("search");
    var id_inp = url.get("id");
    var status_inp = url.get("status");
    $("#search_data").val(search_inp);
    $("#courses_list").val(id_inp);
    $("#sort_recent").val(status_inp);
    var searchval = 0;
    if(search_inp != "" && search_inp != null){
      searchval++;
    }
    if(id_inp != "" && id_inp != null){
      searchval++;
    }
    if(status_inp != "" && status_inp != null){
      searchval++;
    }
    if(searchval > 0){
      $(".btnReset").removeClass("d-none");
    }
    var viewtab_list = localStorage.getItem("cas_course_tab_view");
    //console.log(viewtab_list);
    if(viewtab_list == "grid" || viewtab_list == ""){
      $('#grid').addClass('active');
      $('#list').removeClass('active');
    }else{
      $('#grid').removeClass('active');
      $('#list').addClass('active');
    } 
    parameter = courselist_search;
  }
  //console.log('1st', parameter);
  if(parameter == null){
    parameter = "";
  }
  //console.log('2nd', parameter);
  if($( "#pagination-container-to" ).length > 0) {
    $('#pagination-container-to').pagination({
      dataSource: API_CONTENT_URL + '/course/'+parameter,
      locator: 'data',
      totalNumberLocator: function(response) {
        setTimeout(function() {
          $(".paginationjs-prev").attr("data-num", "1");
          $(".paginationjs-next").attr("data-num", response.total_pages);
          $("#go_to_page").attr("min", 1);
          $("#go_to_page").attr("max", response.total_pages);
        }, 500);
        return response.total;
      },
      alias: {
        pageNumber: 'page',
        pageSize: 'per_page',
      },  
      pageSize: 6,
      ajax: {
        beforeSend: function(request) {
          if(getUserInfo() == null){
              logoutSession();
          }
          request.setRequestHeader("Authorization", "Bearer " + getUserInfo().access_token);
        },
        complete: function(jqXHR, textStatus) {
          if (jqXHR.status === 200 || jqXHR.readyState === 0 || jqXHR.status === 0) {
              var courselist_pageNum = localStorage.getItem("cas_courselist_pageNum");
              if(isFirstCourse == true && courselist_pageNum != ""){
                $("#go_to_page").val(courselist_pageNum);
                $(".goto_go").trigger('click');
              }
            if(isFirstCourse){
              isFirstCourse = false;
            }
            return false; // do nothing
          } else if (jqXHR && jqXHR.status === 403) {
            //window.location.href = window.location.href.split('/').slice(0, 3).join('/') + '/login';
            logoutSession();
          } else if(jqXHR && jqXHR.status === 401) {
              alert("Session Expired, Please login again.");
              logoutSession();
          } else {
            if(isFirstCourse){
              isFirstCourse = false;
            }
            alert("Session Expired, Please login again.");
          }
        },    
      },
      callback: function(data, pagination) {
        if(pagination.totalNumber){
          $("#courseTitle").text("All Courses ("+pagination.totalNumber+")");
        }
        if(pagination.totalNumber < 7){
          $("#pagination-container-to").hide();
        }else{
          $("#pagination-container-to").show();
        }
        if(parameter != ''){
          localStorage.setItem("cas_courselist_search", parameter);
        }
        if(data.length === 0){
          $("#courseTitle").text("All Courses (0)");
          $("#nodataFound_course").attr("style", "display:block");
        }else{
          $("#nodataFound_course").attr("style", "display:none");
        }
        var html = template(data);
        //$('#data-assignedTo').html(html);
        //$('#data-assignedBy').html(html);
        if(isFirstCourse == false){
          if(pagination.pageNumber){
            localStorage.setItem("cas_courselist_pageNum", pagination.pageNumber);
          }
        }
      }
    });
  }
}
function template(data){

  let getViewStyle;
  $('.grid-list-view span a').each(function(){
    if($(this).attr('class') === 'active' ){
        getViewStyle = $(this).attr('id');
      }  
  });
  $('#course-box').empty();

  var td = "";
  if(data.length > 0){
    if(getViewStyle === 'list'){
       td =`<div class="container-fluid p-3">
          <div class="table-section chapter_table">
          <table class='table table-bordered responsive' style="table-layout:fixed;">
              <thead>
                <tr>
                  <th>COURSE NAME</th>
                  <th>COURSE CODE</th>
                  <th>DUE DATE</th>
                  <th>PROGRESS</th>
                  <th style="text-align:center;">STATUS</th>
                  <th style="text-align:center;">ACTIONS</th>
                </tr>
              </thead>
            <tbody>`;
    }
    data.forEach(function (element, index, array) {
        if (Object.keys(element).length > 0) {

          var cdots = "";
          if(element.name.length > 50){
            cdots = "...";
          }
          var course_name = element.name;
          var id = element.id;
          var due_date = element.due_in_days !== undefined ? element.due_in_days : "0";
          var progress = element.progress !== undefined ? element.progress : "0";
          var status_class = "";
          var status_text = "";
          if(element.status == 0){
            status_class = "status_new";
            status_text = "New";
          }else if(element.status == 1){
            status_class = "status_inprogress";
            status_text = "Active";
          }else if(element.status == 2){
            status_class = "status_onhold";
            status_text = "On Hold";
          }else if(element.status == 4){
            status_class = "status_completed";
            status_text = "Completed";
          }
          var course_id_prefix = element.course_id_prefix !== undefined ? element.course_id_prefix : "No-ID";

          if(getViewStyle === 'list'){
            td += "<tr>";
            td += "<td class='course_nametd navigate_refresh' href='course/course' data-flinkto='course' data-cid='"+id+"' role='button' title='"+course_name+"'>"+course_name.substring(0, 50)+cdots+"</td>";
            td += "<td>"+course_id_prefix+"</td>";
            td += "<td>"+course_id_prefix+"</td>";
            td += "<td>";
              if(progress == 100){
                td +="<span class='percent-label' style='color:green;'>Completed</span>";
              }else{
                td +="<span class='percent-label'>Progress "+progress+"%</span>";
              }
            td += "</td>";
            td += "<td><p class='"+status_class+"' style='text-align:center;background: none !important;'>"+status_text+"</p></td>";
            td += "<td style='text-align: -webkit-center;'>";
            td +="<div class='col-2 cright' style='text-align:center;'>";
              td +="<div class='dropdown ahide'>";
              td +="<button class='btn dropdown-toggle dbtn' type='button' id='dropdownMenuButton3' data-bs-toggle='dropdown' aria-expanded='false'><i class='fas fa-ellipsis-v'></i></button>";
              td +="<ul class='dropdown-menu' aria-labelledby='dropdownMenuButton3'>";
              td +="<li><a class='dropdown-item' data-course_id='"+id+"' data-cname='"+course_name+"' onClick='editCourse(this);'>Edit</a></li><li><a class='dropdown-item' href='#' data-course_id='"+id+"' data-cname='"+course_name+"' onClick='assignCourse(this);'>Assign</a></li>";
              td +="</ul>";
              td +="</div>";
              td +="</div>";
            td += "</td>";
            td += "</tr>";

            if(index === array.length-1){
              td += "</tbody></table></div></div>";
            }
          }else{
              td += "<div class='col-md-4'><div class='role-content mb-4'><div class='row'>";
              td +="<div class='col-10 cleft tbtn navigate_refresh' href='course/course' data-flinkto='course' data-cid='"+id+"' > <a href='#' data-flinkto='course' data-cid='"+id+"' >"+course_id_prefix+"</a> </div>";
              td +="<div class='col-2 cright'>";
              td +="<div class='dropdown ahide'>";
              td +="<button class='btn dropdown-toggle dbtn' type='button' id='dropdownMenuButton3' data-bs-toggle='dropdown' aria-expanded='false'><i class='fas fa-ellipsis-v'></i></button>";
              td +="<ul class='dropdown-menu' aria-labelledby='dropdownMenuButton3'>";
              td +="<li><a class='dropdown-item' data-course_id='"+id+"' data-cname='"+course_name+"' onClick='editCourse(this);'>Edit</a></li><li><a class='dropdown-item' href='#' data-course_id='"+id+"' data-cname='"+course_name+"' onClick='assignCourse(this);'>Assign</a></li>";
              /*
                EXCEL: 8. Course Card - Edit, Disable, Delete menu should be hidden as for now. 
              */
              //td +="<li><a class='dropdown-item' href='#'>Disable</a></li>";
              //td +="<li><a class='dropdown-item' href='#'>Delete</a></li>";
              td +="</ul>";
              td +="</div>";
              td +="</div>";
              td +="</div>";
              td +="<div class='row navigate_refresh' href='course/course' data-flinkto='course' data-cid='"+id+"' >";
              td +="<div class='col-12'>";
              td +="<h6>"+course_name.substring(0, 50)+cdots+"</h6>";
              td +="<p> <span class='c-comment'><i class='far fa-comment'></i> "+element.comments_count+"</span> <span class='c-comment'><i class='fas fa-paperclip'></i> "+element.attachments_count+"</span> </p>";
              td +="</div>";
              td +="</div>";
              td +="<div class='row navigate_refresh' href='course/course' data-flinkto='course' data-cid='"+id+"' >";
              td +="<div class='col-6 cleft cc'>";
              td +="<div>";
              td +="<div class='progress'>";
              td +="<div class='bar' style='width:"+due_date+"%'>";
              td +="<p class='percent'></p>";
              td +="</div>";
              td +="</div>";
              td +="<span class='percent-label'>Due in "+due_date+" days</span> </div>";
              td +="</div>";
              td +="<div class='col-6 cright cc'>";
              td +="<div style='text-align:center;'>";
              td +="<div class='half-arc' style='--percentage:"+progress+"%;'> <span class='label'></span> </div>";
              if(progress > 99){
                td +="<span class='percent-label' style='color:green;'>Completed</span> </div>";
              }else{
                td +="<span class='percent-label'>Progress "+progress+"%</span> </div>";
              }
              td +="</div>";
              td +="</div>";
              td +="<div class='row mt-2 navigate_refresh' href='course/course' data-flinkto='course' data-cid='"+id+"' >";
              td +="<div class='col-6 cleft'>";
              td +="</div>";
              td +="<div class='col-6 cright'>";
              td +="<div class='new-btn'><p class='"+status_class+"'>"+status_text+"</p></div>";
              td +="</div>";
              td +="</div>";
              td +="</div>";
              td +="</div>";
          }
        }
    });
  }
  $('#course-box').append(td);
}
