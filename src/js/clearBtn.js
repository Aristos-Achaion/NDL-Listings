const clearBtn = document.querySelector(".property-filters__btn");
const propertyFiltersDiv = document.querySelector(".property-filters");

clearBtn.addEventListener("click", () => {
  propertyFiltersDiv
    .querySelectorAll('input[type="number"]')
    .forEach((input) => {
      input.value = "";
    });

  propertyFiltersDiv
    .querySelectorAll('input[type="checkbox"]')
    .forEach((input) => {
      input.checked = false;
    });
});
