class Auth {
  // setup the class and hide the body by default
 constructor() {
   document.querySelector("body").style.display = "none";
   const auth = localStorage.getItem("auth_lcms");
   this.validateAuth(auth);
 }
 // check to see if the localStorage item passed to the function is valid and set
 validateAuth(auth) {
     if (auth != 1) {
       if(window.location.href != SITE_URL_PROTOCOL){
       console.log(SITE_URL_PROTOCOL);
       window.location.replace(SITE_URL_PROTOCOL);
       // return true;
       }
     } else {
       document.querySelector("body").style.display = "block";
       setUserInfo ( window.getUserInfo() );
       // processRights(null);
     }
 }
 // will remove the localStorage item and redirect to login  screen
 logOut() {
   localStorage.removeItem("auth_lcms");
   localStorage.removeItem("auth_type_lcms");
   localStorage.removeItem("auth_user_lcms");
   localStorage.removeItem("auth_data_lcms");
   localStorage.removeItem("system_rights");
   window.location.replace(SITE_URL_PROTOCOL+"login");
 }
}
const auth = new Auth();
var logoutTag = document.querySelector(".logout");
if (logoutTag !== null) {
 logoutTag.addEventListener("click", (e) => {
   auth.logOut();
 });    
}

function getUserInfo(){
 const authData = localStorage.getItem("auth_data_lcms");
 return JSON.parse(authData);
}

function setUserInfo(authData){
 if(authData !== null) {
   //console.log(authData.rights);
   $("#dropdownMenuButton1").html('<span>' + authData.name.substring(0, 15) + '</span>' + '<span class="user-role">' + authData.role + '</span>');
   if(authData.m_image !== ""){
     $("#userProfileImageHead").attr("src",authData.m_image);
   }
   $(".fullname").html(authData.name);
   //check for rights
   $("#navRight li").each(function(i, val){
     if($(this).children("a").prop("rel")) {
       if(processRights($(this).children("a").prop("rel")) === false) {
         $(this).addClass("d-none"); //hide the menu
       }
     }
   });
   //Process rights - Add/Edit Role
   if( $("#trigger-role-create-form").length > 0) {
     if(processRights("Add/Edit Role") === false) {
       $("#trigger-role-create-form").remove();
     }
   }
   //Process rights - Add/Edit Member
   if( $("#member-add").length > 0) {
     if(processRights("Add/Edit Member") === false) {
       $("#member-add").remove();
       // Bulk Upload - Button needs to be hide as for now.
       //$("#member-bulk-upload, #addusers").remove();
     }
   }
   
   if($("#btnAddCourse").length > 0) {
     if(processRights("Add Course") === false || processRights("Define Course") === false) {
       $("#btnAddCourse").remove();
     }
   }
   
 }
}

/*
Rights function
name: 
 Add Audio, Add Course, Add Slide, Define Course, Add/Edit Member, Delete Member, List Course, View Member, 
 Write Content, Add Design Instructions, Add Comments, Add Video, Delete Course, Add/Edit Role, Delete Role, 
 Review Content, View Role

*/
function processRights(action){
 var returnStatus = false;
 action = action.toLowerCase();
 if(action === "task") { return true; } // return user with true with action was task
 if(action === "course") { return true; } // return user with true with action was task
 if(window.getUserInfo() == null ){
   auth.logOut();
 }
 var userRights = window.getUserInfo().rights;
 $.each(userRights, function(i, val) {
   val = val.toLowerCase();
   if(val === action) {
     returnStatus = true;
   }
 });
 return returnStatus;
}