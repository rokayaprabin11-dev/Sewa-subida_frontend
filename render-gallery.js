// render-gallery.js
// Listens for 'galleryReady' from data-gallery.js then:
//  1. Rebuilds #filter-tabs from live categories
//  2. Renders masonry items into #masonry
//  3. Handles filter tab clicks
//  4. Updates #count-display
//  5. Patches window.getVisibleItems() for lightbox nav
// Place at project ROOT (same folder as portfolio.html)

document.addEventListener("galleryReady", function () {
  var data         = window.GALLERY_DATA || [];
  var grid         = document.getElementById("masonry");
  var tabsWrap     = document.getElementById("filter-tabs");
  var countDisplay = document.getElementById("count-display");
  var emptyState   = document.getElementById("empty-state");

  if (!grid) {
    console.error("[render-gallery.js] #masonry element not found in DOM");
    return;
  }

  // ── 1. Build filter tabs ─────────────────────────────────────────────────
  if (tabsWrap) {
    var cats = [];
    data.forEach(function (item) {
      if (item.cat && cats.indexOf(item.cat) === -1) cats.push(item.cat);
    });

    tabsWrap.innerHTML =
      '<button class="filter-tab active" data-filter="all">All Work</button>' +
      cats.map(function (c) {
        return (
          '<button class="filter-tab" data-filter="' + c + '">' +
          c.charAt(0).toUpperCase() + c.slice(1) +
          "</button>"
        );
      }).join("");
  }

  // ── 2. Render masonry items ──────────────────────────────────────────────
  function renderItems(filter) {
    grid.innerHTML = "";
    var visible = 0;

    data.forEach(function (item) {
      if (filter !== "all" && item.cat !== filter) return;
      visible++;

      var desc      = item.description || item.desc || "";
      var catLabel  = item.cat ? item.cat.charAt(0).toUpperCase() + item.cat.slice(1) : "";
      var delay     = "delay-" + (((visible - 1) % 3) + 1);

      var div = document.createElement("div");
      div.className           = "masonry-item reveal " + delay;
      div.dataset.cat         = item.cat      || "";
      div.dataset.title       = item.title    || "";
      div.dataset.desc        = desc;
      div.dataset.service     = item.service  || "";
      div.dataset.duration    = item.duration || "";
      div.dataset.location    = item.location || "";
      div.dataset.budget      = item.budget   || "";
      div.setAttribute("onclick", "openLightbox(this)");

      div.innerHTML =
        '<div class="masonry-fake-img" style="height:' +
          (item.height || 180) + "px;background:" + (item.bg || "#c8e6b0") + '">' +
          '<img src="' + (item.image || "") + '" alt="' + (item.title || "") + '" loading="lazy">' +
        "</div>" +
        '<span class="masonry-cat-badge">' + catLabel + "</span>" +
        '<div class="masonry-overlay">' +
          '<div class="masonry-info">' +
            "<h4>" + (item.title || "") + "</h4>" +
            "<span>" + catLabel + " \xb7 " + (item.service || "") + " \xb7 " + (item.budget || "") + "</span>" +
          "</div>" +
          '<div class="masonry-open-btn"><i class="fa-solid fa-expand"></i></div>' +
        "</div>";

      grid.appendChild(div);
    });

    // Update count
    if (countDisplay) countDisplay.textContent = visible;

    // Empty state
    if (emptyState) emptyState.style.display = visible === 0 ? "block" : "none";

    // Hook into page's scroll-reveal IntersectionObserver
    if (window._revealObserver) {
      grid.querySelectorAll(".reveal").forEach(function (el) {
        window._revealObserver.observe(el);
      });
    } else {
      setTimeout(function () {
        if (window._revealObserver) {
          grid.querySelectorAll(".reveal").forEach(function (el) {
            window._revealObserver.observe(el);
          });
        } else {
          grid.querySelectorAll(".reveal").forEach(function (el) {
            el.classList.add("visible");
          });
        }
      }, 150);
    }
  }

  // Initial full render
  renderItems("all");

  // ── 3. Filter tab click handler (event delegation) ───────────────────────
  document.addEventListener("click", function (e) {
    var tab = e.target.closest(".filter-tab");
    if (!tab) return;
    document.querySelectorAll(".filter-tab").forEach(function (t) {
      t.classList.remove("active");
    });
    tab.classList.add("active");
    renderItems(tab.dataset.filter);
  });

  // ── 4. Patch lightbox nav ────────────────────────────────────────────────
  // portfolio.html's original allItems array is captured on page load
  // before items exist. Override getVisibleItems() with a live query.
  window.getVisibleItems = function () {
    return Array.from(document.querySelectorAll(".masonry-item"));
  };
});
