//Open Member Create Form
$(document).on("click", "#trigger-member-create-form", function () {
  if(processRights("Add/Edit Member") === false) {
    toastr.error(window.language.error_no_access);
    return false; 
  }
  getRolesOptions("#member-role");
  $("#member-email").val("");
  $("#member-fName").val("");
  $("#member-lName").val("");
  //$("#member-phoneNo").val("");
  $("#phone_number").val("");
  $("#member-id_edit").val("");
  $("#member-status").val("");
  $("#member-email").prop('disabled', false);
  $("#member-fName").prop('disabled', true);
  $("#member-lName").prop('disabled', true);
  $("#member-phoneNo").prop('disabled', true);
  $("#member-role").prop('selected', false);
  $("#member-role").prop('disabled', true);
  $("#member_type_name").text("Create Member");
  $("#save-member-create-form").text("Create");
  $("#member-create-form-container").css({ visibility: "visible", opacity: 1 });
});

//Cancel(Hide) Member Create Form
$(document).on("click", ".cancel-member-create-form", function () {
  resetFormValues("#member-create-form");
  resetFormErrors("#member-create-form");

  $("#member-create-form-container").css({ visibility: "hidden", opacity: 0 });
});

$(document).on("input", "#member-email", function () {
  resetFormErrors("#member-create-form");

  $("#member-fName").val("");
  $("#member-lName").val("");
  //$("#member-phoneNo").val("");
  $("#phone_number").val("");
  $("#member-role").val("");

  $("#member-fName").prop("disabled", true);
  $("#member-lName").prop("disabled", true);
  //$("#member-phoneNo").prop("disabled", true);
  $("#phone_number").prop("disabled", true);
  $("#member-role").prop("disabled", true);
});

$(document).on("change", "#member-email", function () {
  const el = $(`[name='email_id']`);
  const value = el.val();

  const hasEmailError = _validateMemberEmail(el, value, true);

  if (!hasEmailError) {
  
    //console.log("CHECKED");
    ajaxValidationMailID(value);

  }
});

//Create Form - Save Member
$(document).on("submit", "#member-create-form", function (e) {
  $("#member-email").prop('disabled', false);
  e.preventDefault();

  resetFormErrors("#member-create-form");

  const form = $(this);
  const formInputs = form.serializeArray();

  let formHasError = false;
  let status = 1;
  if($("#member_status").val()){
    status = $("#member_status").val();
  }
  let formData = {
    email_id: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    roles_name: "",
    status: status,
    mc_status: 0,
    image: "",
    region_code: "",

  };
  $.each(formInputs, function (index, fieldData) {
    console.log(fieldData.name);
    if (fieldData.name.endsWith("[]")) {
      let name = fieldData.name.substring(0, fieldData.name.length - 2);
      if (!(name in formData)) {
        formData[name] = [];
      }
      formData[name].push(fieldData.value);
    } else {
      formData[fieldData.name] = fieldData.value;
    }
  });
  var mobile_number = document.getElementById("phone_number");
  var field_name = mobile_number.getAttribute('name');
  if(mobile_number.value.trim().substring(0, 1) == "+"){
    var mobilenumberarr = mobile_number.value.trim().split(/\s(.+)/);
    formData["phone_number"] = mobilenumberarr[1];
    formData["region_code"] = mobilenumberarr[0];
  }else{
    var input = document.querySelector('#phone_number');
    var iti = window.intlTelInputGlobals.getInstance(input);
    var region_code = iti.getSelectedCountryData();
    formData["phone_number"] = mobile_number.value;
    formData["region_code"] = "+"+region_code.dialCode;
  }
$("#member-email").prop('disabled', true);
  //Validate field on submit
  for (const [fieldName, fieldValue] of Object.entries(formData)) {
    const fieldValidationStatus = validateFields(fieldName, fieldValue);
    formHasError = formHasError || fieldValidationStatus;
  }

  //If no field error - proceed submit
  if (!formHasError) {
    //SAVE TO SERVER
    var member_edit_id = $("#member-id_edit").val();
    var URL = API_BASE_URL + "/member/";
    var Method = "POST";
    var Type = "POST";
    if(member_edit_id != ""){
      URL = API_BASE_URL + "/member/"+member_edit_id+"/";
      Method = "PUT";
      Type = "PUT";
    }
    $.ajax({
      url: URL,
      method: Method,
      type: Type, // For jQuery < 1.9
      cache: false,
      contentType: false,
      processData: false,
      data: JSON.stringify(formData),
      headers: {
        "Authorization" : "Bearer " + getUserInfo().access_token,
        "Content-Type": "application/json"
      },
      success: function(response){
        //$("#member-fName, #member-lName, #member-phoneNo, #member-role").prop("disabled", true);
        $("#member-fName, #member-lName, #phone_number, #member-role").prop("disabled", true);
        if(Method == "POST"){
          toastr.success("New member record successfully saved!");
        }else{
          toastr.success("Member record successfully updated!");
        }
        if(response.id && response.id == getUserInfo().id){
          const auth = new Auth();
          auth.logOut();
        }
        $(".cancel-member-create-form").click();
        doSearchMember();
      },
      error: function(error) {
        //$("#member-fName, #member-lName, #member-phoneNo, #member-role").prop("disabled", false);
        $("#member-fName, #member-lName, #phone_number, #member-role").prop("disabled", false);
        toastr.error("Response Error: " + error.responseText);
      }
    });
  }
});

