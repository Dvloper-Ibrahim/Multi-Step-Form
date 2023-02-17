// Required Data For Every Step.
const pageName = location.href.slice(location.href.lastIndexOf("/") + 1, -5);
const steps = document.querySelectorAll(".steps li");
const nextButton = document.querySelector(".buttons .next");
const backButton = document.querySelector(".buttons .back");

// Required Data For Step 1
const personalInfo = document.querySelectorAll(".step1-input input");

// Required Data For Step 2
const plans = document.querySelectorAll(".step-details .plans input");
const planTypeSetter = document.querySelector(".step-details .plan-type input");
const plansPrices = document.querySelectorAll(".plans .price");
const plansOffers = document.querySelectorAll(".plans label span:last-child");

// Required Data For Step 3
const addOnsChoices = document.querySelectorAll(".add-ons input");
const addOnsPrices = document.querySelectorAll(".add-ons .price");
let addOns = JSON.parse(sessionStorage.getItem("add-ons")) || [];

// Required Data For Step 4
const formSummary = document.querySelector(".summary .details");
const totalCost = document.querySelector(".summary .total-cost");
const thanksSection = document.querySelector(".thank-you");

// Adding 'active' Class To The Current Step When Loaded.
window.addEventListener("load", function () {
  for (let i = 0, len = steps.length; i < len; i++) {
    let isDesiredStep =
      steps[i].querySelector("p").innerHTML.replace(" ", "-").toLowerCase() ===
      pageName;
    if (pageName === "") {
      steps[i].classList.toggle("active");
      break;
    }
    if (isDesiredStep) {
      steps[i].classList.toggle("active");
      backButton.addEventListener("click", goBackward);
      break;
    }
  }
});

/*
  Adding Some Manipulations, Event Listeners and Getting Data From sessionStorage To
  Some Elements In The Current Step When Loaded.
*/
if (pageName === "") {
  personalInfo.forEach((input) => {
    if (input.type === "text") input.oninput = checkName;
    else if (input.type === "email") input.oninput = checkEmail;
    else if (input.type === "tel") input.oninput = checkPhone;
    input.onblur = function () {
      input.style.borderColor = "#ccc";
    };
    input.value = sessionStorage.getItem(input.id);
  });
} else if (pageName === "select-plan") {
  sessionStorage.getItem("plan-type") === "Yearly"
    ? (planTypeSetter.checked = true)
    : (planTypeSetter.checked = false);
  if (planTypeSetter.checked === true) {
    plansPrices.forEach((e) => {
      e.innerHTML = `$${parseInt(e.innerHTML.slice(1)) * 10}/yr`;
    });
    plansOffers.forEach((e) => {
      e.style.display = "inline";
    });
  }
  plans.forEach((e) => {
    e.checked = sessionStorage.getItem("plan") === e.value;
  });
  planTypeSetter.addEventListener("click", handlePlanType);
} else if (pageName === "add-ons") {
  setAddOnsFrom(addOnsChoices);
  if (sessionStorage.getItem("plan-type") === "Yearly") {
    addOnsPrices.forEach((e) => {
      e.innerHTML = `+$${parseInt(e.innerHTML.slice(2)) * 10}/yr`;
    });
  }
  addOns.forEach((e) => {
    addOnsChoices[e.id - 1].checked = true;
    e.price = addOnsPrices[e.id - 1].innerHTML;
  });
  sessionStorage.setItem("add-ons", JSON.stringify(addOns));
} else if (pageName === "summary") {
  if (!sessionStorage.getItem("total-cost")) {
    document.querySelector(".step-details").innerHTML = "";
    document.querySelector(".step-details").style.justifyContent = "center";
    thanksSection.style.display = "block";
    document.querySelector(".step-details").appendChild(thanksSection);
    nextButton.parentElement.style.display = "none";
  } else setFormSummary();
}

// ========================================================================

