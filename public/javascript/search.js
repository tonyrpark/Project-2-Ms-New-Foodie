// NUM_RESPONSES goes into the For-Loop and dictates # results
const NUM_RESPONSES = 5;

$("#search-food").on("click", function (event) {
  event.preventDefault();

  const zipcode = $("#search-input").val().trim();

  const settings = {
    async: true,
    crossDomain: true,
    url: `https://us-restaurant-menus.p.rapidapi.com/restaurants/zip_code/${zipcode}?page=1`,
    method: "GET",
    headers: {
      "x-rapidapi-key": "980fbf3eb4msh7995ecf778f3f83p1f9cdejsn73478224c087",
      "x-rapidapi-host": "us-restaurant-menus.p.rapidapi.com",
    },
  };
  $.ajax(settings).done(function (response) {
    console.log(response);
    for (let i = 0; i < NUM_RESPONSES; i++) {
      let name = response.result.data[i].restaurant_name;
      let address = response.result.data[i].address.formatted;
      let cuisine = response.result.data[i].cuisines[0];

      let resultCard = $(`
      <div class="col-lg-6 mb-6">
      <div class="card h-100">
        <div class="card-body text-left box restaurantCard" id="card-${i}">
      <h2> ${name} </h2>
      <div> Cuisine: ${cuisine}</div>
      <div> Address: ${address}</div>
        </div>
      </div>
      </div>
      `);

      const resultDiv = $("#results");
      resultDiv.append(resultCard);
    }
  });
});
