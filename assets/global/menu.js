/*
NOTE: 
1. Add "data-n-linkto" to the element which we need to load page/screen withoutout browser refresh.
2. Add menu name, url, html template & callback in "assets\global\menuSchema.js" file.
*/

const adminBaseName = ""; //admin folder name

document.addEventListener("click", function (e) {
  if (e.target && e.target.dataset.nLinkto) {
    e.preventDefault();
    const linkTo = e.target.dataset.nLinkto;
    const queryParams = getPageQueryParams(e.target.dataset);
    getPage(linkTo, queryParams);
  }
});

const getPage = (page, queryParams="", accessingViaBrowserBack = false) => {
  let currentMenuSchemaTemplate = "";
  let currentMenuSchemaCallback;

  if (menuSchema.hasOwnProperty(page)) {
    const currentMenuSchema = menuSchema?.[page];
    currentMenuSchemaTemplate = currentMenuSchema?.template;
    currentMenuSchemaCallback = currentMenuSchema?.callback;
    currentMenuSchemaAppendTo = currentMenuSchema?.appendTo;
  } else {
    console.error(`Nano JS: Menu "${page}" is not available on menuSchema`);
  }

  if(!accessingViaBrowserBack){
    //if page is accessed by clicking menu 
    //if page is not accessed by clicking browser back button
    const pageUrl = menuSchema?.[page]?.url;
    if(pageUrl){
      window.history.pushState({}, "",  pageUrl + queryParams);
    } else {
      //console.error(`Nano JS: URL not added for "${page}" menu in menuSchema`);
    }
  }

  if (currentMenuSchemaTemplate) {
    loadPageTemplate(
      currentMenuSchemaTemplate,
      currentMenuSchemaCallback,
      currentMenuSchemaAppendTo,
      queryParams
    );
  } else {
    console.error(
      `Nano JS: Template not added for "${page}" menu in menuSchema`
    );
  }
};

const loadPageTemplate = (
  template,
  callback,
  appendTo = "[data-n-dynamic-element='main']",
  queryParams
) => {
  fetch(`${SITE_URL}${template}`)
    .then((data) => data.text())
    .then((html) => {
      document.querySelector(appendTo).innerHTML = html;
    })
    .then(function (html) {
      var scripts = document.querySelector(appendTo).querySelectorAll("script");

      for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].innerText) {
          eval(scripts[i].innerText);
        } else {
          fetch(scripts[i].src).then(function (data) {
            data.text().then(function (r) {
              eval(r);
            });
          });
        }
        // To not repeat the element
        scripts[i].parentNode.removeChild(scripts[i]);
      }
    })
    .then(() => {
      let queryParamDetails = {};
      if(queryParams){
        const queryParamData = queryParams.split("?")[1];
        const queryParamSet = queryParamData.split("&");
        queryParamSet.forEach(param => {
          const keyValue = param.split("=");
          const key = keyValue[0];
          const value = keyValue[1];
          queryParamDetails = {...queryParamDetails, [key] : value};
        });
      } 
      //API callback
      callback && callback(queryParamDetails);
    })
    .catch(function (error) {
      console.log("Nano JS: Page template loading failed", error);
    });
};

window.addEventListener('popstate', function(event){
  const pageURLAttributes = getPageURLAndQueryParams();
  const pageName  = getPageNameByURL(pageURLAttributes.url);

  if(pageName){
    //if the url exists on menuSchema render the page
    getPage(pageName, pageURLAttributes.queryParams, true);
  }
})

const getPageURLAndQueryParams = () => {
  let url = "";
  let queryParams = "";
  const pageURL = location.href.split(SITE_URL)[1];

  if(pageURL.includes("?")){
    slugQuery = pageURL.split("?");
    url = slugQuery[0];
    queryParams = "?" + slugQuery[1];
  }else{
    url = pageURL;
  }

  return {url: url, queryParams: queryParams};
}

const getPageNameByURL = (url) => {
  console.log(url);
  //here key contains menu name & value contains template name & url
  for(const [key, value] of Object.entries(menuSchema)){
    if(value.url === url){
      return key;
    }
  }

  return "";
}

const getPageQueryParams = (dataset) => {
  let queryParams = "";
  if(dataset){
    const allQueryParamKey = Object.keys(dataset);
    const requiredQueryParamKey = allQueryParamKey.filter(param => {
      return param.includes("nUrl");
    });
    if(requiredQueryParamKey.length > 0){
      //has url query params
      requiredQueryParamKey.forEach((param , i) => {
        const queryParamValue = dataset[param];
        const queryParamKey = param.split("nUrl")[1].toLowerCase();
        if(i === 0){
          queryParams += "?" + queryParamKey + "=" + queryParamValue;
        }else{
          queryParams += "&" + queryParamKey + "=" + queryParamValue;
        }
      });
    }
  }

  return queryParams;
}