// Ensuring That The User Input A Valid Data For (name - email - phone).
function checkName() {
  let { value } = personalInfo[0];
  let pattern = /\b\d+\w+/gi;
  if (value === "") {
    personalInfo[0].nextElementSibling.innerHTML = "This field is required";
    personalInfo[0].nextElementSibling.style.display = "block";
    personalInfo[0].style.borderColor = "#e40b28";
    return false;
  } else if (pattern.test(value)) {
    personalInfo[0].nextElementSibling.innerHTML = "Don't start with a number";
    personalInfo[0].nextElementSibling.style.display = "block";
    personalInfo[0].style.borderColor = "#e40b28";
    return false;
  } else {
    personalInfo[0].nextElementSibling.style.display = "none";
    personalInfo[0].style.borderColor = "#5349a9";
    return true;
  }
}
function checkEmail() {
  let { value } = personalInfo[1];
  let pattern = /\w+@\w+\.\w+/gi;
  if (value === "") {
    personalInfo[1].nextElementSibling.innerHTML = "This field is required";
    personalInfo[1].nextElementSibling.style.display = "block";
    personalInfo[1].style.borderColor = "#e40b28";
    return false;
  } else if (!pattern.test(value)) {
    personalInfo[1].nextElementSibling.innerHTML = "Invalid email";
    personalInfo[1].nextElementSibling.style.display = "block";
    personalInfo[1].style.borderColor = "#e40b28";
    return false;
  } else {
    personalInfo[1].nextElementSibling.style.display = "none";
    personalInfo[1].style.borderColor = "#5349a9";
    return true;
  }
}
function checkPhone() {
  let { value } = personalInfo[2];
  let pattern = /\+\d{10}/gi;
  if (value === "") {
    personalInfo[2].nextElementSibling.innerHTML = "This field is required";
    personalInfo[2].nextElementSibling.style.display = "block";
    personalInfo[2].style.borderColor = "#e40b28";
    return false;
  } else if (!pattern.test(value)) {
    personalInfo[2].nextElementSibling.innerHTML = "Invalid phone number";
    personalInfo[2].nextElementSibling.style.display = "block";
    personalInfo[2].style.borderColor = "#e40b28";
    return false;
  } else {
    personalInfo[2].nextElementSibling.style.display = "none";
    personalInfo[2].style.borderColor = "#5349a9";
    return true;
  }
}

// ========================================================================

// Ensuring That The User Chose A Plan.
function isPlanSelected() {
  let c = 0;
  plans.forEach((e) => {
    if (e.checked) {
      c++;
    }
  });
  if (c === 1) return true;
  else return false;
}

// Clarifying Prices Of Monthly Or Yearly Plan.
function handlePlanType(event) {
  if (event.target.checked === true) {
    plansPrices.forEach((e) => {
      e.innerHTML = `$${parseInt(e.innerHTML.slice(1)) * 10}/yr`;
    });
    plansOffers.forEach((e) => {
      e.style.display = "inline";
    });
  } else {
    plansPrices.forEach((e) => {
      e.innerHTML = `$${parseInt(e.innerHTML.slice(1)) / 10}/mo`;
    });
    plansOffers.forEach((e) => {
      e.style.display = "none";
    });
  }
}

// Setting Plan Info To The SessionStorage.
function setPlanFrom(plans) {
  plans.forEach((e) => {
    if (e.checked) {
      sessionStorage.setItem("plan", e.value);
      sessionStorage.setItem(
        "plan-price",
        e.nextElementSibling.querySelector(".price").innerHTML
      );
    }
  });
  planTypeSetter.checked
    ? sessionStorage.setItem("plan-type", "Yearly")
    : sessionStorage.setItem("plan-type", "Monthly");
}

// ========================================================================

// Preparing Add-ons Info So That It Can Be Stored In The SessionStorage.
function setAddOnsFrom(addOnsChoices) {
  addOnsChoices.forEach((e, i) => {
    e.addEventListener("change", (event) => {
      if (event.target.checked) {
        addOns.push({
          id: i + 1,
          name: event.target.name,
          price:
            event.target.nextElementSibling.querySelector(".price").innerHTML,
        });
      } else addOns = addOns.filter((ele) => ele.id !== i + 1);
    });
  });
}

