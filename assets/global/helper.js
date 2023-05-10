function resetFieldError(target) {
  //error will be added as a sibling to the target
  const hasError = target.siblings(".field-error");
  if (hasError) {
    target.siblings().remove();
  }
}

function resetFormErrors(target) {
  $(`#app-admin ${target} .field-error`).remove();
}

function resetFormValues(target) {
  $(`#app-admin ${target}`).trigger("reset");
}
