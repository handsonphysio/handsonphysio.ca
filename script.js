
/* MOBILE MENU TOGGLE */

function toggleMenu() {
  document.querySelector(".nav-links").classList.toggle("show");
}

/* CLOSE MENU ON CLICK */

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelector(".nav-links").classList.remove("show");
  });
});
