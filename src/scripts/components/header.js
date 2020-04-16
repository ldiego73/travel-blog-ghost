const $header = document.querySelector("header");
const $menu = document.getElementById("menu");
const $navbarMore = document.querySelector(".navbar-more");
const $submenu = document.querySelector(".submenu");

let $slidesMenuPosts = {};
let submenuIsOpen = false;

function hideSubMenu() {
  $submenu.classList.remove("opened");
  $submenu.classList.add("closed");
  $navbarMore.classList.remove("is-active");
  submenuIsOpen = false;

  if ($slidesMenuPosts) $slidesMenuPosts.destroy(true, true);
}

function showSubMenu() {
  $submenu.classList.remove("closed");
  $submenu.classList.add("opened");
  $navbarMore.classList.add("is-active");
  submenuIsOpen = true;

  $slidesMenuPosts = new Swiper(".menu-posts .swiper-container", {
    slidesPerView: "auto",
    spaceBetween: 0,
    loop: false
  });
}

export function toogleMenu() {
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll(".navbar-burger"), 0);

  if ($navbarBurgers.length < 1) return;

  $navbarBurgers.forEach(el => {
    el.addEventListener("click", () => {
      $header.classList.toggle("mobile-opened");
      el.classList.toggle("is-active");
      $menu.classList.toggle("is-active");
      document.body.classList.toggle("no-scroll-y");

      if (submenuIsOpen) {
        hideSubMenu();
      } else {
        showSubMenu();
      }
    });
  });
}

export function toogleSubMenu() {
  $navbarMore.addEventListener("click", () => {
    if (submenuIsOpen) {
      hideSubMenu();
    } else {
      showSubMenu();
    }
  });

  window.addEventListener("click", e => {
    if (
      window.innerWidth <= 768 ||
      e.target === window.document.documentElement
    ) {
      return;
    }

    if (
      submenuIsOpen &&
      !$navbarMore.contains(e.target) &&
      !$submenu.contains(e.target) &&
      !$header.contains(e.target)
    ) {
      hideSubMenu();
    }
  });
}
