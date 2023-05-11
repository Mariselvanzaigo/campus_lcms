const programCallbacks =  () => {
    listOriganization();
}

function listOriganization(){
    $.ajax({
        url: API_BASE_URL + 'parent_institute/list/',
        type: 'get',
        dataType: 'json',
        headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token},
        success:function(response){
          
          //console.log(response);
          if(response.message === 'success'){

            let org_data = response.data;
            let org_Element = $('#prg_orglist_items');
            console.log('org_data: ', org_data)
            
            if(org_data.length > 0){
              $.each(org_data, function(index, element){
              let accrd = '';
              let collapsedClass = (index == 0) ? '': 'collapsed';
              let expandBool = (index == 0) ? 'true': 'false';
              let collspaeShow = (index == 0) ? 'show': '';
              accrd += '<div class="accordion-item">';
              accrd += '<h2 class="accordion-header" id="h_'+ element.id +'">';
              accrd += '<button class="accordion-button '+ collapsedClass +'"  type="button" data-bs-toggle="collapse" data-bs-target="#i_'+ element.id +'" aria-expanded="'+ expandBool +'" aria-controls="i_'+ element.id +'">'+ element.organization_name +'</button></h2>';
              accrd += '<div id="i_'+ element.id +'" class="accordion-collapse collapse '+ collspaeShow +'" aria-labelledby="h_'+ element.id + '" data-bs-parent="#orglist_items">';
              accrd += '<div class="accordion-body">';
              accrd += '<ul>';  
              let org_sublist = element.children;
              console.log('org_sublist', org_sublist);
              if(org_sublist.length > 0){
                $.each(org_sublist, function(index, ele){
                  console.log(ele.id);
                  console.log(ele.name);
                  accrd += `<li id="${ele.id}"><a href='#'>${ele.name}</a></li>`;
                });
              }
              accrd += '</ul>';  
              accrd += '</div>';
              accrd += '</div>';
              accrd += '</div>';
              org_Element.append(accrd);
              });
            }
          } 
          // $("#courses_list").empty();
          // $("#courses_list").append("<option value=''>Select Master Course</option>");
          // $.each( response, function( i, val ) {
          //   $("#courses_list").append("<option value='"+val.id+"'>"+val.name+"</option>");
          // });
        }, 
        error: function(error) {
          if (error.status === 401) {
            alert("Session Expired, Please login again.");
            logoutSession();
          }
        }
      });
}