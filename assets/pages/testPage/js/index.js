function getTestPageData() {
  fetch("https://jsonplaceholder.typicode.com/todos/1")
    .then((response) => response.json())
    .then((json) => {
      document.getElementById("card-body").innerHTML =
        "Test Page " + json.title;
    });
}
