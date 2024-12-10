// Define the event handler function for accordion buttons
function handleAccordionClick(event) {
  const accBtn = event.currentTarget;
  accBtn.classList.toggle("active");
  accBtn.nextElementSibling.classList.toggle("active");
}

// Function to update event listeners based on screen width
function updateAccordionListeners() {
  const accordionBtns = document.querySelectorAll(
    ".property-filters__accordion-btn"
  );
  const mediaQuery = window.matchMedia("(min-width: 992px)");

  accordionBtns.forEach((accBtn) => {
    // Remove existing event listener to avoid duplicates
    accBtn.removeEventListener("click", handleAccordionClick);

    if (mediaQuery.matches) {
      // Screen width is 992px or wider, add event listener
      accBtn.addEventListener("click", handleAccordionClick);
    }
  });
}

// Initial check on page load
updateAccordionListeners();

// Listen for changes in screen width and update event listeners accordingly
window.addEventListener("resize", updateAccordionListeners);
