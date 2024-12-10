const mobileMenu = document.querySelector(".mobile-menu");
const headerNav = document.querySelector(".header__nav");
const overlay = document.getElementById("overlay");
const headerBtns = document.querySelector(".header__btns");

mobileMenu.addEventListener("click", () => {
  headerNav.classList.toggle("open");
  const isOpen = headerNav.classList.contains("open");

  if (isOpen) {
    openSidebar();
    overlay.classList.add("active");
  } else {
    closeSidebar();
    overlay.classList.remove("active");
  }
});

overlay.addEventListener("click", () => {
  closeSidebar();
  headerNav.classList.remove("open");
  overlay.classList.remove("active");
});

const disableScroll = () => {
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
};

const enableScroll = () => {
  document.body.style.overflow = "auto";
  document.documentElement.style.overflow = "auto";
};

const openSidebar = () => {
  mobileMenu.classList.add("open");
  headerBtns.classList.add("active");
  disableScroll();
};

const closeSidebar = () => {
  mobileMenu.classList.remove("open");
  headerBtns.classList.remove("active");
  enableScroll();
};
