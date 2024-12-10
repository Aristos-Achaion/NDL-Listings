const filterIcon = document.querySelector(".filter__mobile");
const popupCloseIcon = document.querySelector(".popup__close");
const filterOverlay = document.querySelector(".property-filters-overlay");
const filterSearchBtn = document.querySelector(".property-filters__search-btn");

function openPopup() {
  document.querySelector(".property-filters").classList.add("open");
  popupCloseIcon.classList.add("open");
  filterSearchBtn.classList.add("open");
  disableScroll();
}

function closePopup() {
  document.querySelector(".property-filters").classList.remove("open");
  popupCloseIcon.classList.remove("open");
  filterSearchBtn.classList.remove("open");
  enableScroll();
}

filterIcon.addEventListener("click", openPopup);
popupCloseIcon.addEventListener("click", closePopup);
filterOverlay.addEventListener("click", closePopup);
filterSearchBtn.addEventListener("click", closePopup);
