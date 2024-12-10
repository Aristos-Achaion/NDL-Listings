const propertiesPerPage = 6;
let currentPage = 1;
let properties = [];
let filteredProperties = [];
let searchedProperties = [];

const searchButton = document.querySelector(".search-block__search-btn");

const fetchProperties = async () => {
  try {
    const response = await fetch("http://localhost:8000/properties");
    properties = await response.json();
    filteredProperties = searchedProperties = properties;

    applyAllFilters();
  } catch (error) {
    console.error("Error fetching properties:", error);
  }
};

// Getting date from two months ago
const getFormattedDateTwoMonthsAgo = () => {
  const today = new Date();
  const twoMonthsAgo = new Date(today);
  twoMonthsAgo.setMonth(today.getMonth() - 2);

  // Format the date as "Month Day, Year"
  const options = { year: "numeric", month: "long", day: "numeric" };
  return twoMonthsAgo.toLocaleDateString("en-US", options);
};

// Sort Handler
const sortHandler = (properties) => {
  let sortedProperties = properties.slice();

  // currentPage = 1;
  const today = new Date();

  const option = document.querySelector(
    ".filter-sorting__btn span"
  ).textContent;

  switch (option) {
    case "default sorting":
      return sortedProperties;
    case "oldest":
      return sortedProperties.sort(
        (a, b) =>
          new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`)
      );

    case "low to high":
      return sortedProperties.sort((a, b) => a.price - b.price);

    case "high to low":
      return sortedProperties.sort((a, b) => b.price - a.price);

    case "ending soonest":
      return sortedProperties
        .filter((property) => property.status === "Live")
        .filter(
          (property) => new Date(`${property.date} ${property.time}`) >= today
        )
        .sort(
          (a, b) =>
            new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`)
        );
    case "recently started":
      const formattedTwoMonthsAgo = getFormattedDateTwoMonthsAgo();
      return sortedProperties
        .filter((property) => property.status === "Live")
        .filter((property) => {
          const propertyDate = new Date(`${property.date}`);
          const propertyEndDate = new Date(`${property.endDate}`);
          const twoMonthsAgoDate = new Date(formattedTwoMonthsAgo);
          return propertyDate > twoMonthsAgoDate && propertyEndDate >= today;
        })
        .sort(
          (a, b) =>
            new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`)
        );
    case "most active":
      return sortedProperties.sort((a, b) => b.activity - a.activity);
    default:
      return sortedProperties;
  }
};

// Applying Filters
const applySearch = (properties) => {
  const searchInput = document
    .querySelector(".property__search-input")
    .value.toLowerCase();
  return properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchInput) ||
      property.address.toLowerCase().includes(searchInput)
  );
};

const applyFilters = (properties) => {
  let filteredProperties = properties;

  // Get filter inputs
  const multifamily = document.getElementById("multifamily").checked;
  const family = document.getElementById("family").checked;
  const minSquareFeet = parseInt(
    document.getElementById("minSquareFeet").value
  );
  const maxSquareFeet = parseInt(
    document.getElementById("maxSquareFeet").value
  );
  const minAmount = parseInt(document.getElementById("minAmount").value);
  const maxAmount = parseInt(document.getElementById("maxAmount").value);
  const pricedUnder100k = document.getElementById("priced-under-100k").checked;
  const hotArea = document.getElementById("hot-area").checked;
  const vacantProperty = document.getElementById("vacant-property").checked;
  const occupiedProperty = document.getElementById("occupied-property").checked;

  // Filter by property type (Multifamily or 1-4 family)
  if (multifamily && !family) {
    filteredProperties = filteredProperties.filter(
      (property) => property.type === "Multifamily"
    );
  } else if (!multifamily && family) {
    filteredProperties = filteredProperties.filter(
      (property) => property.type === "1-4 family"
    );
  } else if (multifamily && family) {
  } else {
    filteredProperties = properties;
  }

  // Filter by square feet if values are valid
  if (
    !isNaN(minSquareFeet) &&
    !isNaN(maxSquareFeet) &&
    minSquareFeet < maxSquareFeet
  ) {
    filteredProperties = filteredProperties.filter(
      (property) =>
        property.squareFeet >= minSquareFeet &&
        property.squareFeet <= maxSquareFeet
    );
  } else if (!isNaN(minSquareFeet) && isNaN(maxSquareFeet)) {
    // Only minSquareFeet is provided
    filteredProperties = filteredProperties.filter(
      (property) => property.squareFeet >= minSquareFeet
    );
  } else if (isNaN(minSquareFeet) && !isNaN(maxSquareFeet)) {
    // Only maxSquareFeet is provided
    filteredProperties = filteredProperties.filter(
      (property) => property.squareFeet <= maxSquareFeet
    );
  }

  // Filter by amount of units if values are valid
  if (
    !isNaN(minAmount) &&
    !isNaN(maxAmount) &&
    minAmount < maxAmount &&
    minAmount !== 0
  ) {
    filteredProperties = filteredProperties.filter(
      (property) =>
        property.numberOfUnits >= minAmount &&
        property.numberOfUnits <= maxAmount
    );
  } else if (!isNaN(minAmount) && isNaN(maxAmount)) {
    // Only minSquareFeet is provided
    filteredProperties = filteredProperties.filter(
      (property) => property.numberOfUnits >= minAmount
    );
  } else if (isNaN(minAmount) && !isNaN(maxAmount)) {
    // Only maxSquareFeet is provided
    filteredProperties = filteredProperties.filter(
      (property) => property.numberOfUnits <= maxAmount
    );
  }

  // Filter by featured deals
  if (pricedUnder100k) {
    filteredProperties = filteredProperties.filter(
      (property) => property.price < 100000
    );
  }
  if (hotArea) {
    filteredProperties = filteredProperties.filter(
      (property) => property.hotArea === true
    );
  }
  if (vacantProperty) {
    filteredProperties = filteredProperties.filter(
      (property) => property.vacant === true
    );
  }
  if (occupiedProperty) {
    filteredProperties = filteredProperties.filter(
      (property) => property.occupied === true
    );
  }

  return filteredProperties;
};

const applyAllFilters = () => {
  currentPage = 1;

  // Start with the original properties array
  let updatedProperties = properties;

  // Apply search
  updatedProperties = applySearch(updatedProperties);

  // Apply filters
  updatedProperties = applyFilters(updatedProperties);
  // Apply sorting
  updatedProperties = sortHandler(updatedProperties);

  renderProperties(currentPage, updatedProperties);
};

// Displaying Properties
const renderProperties = (page, data) => {
  const propertyListings = document.querySelector(".property-cards");
  propertyListings.innerHTML = "";
  const noResultsMessage = document.querySelector(".no-results");
  const paginationHolder = document.querySelector(".pagination__holder");
  if (data.length === 0) {
    propertyListings.classList.add("inactive");
    noResultsMessage.classList.add("active");
    paginationHolder.classList.add("inactive");
  } else {
    propertyListings.classList.remove("inactive");
    noResultsMessage.classList.remove("active");
    paginationHolder.classList.remove("inactive");
    const startIndex = (page - 1) * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;

    const paginatedProperties = data.slice(startIndex, endIndex);

    paginatedProperties.forEach((property) => {
      // Create a div element  for the property
      const propertyCard = document.createElement("div");
      propertyCard.classList.add("property-listings__card");
      propertyCard.classList.add("grid");

      const handleDate = (status) => {
        if (status === "Live") {
          return "End date";
        } else if (status === "Completed") {
          return "Auction Finished";
        } else {
          return "Start date";
        }
      };

      const handleBid = (status) => {
        if (status === "Live") {
          return "Current";
        } else if (status === "Completed") {
          return "Winning";
        } else {
          return "Starting";
        }
      };

      const formattedPrice = property.price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      // Create the HTML template for the property
      propertyCard.innerHTML = `
        <div class="card__body">
                  <span class="property-listings__status--${property.status.toLowerCase()}"
                    >${property.status} Auction</span
                  >
                  <h3 class="property-listings__name">
                    ${property.name}
                  </h3>
                  <p class="property-listings__address">
                    ${property.address}
                  </p>
                  <ul class="property-listings__info">
                    <li>
                      <span class="property-listings__info-icon"
                        ><svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6 6L11.25 6M6 0.75L6 11.25M3.55 0.75H8.45C9.43009 0.75 9.92014 0.75 10.2945 0.940739C10.6238 1.10852 10.8915 1.37623 11.0593 1.70552C11.25 2.07986 11.25 2.56991 11.25 3.55V8.45C11.25 9.43009 11.25 9.92014 11.0593 10.2945C10.8915 10.6238 10.6238 10.8915 10.2945 11.0593C9.92014 11.25 9.43009 11.25 8.45 11.25H3.55C2.56991 11.25 2.07986 11.25 1.70552 11.0593C1.37623 10.8915 1.10852 10.6238 0.940739 10.2945C0.75 9.92014 0.75 9.43009 0.75 8.45V3.55C0.75 2.56991 0.75 2.07986 0.940739 1.70552C1.10852 1.37623 1.37623 1.10852 1.70552 0.940739C2.07986 0.75 2.56991 0.75 3.55 0.75Z"
                            stroke="#3E8028"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          /></svg></span
                      ><span>${
                        property.numberOfUnits > 1
                          ? property.numberOfUnits + " Units "
                          : property.numberOfUnits + " Unit "
                      }</span>
                    </li>
                    <li>
                      <span class="property-listings__info-icon"
                        ><svg
                          width="14"
                          height="12"
                          viewBox="0 0 14 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.33335 1.02286C10.1977 1.4524 10.7917 2.34433 10.7917 3.375C10.7917 4.40567 10.1977 5.2976 9.33335 5.72714M10.5 8.78039C11.3817 9.17936 12.1757 9.82958 12.8334 10.6667M1.16669 10.6667C2.30214 9.22151 3.84371 8.33333 5.54169 8.33333C7.23967 8.33333 8.78123 9.22151 9.91669 10.6667M8.16669 3.375C8.16669 4.82475 6.99143 6 5.54169 6C4.09194 6 2.91669 4.82475 2.91669 3.375C2.91669 1.92525 4.09194 0.75 5.54169 0.75C6.99143 0.75 8.16669 1.92525 8.16669 3.375Z"
                            stroke="#3E8028"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg> </span
                      ><span>${property.type}</span>
                    </li>
                    <li>
                      <span class="property-listings__info-icon"
                        ><svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.16667 4.83333L11.25 0.75M11.25 0.75H7.75M11.25 0.75V4.25M4.83333 7.16667L0.75 11.25M0.75 11.25H4.25M0.75 11.25L0.75 7.75"
                            stroke="#3E8028"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </span>
                      <span>${property.squareFeet} Sq. Ft</span>
                    </li>
                  </ul>
                  <div class="property-listings__image">
                    <img
                      src=${property.imageUrl}
                      alt="Property Image"
                    />
                  </div>
                  <div class="property-listings__date">
                    <span>${handleDate(property.status)}:</span>
                    <p>${property.date} at ${property.time} EST</p>
                  </div>
                </div>
                <div class="card__footer--${property.status.toLowerCase()}">
                  <p>${handleBid(
                    property.status
                  )} bid: <span>$${formattedPrice}</span></p>
                </div>
              </div>
        `;

      // Append the property card to the property listings container
      propertyListings.appendChild(propertyCard);
    });
    // const paginationHolder = document.createElement("div");
    // paginationHolder.classList.add("pagination__holder");

    renderPagination(data);
  }
};

// Displaying Pagination
const renderPagination = (properties) => {
  const svgHTML = `<svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1.5L6 6.5L11 1.5" stroke="#133051" stroke-width="1.5" stroke-linecap="round"
                            stroke-linejoin="round" />
                        </svg>`;
  const pagination = document.querySelector(".pagination__holder");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(properties.length / propertiesPerPage);

  if (totalPages <= 1) {
    return;
  }

  const prevButton = document.createElement("button");
  prevButton.classList.add("pagination-prev");
  prevButton.insertAdjacentHTML("afterbegin", svgHTML);
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderProperties(currentPage, properties);
    }
  });
  pagination.appendChild(prevButton);

  // Determine which pages to display
  let prevPage = currentPage - 1;
  let nextPage = currentPage + 1;

  if (totalPages <= 1) {
    prevPage = null;
    nextPage = null;
  } else if (currentPage === 1) {
    prevPage = null;
    nextPage = 2;
  } else if (currentPage === totalPages) {
    prevPage = totalPages - 1;
    nextPage = null;
  }

  // render page buttons
  if (prevPage) {
    const prevPageButton = document.createElement("button");
    prevPageButton.textContent = prevPage;
    prevPageButton.classList.add("pagination-button");
    prevPageButton.addEventListener("click", () => {
      currentPage = prevPage;
      renderProperties(currentPage, properties);
    });
    pagination.appendChild(prevPageButton);
  }

  const currentPageButton = document.createElement("button");
  currentPageButton.textContent = currentPage;
  currentPageButton.classList.add("pagination-button");
  currentPageButton.classList.add("current-page");
  pagination.appendChild(currentPageButton);

  if (nextPage) {
    const nextPageButton = document.createElement("button");
    nextPageButton.textContent = nextPage;
    nextPageButton.classList.add("pagination-button");
    nextPageButton.onclick = () => {
      currentPage = nextPage;
      renderProperties(currentPage, properties);
    };
    pagination.appendChild(nextPageButton);
  }

  const nextButton = document.createElement("button");
  nextButton.classList.add("pagination-next");
  nextButton.insertAdjacentHTML("afterbegin", svgHTML);
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderProperties(currentPage, properties);
    }
  });
  pagination.appendChild(nextButton);
};

// Function to restrict input to numeric values
const restrictToNumeric = (event) => {
  // Allow only numeric values (0-9)
  const key = event.key;

  // Check if the key pressed is not a number and not a control key (like backspace)
  if (
    !/^[0-9]$/.test(key) &&
    !["Backspace", "Tab", "ArrowLeft", "ArrowRight"].includes(key)
  ) {
    event.preventDefault(); // Prevent the default action of the key press
  }
};

const clearFilters = () => {
  document.querySelector(".property__search-input").value = "";
  document
    .querySelectorAll('.property-filters input[type="checkbox"]')
    .forEach((checkbox) => (checkbox.checked = false));
  document
    .querySelectorAll('.property-filters input[type="number"]')
    .forEach((input) => {
      input.value = "";
      input.classList.remove("error");
    });
  document
    .querySelectorAll(".error-notification")
    .forEach((errorMsg) => errorMsg.classList.remove("visible"));
  filteredProperties = properties;
  currentPage = 1;
  renderProperties(currentPage, properties);
};

document
  .querySelector(".property-filters__btn")
  .addEventListener("click", clearFilters);

document.querySelectorAll('input[type="checkbox"]').forEach((input) => {
  input.addEventListener("change", applyAllFilters);
});
document.querySelectorAll('input[type="number"]').forEach((input) => {
  input.addEventListener("keydown", () => {
    restrictToNumeric(event);
  });
});
document.querySelectorAll('input[type="number"]').forEach((input) => {
  input.addEventListener("input", () => {
    applyAllFilters();
  });
});

document.querySelectorAll(".filter-sorting__list li").forEach((item) => {
  item.addEventListener("click", applyAllFilters);
});

searchButton.addEventListener("click", applyAllFilters);
document
  .querySelector(".property__search-input")
  .addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      applyAllFilters();
    }
  });

// fetch and render properties on page load
fetchProperties();
