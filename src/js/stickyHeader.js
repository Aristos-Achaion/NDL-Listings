const header = document.querySelector(".header");

const checkHeaderPosition = () => {
  if (window.scrollY > 0) {
    header.classList.add("header--sticky");
  } else {
    header.classList.remove("header--sticky");
  }
};

window.addEventListener("load", checkHeaderPosition);
window.addEventListener("scroll", checkHeaderPosition);
