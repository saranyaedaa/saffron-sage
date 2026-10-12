
"use strict";

// 1. Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Close the mobile menu after selecting a link
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

// 2. Menu category filtering
const filterButtons = document.querySelectorAll(".filter-btn");
const dishCards = document.querySelectorAll(".dish-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.filter;

    // Update the active button
    filterButtons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });

    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");

    // Show matching dishes
    dishCards.forEach((card) => {
      const matches =
        selectedCategory === "all" ||
        card.dataset.category === selectedCategory;

      card.hidden = !matches;
    });
  });
});

// Set initial accessibility state for filters
filterButtons.forEach((button) => {
  button.setAttribute(
    "aria-pressed",
    String(button.classList.contains("active"))
  );
});

// 3. Scroll reveal animations
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  // Fallback for older browsers
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}

// 4. Set the current year in the footer
document.getElementById("year").textContent =
  new Date().getFullYear();

// 5. Prevent past dates in the reservation form
const visitDate = document.getElementById("visitDate");

const today = new Date();
const localDate = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0")
].join("-");

visitDate.min = localDate;

// 6. Reservation form demonstration
const reservationForm =
  document.getElementById("reservationForm");

const formMessage = document.getElementById("formMessage");

reservationForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!reservationForm.reportValidity()) {
    return;
  }

  const name = document.getElementById("guestName").value.trim();
  const date = visitDate.value;
  const guests = document.getElementById("guestCount").value;
  const time = document.getElementById("visitTime").value;

  if (date < localDate) {
    formMessage.style.color = "#b33b32";
    formMessage.textContent =
      "Please select today or a future date.";
    return;
  }

  formMessage.style.color = "#426d3a";
  formMessage.textContent =
    `Thank you, ${name}! Your demo reservation request ` +
    `is ready for ${guests} guest(s) on ${date} at ${time}. ` +
    "This is a demonstration only; no booking was sent.";

  reservationForm.reset();
  visitDate.min = localDate;
});

console.log("Saffron & Sage website is ready!");
