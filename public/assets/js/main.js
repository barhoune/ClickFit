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

$(function () {
  const uploadArea = $("#upload-area");
  const fileInput = $("#file-input");
  const status = $("#upload-status");

  uploadArea.on("dragover", function (e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.addClass("dragover");
  });

  uploadArea.on("dragleave", function (e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.removeClass("dragover");
  });

  uploadArea.on("drop", function (e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.removeClass("dragover");
    const files = e.originalEvent.dataTransfer.files;
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  });

  uploadArea.on("click", () => fileInput.trigger("click"));

  fileInput.on("change", function () {
    if (this.files.length > 0) {
      uploadFile(this.files[0]);
    }
  });

  function uploadFile(file) {
    if (!file.type.startsWith("image/")) {
      status.text("Please upload a valid image file.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    $.ajax({
      url: "/upload-image",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (res) {
        status.text(res.message);
      },
      error: function () {
        return;
      },
    });
  }
});
