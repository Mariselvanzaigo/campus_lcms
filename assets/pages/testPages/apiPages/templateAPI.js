const getApiPage1Data = async (queryParams) => {
  console.log(queryParams);
  try {
    const apiResponse = await fetch(
      "https://jsonplaceholder.typicode.com/todos/3"
    );

    if (!apiResponse.ok) {
      const message = `An error has occured: ${apiResponse.status}`;
      throw new Error(message);
    }

    const response = await apiResponse.json();

    document.querySelector(".aTP1_dy_content").innerHTML = response.title;
  } catch (err) {
    //console.log(err);
  } finally {
    document.querySelector(".aTP1_loader").style.display = "none";
    document.querySelector(".aTP1_content").style.display = "block";
  }
};
