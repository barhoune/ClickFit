$(document).ready(function () {
  $.ajax({
    url: "http://numbersapi.com/1/30/date?json",
    method: "GET",
    success: function (data) {
      $("#number-api").text(data.text);
      const chipFields = ["year", "number"];
      let chipsHtml = "";
      //TODO: Change btn classes when applying the new styles
      chipFields.forEach(field => {
        switch (field) {
          case "year":
            if (data.year)
              chipsHtml += `<span class="badge bg-primary me-1">Year: ${data.year}</span>`;
            break;
          case "number":
            if (data.number)
              chipsHtml += `<span class="badge bg-primary me-1">Number: ${data.number}</span>`;
            break;
          default:
            break;
        }
      });
      $("#number-api-chips").html(chipsHtml);
    },
    error: function () {
      return;
    },
  });
});