//Create Form - Validate Fields On Form Submit
function validateFields(fieldName, fieldValue) {
  let validationStatus = false;

  switch (fieldName) {
    case "email_id":
      var el = $(`[name='${fieldName}']`);
      validationStatus = _validateMemberEmail(el, fieldValue, true);
      break;
    case "first_name":
      var el = $(`[name='${fieldName}']`);
      validationStatus = _validateMemberFName(el, fieldValue);
      break;
    case "last_name":
      var el = $(`[name='${fieldName}']`);
      validationStatus = _validateMemberLName(el, fieldValue);
      break;
    case "phone_number":
      var el = $(`[name='${fieldName}']`);
      validationStatus = _validateMemberPhoneNo(el, fieldValue);
      break;
    case "roles_name":
      var el = $(`[name='${fieldName}']`);
      validationStatus = _validateMemberRole(el, fieldValue);
      break;
  }

  return validationStatus;
}

//Create Form - Validate Fields On Input Change
$(document).on("input", "#member-email", function (e) {
  const _this = $(this);
  const fieldValue = _this.val();

  _validateMemberEmail(_this, fieldValue, true);
});

$(document).on("input", "#member-fName", function (e) {
  const _this = $(this);
  const fieldValue = _this.val();

  _validateMemberFName(_this, fieldValue);
});

$(document).on("input", "#member-lName", function (e) {
  const _this = $(this);
  const fieldValue = _this.val();

  _validateMemberLName(_this, fieldValue);
});

/*$(document).on("input", "#member-phoneNo", function (e) {
  const _this = $(this);
  const fieldValue = _this.val();

  _validateMemberPhoneNo(_this, fieldValue);
});*/
$(document).on("input", "#phone_number", function (e) {
  const _this = $(this);
  const fieldValue = _this.val();

  _validateMemberPhoneNo(_this, fieldValue);
});

$(document).on("change", "#member-role", function (e) {
  const _this = $(this);
  const fieldValue = _this.val();

  _validateMemberRole(_this, fieldValue);
});

//Validation Helpers
function _validateMemberEmail(el, fieldValue, displayMsg = true) {
  let errorMsg;
  let hasError = false;

  if (displayMsg) {
    resetFieldError(el);
  }

  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  if (!fieldValue) {
    errorMsg = `Email is required`;
    hasError = true;
  } else if (fieldValue && !regex.test(fieldValue)) {
    errorMsg = `Please enter valid email`;
    hasError = true;
  } else {
    errorMsg = "";
    hasError = false;
  }

  if (hasError && displayMsg) {
    el.after(`<span class='field-error'>${errorMsg}</span>`);
  }

  return hasError;
}

function _validateMemberFName(el, fieldValue) {
  let errorMsg;
  let hasError = false;
  const maxLength = 64;

  resetFieldError(el);

  const regex = /^\s*$/;
  if (fieldValue && regex.test(fieldValue)) {
    errorMsg = `Blank space not allowed`;
    hasError = true;
  } else if (!fieldValue) {
    errorMsg = `First Name is required`;
    hasError = true;
  } else if (fieldValue.length > maxLength) {
    errorMsg = `First Name should not exceed ${maxLength} characters`;
    hasError = true;
  } else {
    errorMsg = "";
    hasError = false;
  }

  const emailEl = $(`[name='email_id']`);
  const emailValue = emailEl.val();
  const hasEmailError = _validateMemberEmail(emailEl, emailValue, false);

  if (hasError && !hasEmailError) {
    el.after(`<span class='field-error'>${errorMsg}</span>`);
  }

  return hasError;
}

