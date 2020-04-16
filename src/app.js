import "./sass/app.scss";

import { lazyImages } from "./scripts/utils/image-lazy";
import { toogleMenu, toogleSubMenu } from "./scripts/components/header";
import { initializeSearch } from "./scripts/components/search";

const $backToTop = document.querySelector("#back-to-top");

document.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  lazyImages();
  toogleMenu();
  toogleSubMenu();

  initialChangeTheme();
  initializeSliders();
  initializeTooltips();
  initializeSearch();

  $backToTop.addEventListener("click", backToTop);
  window.addEventListener("scroll", scrollingDown);
});

function initialChangeTheme() {
  const $navbarTheme = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-theme"),
    0
  );

  if ($navbarTheme.length < 1) return;

  $navbarTheme.forEach(el => {
    el.addEventListener("click", changeTheme);
  });
}

function loadTheme() {
  const themeValue = localStorage.getItem("theme");

  if (themeValue) {
    document.querySelector("html").dataset.theme = themeValue;
  }
}

function changeTheme() {
  const html = document.querySelector("html");
  const { theme } = html.dataset;
  let themeValue = theme;

  if (!themeValue || themeValue === "light") {
    themeValue = "dark";
  } else {
    themeValue = "light";
  }

  html.dataset.theme = themeValue;

  localStorage.setItem("theme", themeValue);
}

function initializeSliders() {
  AOS.init({
    once: true,
    startEvent: "DOMContentLoaded"
  });
}

function initializeTooltips() {
  tippy("[data-tippy-content]", {});
}

function scrollToTop(duration, callback) {
  const start = window.pageYOffset;
  const startTime = Math.floor(Date.now());

  const scroll = () => {
    Math.easeInOutQuad = t => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };
    const time = Math.min(1, (Math.floor(Date.now()) - startTime) / duration);
    window.scroll(0, Math.ceil(Math.easeInOutQuad(time) * (0 - start) + start));
    if (window.pageYOffset === 0) {
      if (callback) callback();
      return;
    }
    requestAnimationFrame(scroll);
  };
  scroll();
}

function scrollingDown() {
  const offset = 100;

  if (
    document.body.scrollTop > offset ||
    document.documentElement.scrollTop > offset
  ) {
    $backToTop.style.display = "block";
  } else {
    $backToTop.style.display = "none";
  }
}

function backToTop() {
  !window.requestAnimationFrame ? window.scrollTo(0, 0) : scrollToTop(1000);
}
