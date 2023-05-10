const ENVIRONMENT = "development"; //development | staging | live

//Base URL for API
let API_BASE_URL = "https://qaadmin.exper.com/api/v1/camp/";

//SITE URL
const windowLocation = window.location;
let SITE_URL = "";
if (windowLocation.protocol) {
  SITE_URL += windowLocation.protocol + "//";
}
if (windowLocation.hostname) {
  SITE_URL += windowLocation.hostname;
}
if (windowLocation.port) {
  SITE_URL += ":" + windowLocation.port;
}

if (ENVIRONMENT === "development" || ENVIRONMENT === "staging") {
  console.log("----- Nano JS Configurations Start -----");
  console.log("Environment:", ENVIRONMENT);
  console.log("Site URL:", SITE_URL);
  console.log(
    "Visit [PROJECT]/assets/config.js to modify Environment & Site URL "
  );
  console.log("----- Nano JS Configurations End-----");
}

//API_BASE_URL - Base URL for API
// let API_BASE_URL = "https://qaadmin.exper.com/api/v1/camp/";
// let API_CAMPUS_URL = "https://qaadmin.zaigoinfotech.com/api/v1/camp/";
let API_CONTENT_URL = "https://qacontent.exper.com/api/v1/campus/";
// let SITE_URL_PROTOCOL = window.location.protocol + "//" + window.location.hostname;
let SITE_URL_PROTOCOL = SITE_URL;
console.log(SITE_URL_PROTOCOL);
let DOMAIN_FULL = SITE_URL_PROTOCOL.replace(/\/$/, '');
console.log('SITE_URL_PROTOCOL',SITE_URL_PROTOCOL);
let USER_ENGINE_API_URL = "https://elearningadmin.zaigoinfotech.com/api/v1/ue/";
if (SITE_URL_PROTOCOL === "http://127.0.0.1:5501"){
  DOMAIN_FULL = "http://127.0.0.1:5500";
  API_BASE_URL = "https://qaadmin.exper.com/api/v1/camp/";
	SITE_URL_PROTOCOL = "http://127.0.0.1:5501/";
  API_CONTENT_URL = "https://qacontent.exper.com/api/v1/campus/";
  // USER_ENGINE_API_URL = "https://qaadmin.exper.com/api/v1/ue/";

} else if(SITE_URL_PROTOCOL === "http://94.177.203.98"){
  DOMAIN_FULL = "http://127.0.0.1:5500";
  API_BASE_URL = "https://qaadmin.exper.com/api/v1/camp/";
	SITE_URL_PROTOCOL = "http://127.0.0.1:5501/";
  API_CONTENT_URL = "https://qacontent.exper.com/api/v1/campus/";
  // USER_ENGINE_API_URL = "https://qaadmin.exper.com/api/v1/ue/";
} else if(SITE_URL_PROTOCOL === "http://localhost"){
  DOMAIN_FULL = "http://127.0.0.1:5500";
  API_BASE_URL = "https://qaadmin.exper.com/api/v1/camp/";
	SITE_URL_PROTOCOL = "http://localhost/";
  API_CONTENT_URL = "https://qacontent.exper.com/api/v1/campus/";
  // USER_ENGINE_API_URL = "https://qaadmin.exper.com/api/v1/ue/";

}else if(SITE_URL_PROTOCOL === "https://elearning.zaigoinfotech.com"){
	SITE_URL_PROTOCOL = "https://elearning.zaigoinfotech.com/";
  API_BASE_URL = "https://elearningadmin.zaigoinfotech.com";
  API_CONTENT_URL = "https://elearningcontent.zaigoinfotech.com";
  USER_ENGINE_API_URL = "https://elearningadmin.zaigoinfotech.com/api/v1/ue/";

} else if(SITE_URL_PROTOCOL === "https://cas.exper.com"){
	SITE_URL_PROTOCOL = "https://cas.exper.com/";
  API_BASE_URL = "https://admin.exper.com";
  API_CONTENT_URL = "https://content.exper.com";
  USER_ENGINE_API_URL = "https://admin.exper.com/api/v1/ue/";

}else if(SITE_URL_PROTOCOL === "https://uatcas.exper.com"){
  SITE_URL_PROTOCOL = "https://uatcas.exper.com/";
  API_BASE_URL = "https://uatadmin.exper.com";
  API_CONTENT_URL = "https://uatcontent.exper.com";
  USER_ENGINE_API_URL = "https://uatadmin.exper.com/api/v1/ue/";

}else if(SITE_URL_PROTOCOL === "https://precas.exper.com"){
  SITE_URL_PROTOCOL = "https://precas.exper.com/";
  API_BASE_URL = "https://preadmin.exper.com";
  API_CONTENT_URL = "https://precontent.exper.com";
  USER_ENGINE_API_URL = "https://preadmin.exper.com/api/v1/ue/";

}

console.log(SITE_URL_PROTOCOL);
/* Firebase */
var firebaseConfig = {
  apiKey: "AIzaSyAdLTHIe9poMMrgL46G-NtUfSGRqkGvYN8",
  authDomain: "feroz-shaik-8613.firebaseapp.com",
  databaseURL: "https://feroz-shaik-8613.firebaseio.com",
  projectId: "feroz-shaik-8613",
  storageBucket: "feroz-shaik-8613.appspot.com",
  messagingSenderId: "651394549638",
  appId: "1:651394549638:web:b23db54c5290e7b3808e07",
  measurementId: "G-KESL97HP8Q"
};

/*const firebaseConfig = {
  apiKey: "AIzaSyDN823YYTyKnOqF_n9nP29wDjCm1QCdxeY",
  authDomain: "medvarsity-tech.firebaseapp.com",
  projectId: "medvarsity-tech",
  storageBucket: "medvarsity-tech.appspot.com",
  messagingSenderId: "410925001844",
  appId: "1:410925001844:web:3ffd7ec159e8c2e79ef521",
  measurementId: "G-MLES59N18V"
};*/

if(window.toastr !== undefined) {
  window.toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "500",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  };
}
