var selectedRoleID = '';
async function getTestPage() {
  fetch(`${SITE_URL_PROTOCOL}/assets/pages/testPage/index.html`)
    .then((data) => data.text())
    .then((html) => (document.getElementById("app-admin").innerHTML = html))
    .then(() => {
      //for API
      // getTestPageData();
    })
    .catch(function (error) {
      console.log("Requestfailed", error);
    });
}

async function getDashboardPage() {
  $("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/dashboard/dashboard.html`,
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
      } else {
        console.log("Something error happend");
      }
    }
  );
}

async function getRolesPage() {
  //check for rights
  if(processRights("View Role") === false) {
    toastr.error(window.language.error_no_access);
    return false;
  }
  $("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/roles/roles.html`,
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
        getRoles();
      } else {
        console.log("Something error happend");
      }
    }
  );
}
async function getOrganizationlistPage() {

  // if(processRights("View Role") === false) {
  //   toastr.error(window.language.error_no_access);
  //   return false;
  // }
  $("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/organization/organizationlist.html`,
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
      } else {
        console.log("Something error happend");
      }
    }
  );
}
async function getAddInstitutePage() {

  // if(processRights("View Role") === false) {
  //   toastr.error(window.language.error_no_access);
  //   return false;
  // }
  $("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/organization/addinstitute.html`,
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
      } else {
        console.log("Something error happend");
      }
    }
  );
}
async function getProgramOranizationListPage() {

  // if(processRights("View Role") === false) {
  //   toastr.error(window.language.error_no_access);
  //   return false;
  // }
  $("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/program/programorganizationlist.html`,
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
      } else {
        console.log("Something error happend");
      }
    }
  );
}
async function getCreateProgramPage() {

  // if(processRights("View Role") === false) {
  //   toastr.error(window.language.error_no_access);
  //   return false;
  // }
  $("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/program/createprogram.html`,
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
      } else {
        console.log("Something error happend");
      }
    }
  );
}
async function getRolesEmptyPage() {
  if(processRights("View Role") === false) {
    toastr.error(window.language.error_no_access);
    return false;
  }
  $("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/roles/rolesempty.html`,
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
      } else {
        console.log("Something error happend");
      }
    }
  );
}

async function getUserRolesPage(roleID) {
  if(typeof(roleID) !== "undefined") {
    window.selectedRoleID = roleID;
  }
  if(processRights("View Member") === false) {
    toastr.error(window.language.error_no_access);
    return false;
  }
  /*$("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/members/members.html?t=` + Math.floor(Date.now() / 1000),
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
      } else {
        console.log("Something error happend");
      }
    }
  );*/
}

async function getUserRolesProfilePage() {
  if(processRights("profile") === false) {
    toastr.error(window.language.error_no_access);
    return false;
  }
  $("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/roles/userrolesprofile.html`,
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
      } else {
        console.log("Something error happend");
      }
    }
  );
}

async function getCoursesEmptyPage() {
  if(processRights("course") === false) {
    toastr.error(window.language.error_no_access);
    return false;
  }
  $("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/courses/coursesempty.html`,
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
      } else {
        console.log("Something error happend");
      }
    }
  );
}

async function getCoursesListPage() {
  if(processRights("course") === false) {
    toastr.error(window.language.error_no_access);
    return false;
  }
  $("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/courses/courseslist.html`,
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
      } else {
        console.log("Something error happend");
      }
    }
  );
}

async function getCoursesListInnerPage(e) {
  if(processRights("course") === false) {
    toastr.error(window.language.error_no_access);
    return false;
  }
  $("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/courses/courseslistinner.html`,
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
        $.getScript(`${SITE_URL_PROTOCOL}/assets/global/custom.js`, function() {});
        var course_flinkto_elem = document.querySelectorAll("[data-flinkto='course'], [data-flinkto='courseslistlevel'], [data-flinkto='courseslistinner']");
        course_flinkto_elem.forEach(el=>{
          el.setAttribute("data-cid", e.target.dataset.cid);
          el.setAttribute("data-cname", e.target.dataset.cname);
        });
      } else {
        console.log("Something error happend");
      }
    }
  );
}

