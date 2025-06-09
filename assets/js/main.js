let errorBg = "rgba(232, 76, 76, 0.9)";
let successBg = "rgba(76, 232, 157, 0.9)";
function showNotification(notifyText, bgColor, fgColor) {
  $.toast({
    text: notifyText,
    showHideTransition: "fade",
    bgColor: bgColor,
    textColor: fgColor,
    hideAfter: false,
    stack: 5,
    textAlign: "left",
    position: "top-right",
  });
}

$(document).ready(function () {
  const errorMsg = "An unnexpected error has occured, please try again later";

  $.ajax({
    url: "http://numbersapi.com/1/30/date?json",
    method: "GET",
    success: function (data) {
      showNotification(data.text, "rgba(255, 255, 255, 0.85)", "#2e2e2e");
      $("#number-api").text(data.text);
      const chipFields = ["year", "number"];
      let chipsHtml = "";
      chipFields.forEach((field) => {
        switch (field) {
          case "year":
            if (data.year)
              chipsHtml += `<span class="chip-single">Year: ${data.year}</span>`;
            break;
          case "number":
            if (data.number)
              chipsHtml += `<span class="chip-single">Number: ${data.number}</span>`;
            break;
          default:
            break;
        }
      });
      $("#number-api-chips").html(chipsHtml);
    },
    error: function () {
      $("#number-api").text(errorMsg);
      showNotification(errorMsg, "rgba(232, 76, 76, 0.9)", "#f0f0f0");
    },
  });
  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight)
    );
  }

  function animateOnScroll() {
    $(".fade-in-up").each(function () {
      if (isInViewport(this)) {
        $(this).addClass("animated");
      }
    });
  }

  animateOnScroll();
  $(window).on("scroll resize", animateOnScroll);

  function animateCardOnScroll() {
    $(".animate-on-scroll").each(function (index) {
      const el = $(this);
      const offsetTop = el.offset().top;
      const scrollTop = $(window).scrollTop();
      const windowHeight = $(window).height();

      if (scrollTop + windowHeight > offsetTop + 50) {
        setTimeout(() => {
          el.addClass("visible");
        }, index * 600);
      }
    });
  }

  $(window).on("scroll", animateCardOnScroll);
  animateCardOnScroll();
});

$(function () {
  const uploadArea = $("#upload-area");
  const fileInput = $("#file-input");

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
  fileInput.on("click", function (e) {
    e.stopPropagation();
  });
  fileInput.on("change", function () {
    if (this.files.length > 0) {
      uploadFile(this.files[0]);
    }
  });

  function uploadFile(file) {
    if (!file.type.startsWith("image/")) {
      showNotification("Please upload a valid image file.", errorBg, "#fff");
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
        showNotification(res.message, successBg, "#fff");
      },
      error: function () {
        showNotification("Upload failed", errorBg, "#fff");
      },
    });
  }
});

$(function () {
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 10) {
      $("nav.navbar").addClass("scrolled");
    } else {
      $("nav.navbar").removeClass("scrolled");
    }
  });
});
