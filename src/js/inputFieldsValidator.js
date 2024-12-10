const minSquareFeetInput = document.getElementById("minSquareFeet");
const maxSquareFeetInput = document.getElementById("maxSquareFeet");
const errorMsgSquareFeet = document.getElementById("errorMsgSquareFeet");
const minAmountInput = document.getElementById("minAmount");
const maxAmountInput = document.getElementById("maxAmount");
const errorMsgAmount = document.getElementById("errorMsgAmount");

// Input fields validation

const checkValues = (minInput, maxInput, errorMessage) => {
  const minValue = parseFloat(minInput.value);
  const maxValue = parseFloat(maxInput.value);

  if (!isNaN(minValue) && !isNaN(maxValue) && maxValue <= minValue) {
    errorMessage.classList.add("visible");
    minInput.classList.add("error");
    maxInput.classList.add("error");
  } else {
    errorMessage.classList.remove("visible");
    minInput.classList.remove("error");
    maxInput.classList.remove("error");
  }
};

const addInputListeners = (minInput, maxInput, errorMessage) => {
  minInput.addEventListener("input", () => {
    checkValues(minInput, maxInput, errorMessage);
  });

  maxInput.addEventListener("input", () => {
    checkValues(minInput, maxInput, errorMessage);
  });
};

addInputListeners(minSquareFeetInput, maxSquareFeetInput, errorMsgSquareFeet);
addInputListeners(minAmountInput, maxAmountInput, errorMsgAmount);