async function getCoursesListLevelPage(e) {
  if(processRights("course") === false) {
    toastr.error(window.language.error_no_access);
    return false;
  }
  /*$("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/courses/courseslistlevel.html`,
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
        var course_flinkto_elem = document.querySelectorAll("[data-flinkto='course'], [data-flinkto='courseslistlevel'], [data-flinkto='courseslistinner'], [data-flinkto='courseseditor']");
        course_flinkto_elem.forEach(el=>{
          el.setAttribute("data-cid", e.target.dataset.cid);
          el.setAttribute("data-module_id", e.target.dataset.module_id);
          el.setAttribute("data-mod_type", e.target.dataset.mod_type);
          el.setAttribute("data-can_edit", e.target.dataset.can_edit);
          el.setAttribute("data-case_id", e.target.dataset.case_id);
          el.setAttribute("data-case_module_id", e.target.dataset.case_module_id);
          el.setAttribute("data-chapter_id", e.target.dataset.chapter_id);
          el.setAttribute("data-chapter_topic_id", e.target.dataset.chapter_topic_id);
        });
        $.getScript(`${SITE_URL_PROTOCOL}/assets/pages/courses/courseslistlevel.js`, function() {});
      } else {
        console.log("Something error happend");
      }
    }
  );*/
}

async function getCoursesEditorPage(e) {
  if(processRights("course") === false) {
    toastr.error(window.language.error_no_access);
    return false;
  }
  $("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/courses/courseseditor.html`,
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
        var course_flinkto_elem = document.querySelectorAll("[data-flinkto='course'], [data-flinkto='courseslistlevel'], [data-flinkto='courseslistinner'], [data-flinkto='courseseditor']");
        course_flinkto_elem.forEach(el=>{
          el.setAttribute("data-cid", e.target.dataset.cid);
          el.setAttribute("data-module_id", e.target.dataset.module_id);
        });
      } else {
        console.log("Something error happend");
      }
    }
  );
}

async function getTaskPage() {
  if(processRights("task") === false) {
    toastr.error(window.language.error_no_access);
    return false;
  }
  /*$("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/task/task.html?t=` + Math.floor(Date.now() / 1000),
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
      } else {
        console.log("Something error happend");
      }
    }
  );*/
}

async function getTaskCalendarPage() {
  if(processRights("task") === false) {
    toastr.error(window.language.error_no_access);
    return false;
  }
  /*$("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/task/taskcalendar.html`,
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
      } else {
        console.log("Something error happend");
      }
    }
  );*/
}

async function getMembersPage() {
  if(processRights("View Member") === false) {
    toastr.error(window.language.error_no_access);
    return false;
  }
  $("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/members/members.html?t=` + Math.floor(Date.now() / 1000),
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
        // getMembers();
      } else {
        console.log("Something error happend");
      }
    }
  );
}

async function getMembersTabPage() {
  if(processRights("View Member") === false) {
    toastr.error(window.language.error_no_access);
    return false;
  }
  $("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/members/memberstab.html`,
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
      } else {
        console.log("Something error happend");
      }
    }
  );
}

async function getUserMemberProfilePage() {
  if(processRights("View Member") === false) {
    toastr.error(window.language.error_no_access);
    return false;
  }
  $("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/members/usermemberprofile.html`,
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
      } else {
        console.log("Something error happend");
      }
    }
  );
}



/***************new course card and list starts*****************/
async function getCoursesPage() {
  /*
  if(processRights("course") === false) {
    toastr.error(window.language.error_no_access);
    return false;
  }
  */
  $("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/courses/courses.html?t=` + Math.floor(Date.now() / 1000),
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
        $.getScript(`${SITE_URL_PROTOCOL}/assets/pages/courses/courses.js`, function() {});        
      } else {
        console.log("Something error happend");
      }
    }
  );
}

/*************** Get Cource Page Starts Here********************/
async function getCoursePage(e) {
  
}
/**********Get Cource Page Ends Here**************/

// async function getcoursesPageHtml(course_head, outerHtml){
//   fetch(`${SITE_URL_PROTOCOL}/assets/pages/course/course.html`)
//     .then((data) => data.text())
//     .then((html) => (document.getElementById("app-admin").innerHTML = course_head+html + outerHtml))
//     .catch(function (error) {
//       console.log("Requestfailed", error);
//     });
// }

/***************Course Modules Get Json and assign Tree structured format and Design Starts Here*************/

/***************Course Modules Get Json and assign Tree structured format and Design Ends Here*************/

/***************new course card and list end*****************/

/********** Top Menu On Click Event Start **********/
//NOTE: Add "data-flinkto" to the element which we need to load page/screen
document.addEventListener("click", function (e) {
  if (e.target && e.target.dataset.flinkto) {
    if(e.target.dataset.flinkto == "course"){
      document.getElementById("app-admin").classList.add("admin_course");
    }else{
      document.getElementById("app-admin").classList.remove("admin_course");
    }
    if(e.target.dataset.flinkto == "roles" || e.target.dataset.flinkto == "courses" ){
      document.getElementById("app-admin").classList.add("set_back_color");
    }else{
      document.getElementById("app-admin").classList.remove("set_back_color");
    }
    e.preventDefault();
    handleTopMenuClick(e);
  }
});