function _validateMemberLName(el, fieldValue) {
  let errorMsg;
  let hasError = false;
  const maxLength = 64;

  resetFieldError(el);

  const regex = /^\s*$/;
  if (fieldValue && regex.test(fieldValue)) {
    errorMsg = `Blank space not allowed`;
    hasError = true;
  } else if (!fieldValue) {
    errorMsg = `Last Name is required`;
    hasError = true;
  } else if (fieldValue.length > maxLength) {
    errorMsg = `Last Name should not exceed ${maxLength} characters`;
    hasError = true;
  } else {
    errorMsg = "";
    hasError = false;
  }

  const emailEl = $(`[name='email_id']`);
  const emailValue = emailEl.val();
  const hasEmailError = _validateMemberEmail(emailEl, emailValue, false);

  if (hasError && !hasEmailError) {
    el.after(`<span class='field-error'>${errorMsg}</span>`);
  }

  return hasError;
}

function _validateMemberPhoneNo(el, fieldValue) {
  let errorMsg;
  let hasError = false;
  const minValue = 0;
  const maxValue = 9999999999;
  const min_length = 10;
  const max_length = 10;
  resetFieldError(el);

  const regex = /^\s*$/;
  if (fieldValue && regex.test(fieldValue)) {
    errorMsg = `Blank space not allowed`;
    hasError = true;
  } else if (!fieldValue) {
    errorMsg = `Phone No is required`;
    hasError = true;
  } else if (fieldValue && fieldValue.length > 10) {
    //errorMsg = `Phone No should not be less than ${minValue}`;
    errorMsg = `Enter a valid Phone No`;
    hasError = true;
  } else if (fieldValue && fieldValue.length < 10) {
    //errorMsg = `Phone No should not be greater than ${maxValue}`;
    errorMsg = `Enter a valid Phone No`;
    hasError = true;
  } else {
    errorMsg = "";
    hasError = false;
  }

  const emailEl = $(`[name='email_id']`);
  const emailValue = emailEl.val();
  const hasEmailError = _validateMemberEmail(emailEl, emailValue, false);

  if (hasError && !hasEmailError) {
    el.after(`<span class='field-error'>${errorMsg}</span>`);
  }

  return hasError;
}

function _validateMemberRole(el, fieldValue) {
  let errorMsg;
  let hasError = false;

  resetFieldError(el);

  if (!fieldValue) {
    errorMsg = `Role is required`;
    hasError = true;
  } else {
    errorMsg = "";
    hasError = false;
  }

  const emailEl = $(`[name='email_id']`);
  const emailValue = emailEl.val();
  const hasEmailError = _validateMemberEmail(emailEl, emailValue, false);

  if (hasError && !hasEmailError) {
    el.after(`<span class='field-error'>${errorMsg}</span>`);
  }

  return hasError;
}

function ajaxValidationMailID(mailID){
  //    //https://elearningadmin.zaigoinfotech.com/email_login/
  $.ajax({
    url: API_BASE_URL + "/email_login/",
    method: "POST",
    type: 'POST', // For jQuery < 1.9
    cache: false,
    contentType: false,
    processData: false,
    data: JSON.stringify({
      "email_id": mailID
    }),
    headers: {
      "Authorization" : "Bearer " + getUserInfo().access_token,
      "Content-Type": "application/json"
    },
    success: function(response){
      if(response.is_valid) {
        //$("#member-fName, #member-lName, #member-phoneNo, #member-role").val("");
        $("#member-fName, #member-lName, #phone_number, #member-role").val("");
        //$("#member-fName, #member-lName, #member-phoneNo, #member-role").prop("disabled", false);
        $("#member-fName, #member-lName, #phone_number, #member-role").prop("disabled", false);
        $("#member-fName").focus();
      } else {
        //$("#member-fName, #member-lName, #member-phoneNo, #member-role").prop("disabled", true);
        $("#member-fName, #member-lName, #phone_number, #member-role").prop("disabled", true);
        toastr.error("Response: record already exisit!" );
      }
    },
    error: function(error) {
      //$("#member-fName, #member-lName, #member-phoneNo, #member-role").prop("disabled", true);
      $("#member-fName, #member-lName, #phone_number, #member-role").prop("disabled", true);
      toastr.error("Response: record already exisit!" );
    }
  });
}