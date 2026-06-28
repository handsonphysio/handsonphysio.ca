const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const header = document.querySelector(".header");

/* MOBILE MENU */

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");

  if (navMenu.classList.contains("active")) {
    menuToggle.innerHTML = "✕";
  } else {
    menuToggle.innerHTML = "☰";
  }
});

/* CLOSE MENU WHEN LINK CLICKED */

const navLinks = document.querySelectorAll(".nav a");

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    menuToggle.innerHTML = "☰";
  });
});

/* HEADER SCROLL EFFECT */

window.addEventListener("scroll", () => {

  if (window.scrollY > 40) {

    header.style.background =
      "rgba(255,255,255,0.95)";

    header.style.boxShadow =
      "0 6px 24px rgba(0,0,0,0.06)";

  } else {

    header.style.background =
      "rgba(255,255,255,0.85)";

    header.style.boxShadow = "none";
  }

});

/* REVEAL ANIMATION */

const revealElements = document.querySelectorAll(
  ".feature-card, .service-card, .process-card, .gallery-item, .testimonial-card"
);

const revealOnScroll = () => {

  const triggerBottom =
    window.innerHeight * 0.9;

  revealElements.forEach(el => {

    const elementTop =
      el.getBoundingClientRect().top;

    if (elementTop < triggerBottom) {

      el.classList.add("show");

    }

  });

};

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

/* INITIAL STATE */

revealElements.forEach(el => {

  el.style.opacity = "0";
  el.style.transform = "translateY(40px)";
  el.style.transition =
    "all 0.8s ease";

});

/* SHOW CLASS */

document.addEventListener("DOMContentLoaded", () => {

  const style = document.createElement("style");

  style.innerHTML = `
    .show {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;

  document.head.appendChild(style);

});

/* SMOOTH ACTIVE NAV HIGHLIGHT */

const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {

  let current = "";

  sections.forEach(section => {

    const sectionTop =
      section.offsetTop - 140;

    const sectionHeight =
      section.offsetHeight;

    if (
      pageYOffset >= sectionTop &&
      pageYOffset < sectionTop + sectionHeight
    ) {
      current = section.getAttribute("id");
    }

  });

  navLinks.forEach(link => {

    link.classList.remove("active-link");

    if (
      link.getAttribute("href") === `#${current}`
    ) {
      link.classList.add("active-link");
    }

  });

});

/* ACTIVE LINK STYLE */

document.addEventListener("DOMContentLoaded", () => {

  const activeStyle =
    document.createElement("style");

  activeStyle.innerHTML = `
    .active-link {
      color: var(--primary) !important;
      position: relative;
    }

    .active-link::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: -6px;
      width: 100%;
      height: 2px;
      background: var(--primary);
      border-radius: 20px;
    }
  `;

  document.head.appendChild(activeStyle);

});

/* PARALLAX HERO EFFECT */

const hero = document.querySelector(".hero");

window.addEventListener("scroll", () => {

  const offset = window.pageYOffset;

  hero.style.backgroundPositionY =
    offset * 0.5 + "px";

});

/* BUTTON MICRO INTERACTIONS */

const buttons = document.querySelectorAll(
  ".primary-btn, .book-btn, .secondary-btn"
);

buttons.forEach(button => {

  button.addEventListener("mouseenter", () => {

    button.style.transform =
      "translateY(-3px)";

  });

  button.addEventListener("mouseleave", () => {

    button.style.transform =
      "translateY(0)";

  });

});

/* PREVENT MENU BUG ON RESIZE */

window.addEventListener("resize", () => {

  if (window.innerWidth > 820) {

    navMenu.classList.remove("active");
    menuToggle.innerHTML = "☰";

  }

});
