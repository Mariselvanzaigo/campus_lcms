//  Get Members - For Member List Page
function getMembers() {
  getRolesOptions(".member-role-list");
  $("#member-loader").css("display", "block");
  $("#memberListContainer").css("display", "none");
  //adding below code for testing - since no API available
  axios
    .get(`${API_BASE_URL}/roles/`,{
      headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token}
    })
    .then((res1) => {
      //once the API is available, rename "res1" to "res" & remove the variable "res" added below
      let html = "";

      const res = {
        data: {
          count: 0,
          next: null,
          previous: null,
          results: [
            {
              id: "0626ac77-7d94-467b-9025-344571528085",
              first_name: "User 1",
              last_name: "Test 1",
              email_id: "user1@test.com",
              phone_number: "9876543210",
              status: 1,
              mc_status: 1,
              m_image: "",
              roles_name: "Medical Reviewer",
            },
            {
              id: "0626ac77-7d94-467b-9025-344571528085",
              first_name: "User 2",
              last_name: "Test 2",
              email_id: "user2@test.com",
              phone_number: "8976543210",
              status: 1,
              mc_status: 1,
              m_image: "",
              roles_name: "Medical Reviewer",
            },
            {
              id: "0626ac77-7d94-467b-9025-344571528085",
              first_name: "User 3",
              last_name: "Test 3",
              email_id: "user3@test.com",
              phone_number: "9876543210",
              status: 1,
              mc_status: 1,
              m_image: "",
              roles_name: "Slide Designer",
            },
            {
              id: "0626ac77-7d94-467b-9025-344571528085",
              first_name: "User 4",
              last_name: "Tes 4",
              email_id: "user4@test.com",
              phone_number: "7896543210",
              status: 1,
              mc_status: 1,
              m_image: "",
              roles_name: "Medical Writer",
            },
          ],
        },
      };

      if (res.data.results && res.data.results.length > 0) {
        html = renderMemberList(res.data.results);
      } else {
        html = "<td class='text-center' colspan='7'>No Member Found</td>";
      }

      $("#memberListDataContainer").html(html);
    })
    .catch((error) => {
      console.error("There was an error!", error.response);
    })
    .finally(() => {
      $("#member-loader").css("display", "none");
      $("#memberListContainer").css("display", "flex");
    });
}

function renderMemberList(members) {
  let html = "";

  $.each(members, function (index, member) {
    html += `<tr>`;
    html += `<td>`;
    html += `<div class="form-check">`;
    html += `<input class="form-check-input" name="chk" type="checkbox" value="" id="flexCheckDefault2" /><label class="form-check-label" for="flexCheckDefault2"></label>`;
    html += `</div>`;
    html += `</td>`;
    html += `<td>${index + 1}</td>`;
    html += `<td class="pointer" data-flinkto="usermemberprofile">`;
    html += `<img src="../assets/images/Ellipse10.png" /> ${member.first_name} ${member.last_name}`;
    html += `</td>`;
    html += `<td>${member.email_id}</td>`;
    html += `<td>${member.phone_number}</td>`;
    html += `<td>`;
    html += `<span class="green-shade"><a href="#">${member.roles_name}</a></span>`;
    html += `<td>`;
    html += `<div class="dropdown ahide">`;
    html += `<button class="btn dropdown-toggle dbtn" type="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-ellipsis-v"></i></button>`;
    html += `<ul class="dropdown-menu">`;
    html += `<li><a class="dropdown-item" href="#">Edit</a></li>`;
    html += `<li><a class="dropdown-item" href="#">Disable</a></li>`;
    html += `<li><a class="dropdown-item" href="#delete">Delete</a></li>`;
    html += `</ul>`;
    html += `</div>`;
    html += `</td>`;
    html += `</tr>`;
  });

  return html;
}

//  Get Roles - For Member Create Page & Member List Page
function getRolesOptions(target) {
  axios
    .get(`${API_BASE_URL}/roles/`,{
      headers: {"Content-type": "application/json; charset=UTF-8", "Authorization": "Bearer " + getUserInfo().access_token}
    })
    .then((res) => {
      if (res.data && res.data.length > 0) {
        renderRoleOptions(res.data, target);
      }
    })
    .catch((error) => {
      var res = error.response;
      if(res.status == 403) {
        toastr.error(res.data.detail);
        //get403Page();
      } else {
        console.error("There was an error!", error.response);
      }
    })
    .finally(() => {});
}

function renderRoleOptions(roles, target) {
  let html = "";

    html += `<option value="" selected disabled>Select Role</option>`;
  $.each(roles, function (index, role) {
    html += `<option value="${role.id}" >${role.name}</option>`;
  });
  if(html == ""){
   // html += `<option value="" selected disabled>Select Role</option>`;
  }
  $(`${target}`).empty();
  $(`${target}`).append(html);
}
