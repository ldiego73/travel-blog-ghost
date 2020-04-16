import GhostContentAPI from "@tryghost/content-api";
import Fuse from "fuse.js";

import { ghostHost, ghostKey, ghostVersion } from "../utils/constants";
import Logger from "../utils/logger";

const l = new Logger("Search");

const $searchBox = document.querySelector(".navbar-search");
const $searchMobileBox = document.querySelector(".navbar-search-mobile");
const $searchClose = document.querySelector(".search-close");
const $search = document.querySelector(".search");
const $txtSearch = document.getElementById("txtSearch");
const $tags = document.querySelectorAll(".search-tags .tag");
const $searchResults = document.querySelector(".search-results");
const $tmplSearchResultPost = document.getElementById("tmplSearchResultPost");

let fuse = [];

export function initializeSearch() {
  if (typeof ghostKey === "undefined") {
    $searchBox.remove();
    $searchMobileBox.remove();

    return;
  }
  $searchBox.addEventListener("click", showSearch);
  $searchMobileBox.addEventListener("click", showSearch);
  $searchClose.addEventListener("click", closeSearch);
  $txtSearch.addEventListener("keyup", e => {
    findPosts(e.target.value);
  });

  tagsEvents();
  loadPosts();
}

function showSearch() {
  $search.classList.add("opened");
  document.body.classList.toggle("no-scroll-y");
}

function closeSearch() {
  $search.classList.remove("opened");
  document.body.classList.toggle("no-scroll-y");
}

function tagsEvents() {
  const $tagsArr = Array.prototype.slice.call($tags, 0);

  if ($tagsArr.length < 1) return;

  $tagsArr.forEach(el => {
    el.addEventListener("click", e => {
      const value = e.target.innerText;

      $txtSearch.value = value;

      findPosts(value);
    });
  });
}

function loadPosts() {
  const api = new GhostContentAPI({
    url: ghostHost,
    key: ghostKey,
    version: ghostVersion
  });

  const fuseOptions = {
    isCaseSensitive: false,
    findAllMatches: false,
    includeMatches: false,
    includeScore: false,
    useExtendedSearch: false,
    minMatchCharLength: 1,
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    keys: ["title", "custom_excerpt", "html", "tags.name"]
  };

  return api.posts
    .browse({
      limit: "all",
      fields:
        "id, title, url, published_at, primary_author, feature_image, custom_excerpt, html",
      include: "tags"
    })
    .then(result => {
      const posts = [];

      result.forEach(p => {
        posts.push(p);
      });

      fuse = new Fuse(posts, fuseOptions);
    })
    .catch(err => {
      l.error(err);
    });
}

function findPosts(value) {
  if (value.length < 1 || !fuse) {
    $searchResults.innerHTML = "";
    return;
  }

  const results = fuse.search(value);

  l.info("Find", results);

  $searchResults.innerHTML = "";

  const tmpl = $tmplSearchResultPost.innerHTML;
  let html = "";
  let i = 0;

  results.forEach(r => {
    const { item } = r;
    html += tmpl
      .replace("POST_URL", item.url)
      .replace("POST_TITLE", item.title)
      .replace("POST_PUBLISHED_AT", formatDate(item.published_at))
      .replace("POST_IMAGE", item.feature_image || "/images/no-image.png")
      .replace("POST_DELAY", i);
    i++;
  });

  $searchResults.innerHTML = html;
}

function loadAndFindPosts() {
  loadPosts().then(() => {
    findPosts($txtSearch.value);
  });
}

function formatDate(date) {
  if (date) {
    return new Date(date).toLocaleDateString(document.documentElement.lang, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  return "";
}
