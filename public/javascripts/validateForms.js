(function () {
  "use strict";
  // console.log("validate form script indcluded");

  const forms = document.querySelectorAll(".validated-form");

  Array.from(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();
