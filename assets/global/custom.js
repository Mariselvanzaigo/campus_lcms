function parse_query_string(query) {
  var vars = query.split("&");
  var query_string = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    var key = decodeURIComponent(pair[0]);
    var value = decodeURIComponent(pair[1]);
    // If first entry with this name
    if (typeof query_string[key] === "undefined") {
      query_string[key] = decodeURIComponent(value);
      // If second entry with this name
    } else if (typeof query_string[key] === "string") {
      var arr = [query_string[key], decodeURIComponent(value)];
      query_string[key] = arr;
      // If third or later entry with this name
    } else {
      query_string[key].push(decodeURIComponent(value));
    }
  }
  return query_string;
}

/**************sidenav and header include*************/
function withJquery() {
  console.time("time1");
  var temp = $("<input>");
  $("body").append(temp);
  temp.val($("#copyText1").text()).select();
  document.execCommand("copy");
  temp.remove();
  console.timeEnd("time1");
}
/**************sidenav and header include*************/

/**************side nav click*************/
var menu_btn = document.querySelector("#menu-btn");
var sidebar = document.querySelector("#sidebar");
var container = document.querySelector(".my-container");
if(menu_btn !== null) {
  menu_btn.addEventListener("click", function () {
    sidebar.classList.toggle("active-nav");
    container.classList.toggle("active-cont");
  });
}
/**************side nav click*************/

/**************sub nav click*************/
$(".sub-menu ul").hide();
$(".sub-menu a").click(function () {
  $(this).parent(".sub-menu").children("ul").slideToggle("100");
  $(this).find(".right").toggleClass("fa-caret-up fa-caret-down");
});
/**************sub nav click*************/

/**************semi progress bar*************/
$(".progress").each(function () {
  var $bar = $(this).find(".bar");
  var $val = $(this).find("span");
  var perc = parseInt($val.text(), 10);

  $({ p: 0 }).animate(
    { p: perc },
    {
      duration: 3000,
      easing: "swing",
      step: function (p) {
        $bar.css({
          transform: "rotate(" + (45 + p * 1.8) + "deg)", // 100%=180° so: ° = % * 1.8
          // 45 is to add the needed rotation to have the green borders at the bottom
        });
        $val.text(p | 0);
      },
    }
  );
});
/**************semi progress bar*************/

/**************multiple accordion*************/
$(".acnav__label").click(function () {
  var label = $(this);
  var parent = label.parent(".has-children");
  var list = label.siblings(".acnav__list");

  if (parent.hasClass("is-open")) {
    list.slideUp("fast");
    parent.removeClass("is-open");
  } else {
    list.slideDown("fast");
    parent.addClass("is-open");
  }
});
/**************multiple accordion*************/

/**************tooltip*************/
var tooltipTriggerList = [].slice.call(
  document.querySelectorAll('[data-toggle="tooltip"]')
);
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});
/**************tooltip*************/

/**************notification start*************/
function reveal() {
  if (document.getElementById("hidden-div").style.display == "block") {
    document.getElementById("hidden-div").style.display = "none";
  } else {
    document.getElementById("hidden-div").style.display = "block";
  }
}
/**************notification end*************/

/*******************multiple tag list************************/
document.addEventListener("keyup", function(e){
    if (e.keyCode === 13 && e.target.classList.contains("tag__input")) {
		const currentTag = e.target.value;
		if(currentTag){
			const hiddenInput = e.target.nextElementSibling.nextElementSibling;
			const hiddenInputOldValue = hiddenInput.value;
			
			const existingTags = getExistingTagAsArray(hiddenInputOldValue);
			const isTagExistAlready = checkIfTagExistAlready(existingTags, currentTag);
			
			if(isTagExistAlready){ return; }
			
			if(hiddenInputOldValue){
				hiddenInput.value = hiddenInputOldValue + "," + currentTag;
			}else{
				hiddenInput.value = currentTag;				
			}
			
			const newTag = ` <li>${currentTag}<span class="tag__remove" data-tag=${currentTag}>×</span></li>`;
			e.target.nextElementSibling.insertAdjacentHTML("beforeend", newTag);
			e.target.value = "";
		}
    }
});