async function get403Page() {
  $("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/errors/error_403.html`,
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
      } else {
        console.log("Something error happend");
      }
    }
  );
}



/**************case module start***************/
async function getCasesPage() {
  /*if(processRights("case") === false) {
    toastr.error(window.language.error_no_access);
    return false;
  }*/
  $("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/cases/case.html`,
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
      } else {
        console.log("Something error happend");
      }
    }
  );
}

async function getCasesListPage(e) {
  /*if(processRights("case") === false) {
    toastr.error(window.language.error_no_access);
    return false;
  }*/
  /*$("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/cases/caselist.html`,
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
        var case_flinkto_elem = document.querySelectorAll("[data-flinkto='cases'], [data-flinkto='caseslist']");
        case_flinkto_elem.forEach(el=>{
          el.setAttribute("data-case_id", e.target.dataset.case_id);
          el.setAttribute("data-case_name", e.target.dataset.case_name);
        });
      } else {
        console.log("Something error happend");
      }
    }
  );*/
}
async function getCasesListLevelPage(e){
  /*if(processRights("case") === false) {
    toastr.error(window.language.error_no_access);
    return false;
  }*/
  /*$("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/cases/caselistlevel.html`,
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
        var case_flinkto_elem = document.querySelectorAll("[data-flinkto='cases'], [data-flinkto='caseslist'], [data-flinkto='caseslist']");
        case_flinkto_elem.forEach(el=>{
          el.setAttribute("data-case_id", e.target.dataset.case_id);
          el.setAttribute("data-case_module_id", e.target.dataset.case_module_id);
        });
        $.getScript(`${SITE_URL_PROTOCOL}/assets/pages/cases/caselistlevel.js`, function() {}); 
      } else {
        console.log("Something error happend");
      }
    }
  );*/
}

async function getChaptersPage(e) {
  /*if(processRights("chapters") === false) {
    toastr.error(window.language.error_no_access);
    return false;
  }*/
  /*$("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/chapters/chapters.html?t=` + Math.floor(Date.now() / 1000),
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
        //console.log(e.target.dataset);
      } else {
        console.log("Something error happend");
      }
    }
  );*/
}

async function getModulePage() {
  /*if(processRights("modules") === false) {
    toastr.error(window.language.error_no_access);
    return false;
  }*/
  $("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/modules/modules.html`,
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
      } else {
        console.log("Something error happend");
      }
    }
  );
}

async function getModulesListPage() {
  /*if(processRights("modules") === false) {
    toastr.error(window.language.error_no_access);
    return false;
  }*/
  $("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/modules/moduleslist.html`,
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
      } else {
        console.log("Something error happend");
      }
    }
  );
}

async function getCoursesListNewPage() {
  /*if(processRights("case") === false) {
    toastr.error(window.language.error_no_access);
    return false;
  }*/
  $("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/courses/courseslistnew.html`,
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
      } else {
        console.log("Something error happend");
      }
    }
  );
}

async function getKnowledgeCheckPage(e) {
  /*if(processRights("case") === false) {
    toastr.error(window.language.error_no_access);
    return false;
  }*/
  /*$("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/cases/knowledgecheck.html`,
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
        var case_flinkto_elem = document.querySelectorAll("[data-flinkto='caseslist']");
        case_flinkto_elem.forEach(el=>{
          el.setAttribute("data-case_id", e.target.dataset.case_id);
          el.setAttribute("data-case_name", e.target.dataset.case_name);
          el.setAttribute("data-case_module_id", e.target.dataset.case_module_id);
          el.setAttribute("data-case_module_name", e.target.dataset.case_module_name);
        });
      } else {
        console.log("Something error happend");
      }
    }
  );*/
}

async function getChapterListPage(e) {
  /*if(processRights("case") === false) {
    toastr.error(window.language.error_no_access);
    return false;
  }*/
  /*$("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/chapters/chapterslist.html?t=` + Math.floor(Date.now() / 1000),
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
        var case_flinkto_elem = document.querySelectorAll("[data-flinkto='chapters'], [data-flinkto='chapterslist']");
        case_flinkto_elem.forEach(el=>{
          el.setAttribute("data-chapter_id", e.target.dataset.chapter_id);
          el.setAttribute("data-chapter_name", e.target.dataset.chapter_name);
        });
      } else {
        console.log("Something error happend");
      }
    }
  );*/
}

