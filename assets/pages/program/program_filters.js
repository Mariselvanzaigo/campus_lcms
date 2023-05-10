const programCallbacks =  () => {
    listOriganization();
}

function listOriganization(){
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
}