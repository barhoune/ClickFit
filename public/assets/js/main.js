const ClickFit = (() => {
  const defaults = {
    apiUrl: "https://geek-jokes.sameerkumar.website/api?format=json",
    apiDelay: 200,
    errorMsg: "An unexpected error has occurred, please try again later",
    colors: {
      errorBg: "rgba(232, 76, 76, 0.9)",
      successBg: "rgba(76, 232, 157, 0.9)",
      notifyBg: "rgba(255, 255, 255, 0.85)",
      notifyFg: "#2e2e2e",
    },
    chipFields: ["year", "number"],
    selectors: {
      numberApi: "#number-api",
      numberApiChips: "#number-api-chips",
      uploadArea: "#upload-area",
      fileInput: "#file-input",
      fadeInUp: ".fade-in-up",
      animateOnScroll: ".animate-on-scroll",
      navbar: "nav.navbar",
    },
    animation: {
      cardStagger: 350,
      cardOffset: 50,
    },
  };

  const utils = {
    nowYear: () => new Date().getFullYear(),
    dayNumber: () => new Date().getDate(),
    dayShort: () => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()],
    isImageFile: (file) => file && file.type && file.type.startsWith("image/"),
    throttle(fn, wait = 100) {
      let last = 0;
      return function (...args) {
        const now = Date.now();
        if (now - last >= wait) {
          last = now;
          fn.apply(this, args);
        }
      };
    },
    debounce(fn, wait = 200) {
      let t;
      return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
      };
    },
    safeText: (s) => (s == null ? "" : String(s)),
  };

  const Notifier = (opts) => {
    const cfg = opts;
    function show(text, bg, fg, options = {}) {
      $.toast(
        Object.assign(
          {
            text,
            showHideTransition: "fade",
            bgColor: bg,
            textColor: fg,
            hideAfter: false,
            stack: 5,
            textAlign: "left",
            position: "top-right",
          },
          options
        )
      );
    }
    return {
      error: (text) => show(text, cfg.colors.errorBg, "#fff"),
      success: (text) => show(text, cfg.colors.successBg, "#fff"),
      neutral: (text) => show(text, cfg.colors.notifyBg, cfg.colors.notifyFg),
    };
  };

  const ApiClient = (opts) => {
    const cfg = opts;
    function fetchJoke() {
      return $.ajax({
        url: cfg.apiUrl,
        method: "GET",
        dataType: "json",
      });
    }
    return { fetchJoke };
  };

  const Chips = (opts) => {
    const { chipFields, selectors } = opts;
    function buildChips(data = {}) {
      let html = "";
      chipFields.forEach((field) => {
        switch (field) {
          case "year":
            html += `<span class="chip-single">Year: ${utils.safeText(data.year ?? utils.nowYear())}</span>`;
            break;
          case "number":
            html += `<span class="chip-single">Day: ${utils.safeText(data.number ?? `${utils.dayNumber()} (${utils.dayShort()})`)}</span>`;
            break;
          default:
            break;
        }
      });
      return html;
    }
    function render($target, data) {
      $target.html(buildChips(data));
    }
    return { render, buildChips };
  };

  const Animations = (opts) => {
    const { selectors, animation } = opts;
    function isInViewport(el) {
      const rect = el.getBoundingClientRect();
      return rect.top <= (window.innerHeight || document.documentElement.clientHeight);
    }
    function fadeInUpHandler() {
      $(selectors.fadeInUp).each(function () {
        if (isInViewport(this)) $(this).addClass("animated");
      });
    }
    function cardStaggerHandler() {
      $(selectors.animateOnScroll).each(function (index) {
        const el = $(this);
        const offsetTop = el.offset().top;
        const scrollTop = $(window).scrollTop();
        const windowHeight = $(window).height();
        if (scrollTop + windowHeight > offsetTop + animation.cardOffset) {
          setTimeout(() => el.addClass("visible"), index * animation.cardStagger);
        }
      });
    }
    return {
      bind() {
        const tFade = utils.throttle(fadeInUpHandler, 150);
        const tCard = utils.throttle(cardStaggerHandler, 150);
        $(window).on("scroll resize", tFade);
        $(window).on("scroll", tCard);
        fadeInUpHandler();
        cardStaggerHandler();
      },
    };
  };

  const Uploader = (opts) => {
    const { selectors } = opts;
    const $uploadArea = $(selectors.uploadArea);
    const $fileInput = $(selectors.fileInput);

    function bind(notifier) {
      if (!$uploadArea.length || !$fileInput.length) return;

      $uploadArea.on("dragover", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $uploadArea.addClass("dragover");
      });

      $uploadArea.on("dragleave", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $uploadArea.removeClass("dragover");
      });

      $uploadArea.on("drop", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $uploadArea.removeClass("dragover");
        const files = e.originalEvent.dataTransfer.files;
        if (files.length > 0) uploadFile(files[0], notifier);
      });

      $uploadArea.on("click", () => $fileInput.trigger("click"));
      $fileInput.on("click", (e) => e.stopPropagation());
      $fileInput.on("change", function () {
        if (this.files && this.files[0]) uploadFile(this.files[0], notifier);
      });
    }

    function uploadFile(file, notifier) {
      if (!utils.isImageFile(file)) {
        return notifier.error("Please upload a valid image file.");
      }

      const formData = new FormData();
      formData.append("image", file);

      $.ajax({
        url: "/upload-image",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: (res) => {
          notifier.success(res?.message ?? "Upload successful");
        },
        error: () => {
          notifier.error("Upload failed");
        },
      });
    }

    return { bind };
  };

  const Navbar = (opts) => {
    const { selectors } = opts;
    function bind() {
      const $nav = $(selectors.navbar);
      if (!$nav.length) return;
      $(window).on(
        "scroll",
        utils.throttle(() => {
          if ($(window).scrollTop() > 10) $nav.addClass("scrolled");
          else $nav.removeClass("scrolled");
        }, 100)
      );
    }
    return { bind };
  };

  function createInstance(custom = {}) {
    const cfg = $.extend(true, {}, defaults, custom);
    const notifier = Notifier(cfg);
    const api = ApiClient(cfg);
    const chips = Chips({ chipFields: cfg.chipFields, selectors: cfg.selectors });
    const animations = Animations(cfg);
    const uploader = Uploader({ selectors: cfg.selectors });
    const navbar = Navbar({ selectors: cfg.selectors });

    function fetchAndRender() {
      setTimeout(() => {
        api
          .fetchJoke()
          .done((data) => {
            notifier.neutral(data.joke);
            $(cfg.selectors.numberApi).text(data.joke);
            chips.render($(cfg.selectors.numberApiChips), data);
          })
          .fail(() => {
            $(cfg.selectors.numberApi).text(cfg.errorMsg);
            notifier.error(cfg.errorMsg);
            chips.render($(cfg.selectors.numberApiChips), {});
          });
      }, cfg.apiDelay);
    }

    function init() {
      $(document).ready(() => {
        fetchAndRender();
        animations.bind();
        uploader.bind(notifier);
        navbar.bind();
      });
    }

    return { init, cfg };
  }

  return {
    create: createInstance,
  };
})();

const app = ClickFit.create();
app.init();