document.addEventListener("click", function(e){
    if (e.target.classList.contains("tag__remove")) {
		const currentTag = e.target.dataset.tag;
		const hiddenInput = e.target.parentElement.parentElement.nextElementSibling;	
		const hiddenInputOldValue = hiddenInput.value;
		
		const existingTags = getExistingTagAsArray(hiddenInputOldValue);
		const isTagExistAlready = checkIfTagExistAlready(existingTags, currentTag);
		
		if(isTagExistAlready){
			const updatedInputValueAsArray = existingTags.filter((tag) => {
				return tag != currentTag 
			});
			const updatedInputValue = updatedInputValueAsArray.join(",");
			
			hiddenInput.value = updatedInputValue;
		}
			
		e.target.parentElement.remove();
	}
});

const getExistingTagAsArray = (allTags) => {
	let existingTagsAsArray = [];
	
	if(allTags.includes(",")){
		existingTagsAsArray = allTags.split(",");
	}
	
	return existingTagsAsArray;
}

const checkIfTagExistAlready = (allTags, currentTag) => {
	if(allTags.includes(currentTag)){ 
		return true;
	}else{
		return false;
	}
}
/*******************multiple tag list************************/

/**************Drag and Drop*************/
function init() {
  //console.log("init");
  $('a[href="#"]').click( function(e) { e.preventDefault(); });
  if($( ".droppable-area1" ).length > 0) {
    $(".droppable-area1")
      .sortable({
        connectWith: ".connected-sortable",
        stack: ".connected-sortable ul",
      })
      .disableSelection();
  }

  if($( ".droppable-area2" ).length > 0) {
    $(".droppable-area2")
      .sortable({
        connectWith: ".connected-sortable",
        stack: ".connected-sortable div",
      })
      .disableSelection();
  }
}
/**************Drag and Drop*************/

/**************select and deselect checkbox*************/
function selects() {
  var checkBox = document.getElementById("myCheck");
  var text = document.getElementById("text");
  if (checkBox.checked == true) {
    var ele = document.getElementsByName("chk");
    for (var i = 0; i < ele.length; i++) {
      if (ele[i].type == "checkbox") {
        ele[i].checked = true;
      }
    }
  } else {
    var ele = document.getElementsByName("chk");
    for (var i = 0; i < ele.length; i++) {
      if (ele[i].type == "checkbox") {
        ele[i].checked = false;
      }
    }
  }
}

/**************select and deselect checkbox*************/

document.addEventListener('DOMContentLoaded', getLanguage);

function getLanguage(){
  const l = document.getElementsByTagName("*");
  for(i = 0;  i<l.length; i++) {
    //Label / Text
    if( typeof(l[i].dataset.lang) !== "undefined" ) {
      if(typeof(window.language[l[i].dataset.lang]) !== "undefined") {
        l[i].innerHTML = window.language[l[i].dataset.lang];
      }
    }
    //placeholder
    if( typeof(l[i].dataset.placeholder) !== "undefined" ) {
      if(typeof(window.language[l[i].dataset.placeholder]) !== "undefined") {
        l[i].placeholder = window.language[l[i].dataset.placeholder];
      }
    }
  }
}

