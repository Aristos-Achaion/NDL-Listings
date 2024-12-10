// Fetch the JSON data
fetch("http://localhost:8000/properties")
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    // Filter out completed bids
    const completedBid = data.filter(
      (property) => property.status !== "Completed"
    );

    const propertyListings = document.querySelector(".property-listings");

    // Limit the number of properties to 4
    const propertiesToShow = completedBid.slice(0, 4);

    propertiesToShow.forEach((property) => {
      // Create a div element  for the property
      const propertyCard = document.createElement("div");
      propertyCard.classList.add("property-listings__card");

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
  })
  .catch((error) => console.error("Error fetching data:", error));