// ========================================================================

// Calculating Total Cost And Setting It To The SessionStorage.
function calculateTotalCost() {
  let cost = 0;
  addOns.forEach((e) => {
    cost += parseInt(e.price.slice(2));
  });
  cost += parseInt(sessionStorage.getItem("plan-price").slice(1));
  sessionStorage.getItem("plan-type") === "Yearly"
    ? (cost = `$${cost}/yr`)
    : (cost = `$${cost}/mo`);
  sessionStorage.setItem("total-cost", cost);
}

// If Add-ons Added, Display Elements Containing Their Details In The Final Step.
function displayAddonsDetails(addOns) {
  addOns.forEach((e) => {
    let addOn = document.createElement("div");
    addOn.className = "selected-add-on";
    let addonName = document.createElement("span");
    addonName.innerHTML = e.name;
    let addonPrice = document.createElement("span");
    addonPrice.className = "cost";
    addonPrice.innerHTML = e.price;
    addOn.append(addonName, addonPrice);
    formSummary.appendChild(addOn);
  });
}

// Getting Data From The SessionStorage To Be Shown In The Final Step Page.
function setFormSummary() {
  formSummary.querySelector("h4").innerHTML = `${sessionStorage.getItem(
    "plan"
  )} (${sessionStorage.getItem("plan-type")})`;
  formSummary.querySelector(
    ".selected-plan .cost"
  ).innerHTML = `${sessionStorage.getItem("plan-price")}`;
  displayAddonsDetails(addOns);
  totalCost.querySelector("span").innerHTML = `Total (per ${sessionStorage
    .getItem("plan-type")
    .slice(0, -2)
    .toLowerCase()})`;
  totalCost.querySelector(".cost").innerHTML = `${sessionStorage.getItem(
    "total-cost"
  )}`;
}

// ========================================================================

// Revealing What Is The Next Step And Setting The Location To It.
function nextStep() {
  for (let i = 0, len = steps.length; i < len; i++) {
    let isActive = steps[i].classList.contains("active");
    if (isActive) {
      let nextPage = steps[i + 1]
        .querySelector("p")
        .innerHTML.replace(" ", "-")
        .toLowerCase();
      window.location.replace(`./${nextPage}.html`);
      break;
    }
  }
}

// Going To The Next Step Depending On Some Checks Concerning The Current Step.
function goForward() {
  if (pageName === "" && checkName() && checkEmail() && checkPhone()) {
    personalInfo.forEach((e) => {
      sessionStorage.setItem(e.id, e.value);
    });
    nextStep();
  } else if (pageName === "select-plan") {
    if (isPlanSelected()) {
      document.querySelector(".plans .alert").style.display = "none";
      setPlanFrom(plans);
      nextStep();
    } else document.querySelector(".plans .alert").style.display = "inline";
  } else if (pageName === "add-ons") {
    sessionStorage.setItem("add-ons", JSON.stringify(addOns));
    calculateTotalCost();
    nextStep();
  } else if (pageName === "summary") {
    let confirmMsg = confirm("Are you sure ?");
    if (confirmMsg) {
      document.querySelector(".step-details").innerHTML = "";
      document.querySelector(".step-details").style.justifyContent = "center";
      thanksSection.style.display = "block";
      document.querySelector(".step-details").appendChild(thanksSection);
      nextButton.parentElement.style.display = "none";
      sessionStorage.clear();
    }
  }
}

// Going To The Previous Step
function goBackward() {
  for (let i = 0, len = steps.length; i < len; i++) {
    let isActive = steps[i].classList.contains("active");
    if (isActive) {
      let previousPage = steps[i - 1]
        .querySelector("p")
        .innerHTML.replace(" ", "-")
        .toLowerCase();
      previousPage === "your-info"
        ? window.location.replace("./")
        : window.location.replace(`./${previousPage}.html`);
      break;
    }
  }
}

nextButton.addEventListener("click", goForward);