String.prototype.str_replace = function(src, dst){
	"use strict";
	return this.toString().split(src).join(dst);
};
$.fn.extend({
	caps: function(str){
		"use strict";
		return str.charAt(0).toUpperCase() + str.slice(1);
	},
  capitalize: function(){
		"use strict";
		return this.each(function() {
			var $field = $(this);
			$field.on('keyup change', function() {
				$field.val(function(i, old) {
					if (old.indexOf(' ') > -1) {
						var words = old.split(' ');
						for (i = 0; i < words.length; i++) {
							words[i] = $.fn.caps(words[i]);
						}
						return words.join(' ');
					} else {
						return $.fn.caps(old);
					}
				});
			});
		});
	},
  upperCase: function() {
    "use strict";
    $(this).css('text-transform', 'uppercase').bind('blur change', function(){
      this.value = this.value.toUpperCase();
    });
  },
	replaceSpace: function(){
    "use strict";
    $(this).bind('blur change', function(){
      this.value = this.value.str_replace(' ', '-');
    });
	},
});

$( document ).ready(function() {
	"use strict";
  $(init);
});
//window.onbeforeunload = function() {
  //alert(1);
        //return "Dude, are you sure you want to leave? Think of the kittens!";
        //window.location = SITE_URL_PROTOCOL+'/admin';
    //}

/* Go to Page pagination Starts*/
function goto_pageCall(page_name, inp_id){
  var goto_page = $("#"+inp_id).val();
  if(goto_page){
    const last = Array.from(
      document.querySelectorAll('.J-paginationjs-page')
    ).pop();
    if(Number(goto_page) <= Number(last.getAttribute("data-num"))){
    var container = document.querySelector("#"+page_name);
      var elem = container.querySelectorAll('[data-num="'+goto_page+'"]');
      if(elem.length > 0){
        elem[0].click();
      }else{
        var myDIV = $('<li class="paginationjs-page J-paginationjs-page disp_none" data-num="'+goto_page+'"><a href="">'+goto_page+'</a></li>');
        $(".paginationjs-pages ul").append(myDIV);
        myDIV.trigger('click');
        myDIV.remove();
      }
    }else{
      toastr.error("Plese enter valid page number.");
    }
  }
}

$(document).ready(function(){
  $('a.navlink').on('click', function(){ 
    console.log("test");
    $('a.navlink').removeClass("active");
    $(this).addClass("active");
  });
  //console.log('aut-data',localStorage.getItem("auth_data_lcms"));
  if(localStorage.getItem("auth_data_lcms") != null){
    var logo_image = getUserInfo().logo_image;
    $(".org_logo_image").attr("src", logo_image )
  }
});
/* Go to Page pagination Ends */    
function logoutSession(){
    localStorage.removeItem("auth_lcms");
    localStorage.removeItem("auth_type_lcms");
    localStorage.removeItem("auth_user_lcms");
    localStorage.removeItem("auth_data_lcms");
    localStorage.removeItem("system_rights");
    console.log('SITE_URL_PROTOCOL custom.js', SITE_URL_PROTOCOL+"login");
    window.location.replace(SITE_URL_PROTOCOL+"login");
}
function parseString(str) {
  var result=str.replace('"','&quot;');
  result=result.replace("'","&#39;");
  return result;
} 



function formatState (state) {
  if (!state.id) {
    return state.text;
  }
  var baseUrl = "/user/pages/images/flags";
  var $state = $(
    '<span>' + state.text + '</span>'
  );
  return $state;
};

var academic_year_options = [
  {"year":"2023-2024"},
  {"year":"2024-2025"},
  {"year":"2025-2026"},
  {"year":"2026-2027"},
  {"year":"2027-2028"},
  {"year":"2028-2029"},
  {"year":"2029-2030"},
  {"year":"2030-2031"},
  {"year":"2031-2032"},
  {"year":"2032-2033"},
  {"year":"2033-2034"},
  {"year":"2034-2035"},
  {"year":"2035-2036"},
  {"year":"2036-2037"},
  {"year":"2037-2038"},
  {"year":"2038-2039"},
  {"year":"2039-2040"},
  {"year":"2040-2041"},
  {"year":"2041-2042"},
  {"year":"2042-2043"},
  {"year":"2043-2044"},
  {"year":"2044-2045"},
  {"year":"2045-2046"},
  {"year":"2046-2047"},
  {"year":"2047-2048"},
  {"year":"2048-2049"}
];