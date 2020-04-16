function lazyImagesWithIntersectionObserver() {
  const lazyImages = [].slice.call(document.querySelectorAll("figure.lazy"));

  let lazyImageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let lazyImage = entry.target.querySelector("img");

        lazyImage.addEventListener("load", event =>
          onLoadedImage(event, entry)
        );

        lazyImage.src = lazyImage.dataset.src;
        if (lazyImage.dataset.srcset)
          lazyImage.srcset = lazyImage.dataset.srcset;
        lazyImageObserver.unobserve(lazyImage);
      }
    });
  });

  lazyImages.forEach(lazyImage => {
    lazyImageObserver.observe(lazyImage);
  });
}

function lazyImagesWithScrollOrResizeOrOrientationChange() {
  let lazyImages = [].slice.call(document.querySelectorAll(".lazy"));
  let active = false;

  const lazyLoad = () => {
    if (active === false) {
      active = true;

      setTimeout(() => {
        lazyImages.forEach(lazyImage => {
          if (
            lazyImage.getBoundingClientRect().top <= window.innerHeight &&
            lazyImage.getBoundingClientRect().bottom >= 0 &&
            getComputedStyle(lazyImage).display !== "none"
          ) {
            lazyImage.addEventListener("load", onLoadedImage);

            lazyImage.src = lazyImage.dataset.src;
            if (lazyImage.dataset.srcset)
              lazyImage.srcset = lazyImage.dataset.srcset;
            lazyImage.classList.remove("lazy");

            lazyImages = lazyImages.filter(image => {
              return image !== lazyImage;
            });

            if (lazyImages.length === 0) {
              document.removeEventListener("scroll", lazyLoad);
              window.removeEventListener("resize", lazyLoad);
              window.removeEventListener("orientationchange", lazyLoad);
            }
          }
        });

        active = false;
      }, 200);
    }
  };

  document.addEventListener("scroll", lazyLoad);
  window.addEventListener("resize", lazyLoad);
  window.addEventListener("orientationchange", lazyLoad);
}

function onLoadedImage(_, parent) {
  parent.target.classList.remove("lazy-loading");
}

export function lazyImages() {
  if ("IntersectionObserver" in window) {
    lazyImagesWithIntersectionObserver();
  } else {
    lazyImagesWithScrollOrResizeOrOrientationChange();
  }
}
