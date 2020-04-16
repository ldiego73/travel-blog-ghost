document.addEventListener("DOMContentLoaded", () => {
  new Swiper(".post-feature .swiper-container", {
    loop: true,
    navigation: {
      nextEl: ".post-feature-next",
      prevEl: ".post-feature-prev"
    }
  });
});
