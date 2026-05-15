// data-gallery.js
// Fetches gallery rows from the Railway API.
// Fires 'galleryReady' when data is on window.GALLERY_DATA.
// Place at project ROOT (same folder as portfolio.html)

(function () {
var API = "https://sewa-subidabackend-production.up.railway.app";

  fetch(API + "/api/gallery")
    .then(function (res) {
      if (!res.ok) throw new Error("Gallery fetch failed: " + res.status);
      return res.json();
    })
    .then(function (rows) {
      // DB field is 'description' — map to 'desc' alias so render script works
      window.GALLERY_DATA = rows.map(function (r) {
        return Object.assign({}, r, { desc: r.description });
      });
      document.dispatchEvent(new Event("galleryReady"));
    })
    .catch(function (err) {
      console.error("[data-gallery.js]", err);
      window.GALLERY_DATA = [];
      document.dispatchEvent(new Event("galleryReady"));
    });
})();
