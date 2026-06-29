
/* MOBILE MENU */
function toggleMenu(){
  document.querySelector(".nav-links").classList.toggle("show");
}

/* SCROLL ANIMATION */
window.addEventListener("scroll", () => {
  document.querySelectorAll(".card").forEach(el => {
    const top = el.getBoundingClientRect().top;
    if(top < window.innerHeight - 100){
      el.classList.add("fade-up");
    }
  });
});