async function getChapterListLevelPage(e){
  /*if(processRights("case") === false) {
    toastr.error(window.language.error_no_access);
    return false;
  }*/
  /*$("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/chapters/chapterlistlevel.html`,
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
        var case_flinkto_elem = document.querySelectorAll("[data-flinkto='chapters'], [data-flinkto='chapterslist'], [data-flinkto='chapterlistlevel']");
        case_flinkto_elem.forEach(el=>{
          el.setAttribute("data-chapter_id", e.target.dataset.chapter_id);
          el.setAttribute("data-chapter_topic_id", e.target.dataset.chapter_topic_id);
        });
        $.getScript(`${SITE_URL_PROTOCOL}/assets/pages/chapters/chapterlistlevel.js`, function() {}); 
      } else {
        console.log("Something error happend");
      }
    }
  );*/
}

async function getCourseKnowledgecheck(e){
  
  $("#app-admin").load(
    `${SITE_URL_PROTOCOL}/assets/pages/courses/course_knowledge_check.html`,
    function (resp, status, xhr) {
      if (status == "success" && xhr.status == 200) {
        var case_flinkto_elem = document.querySelectorAll("[data-flinkto='courseslistlevel'],[data-flinkto='course']");
        case_flinkto_elem.forEach(el=>{
          el.setAttribute("data-case_id", e.target.dataset.case_id);
          //el.setAttribute("data-case_name", e.target.dataset.case_name);
          el.setAttribute("data-cid", e.target.dataset.cid);
          el.setAttribute("data-case_module_id", e.target.dataset.case_module_id);
          el.setAttribute("data-case_module_name", e.target.dataset.case_module_name);
        });
      } else {
        console.log("Something error happend");
      }
    }
  );
}

function getUrlParamquery(){
  var queries = {};
  $.each(document.location.search.substr(1).split('&'),function(c,q){
    var i = q.split('=');
    if(i[0]){
      queries[i[0].toString()] = i[1].toString();
    }
  });
  return queries;
}

function handleTopMenuClick(e) {
  switch (e.target.dataset.flinkto) {
    case "dashboard":
      getDashboardPage();
      break;

    case "roles":
      getRolesPage();
      break;

    case "organizationlist":
      getOrganizationlistPage();
      break;

    case "addinstitute":
      getAddInstitutePage();
      break;

    case "programorganizationlist":
      getProgramOranizationListPage();
      break;

    case "createprogram":
        getCreateProgramPage();
        break;  

    case "rolesempty":
      getRolesEmptyPage();
      break;

    case "userroles":
      getUserRolesPage(e.target.dataset.target);
      break;

    case "userrolesprofile":
      getUserRolesProfilePage();
      break;

    case "course":
      if(processRights("course") === false) {
        toastr.error(window.language.error_no_access);
        return false;
      }
      getCoursePage(e);
      break;

    case "courses":
      getCoursesPage();
      break;

    case "coursesempty":
      getCoursesEmptyPage();
      break;

    case "courseslist":
      getCoursesListPage();
      break;
      
     
    case "courseslistinner":
      getCoursesListInnerPage(e);
      break;

    case "courseslistlevel":
      getCoursesListLevelPage(e);
      break;
    
    case "course_knowledgecheck":
      getCourseKnowledgecheck(e);
      break;

    case "courseseditor":
      getCoursesEditorPage(e);
      break;
      
    case "courseslistnew":
        getCoursesListNewPage();
        break;
    
    case "task":
      getTaskPage();
      break;

    case "taskcalendar":
      getTaskCalendarPage();
      break;

    case "members":
      getMembersPage();
      break;

    case "usermemberprofile":
      getUserMemberProfilePage();
      break;

    case "memberstab":
      getMembersTabPage();
      break;

    case "cases":
      getCasesPage();
      break;

    case "caselist":
      getCasesListPage(e);
      break;

    case "caselistlevel":
      getCasesListLevelPage(e);
      break;
            
    case "knowledgecheck":
        getKnowledgeCheckPage(e);
        break;  

    case "modules":
        getModulePage();
        break;  
      
    case "moduleslist":
        getModulesListPage();
        break;

    case "chapters":
        getChaptersPage(e);
        break;  

    case "chapterslist":
        getChapterListPage(e);
        break;  

    case "chapterlistlevel":
        getChapterListLevelPage(e);
        break; 
        
    case "settings":
        getTestPage();
        break;
    default:
  }
}
/********** Top Menu On Click Event End **********/
