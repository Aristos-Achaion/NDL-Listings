const sortingIcon = document.querySelector(".filter-sorting__icon");
const sortingBtn = document.querySelector(".filter-sorting__btn");
const sortingList = document.querySelector(".filter-sorting__list");
const sortingListItems = document.querySelectorAll(".list-item");

// activate/deactivate dropdown list
sortingBtn.addEventListener("click", () => {
  sortingIcon.classList.toggle("active-dropdown");
  sortingList.classList.toggle("active-dropdown");
});

// Choosing an option from a dropdown list
sortingListItems.forEach((listItem) => {
  listItem.addEventListener("click", () => {
    sortingBtn.querySelector("span").textContent =
      listItem.querySelector("span").textContent;
    sortingIcon.classList.remove("active-dropdown");
    sortingList.classList.remove("active-dropdown");
  });
});
