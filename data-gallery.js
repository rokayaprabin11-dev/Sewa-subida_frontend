// data-gallery.js
// Fetches gallery rows from the backend when available.
// Falls back to a local curated list so the portfolio keeps working even if the API is offline.

(function () {
  var API = "https://sewa-subida-backend-a4d9.onrender.com";
  var fallbackRows = [
    { title: "Woodland Retreat", description: "A full residential transformation with layered planting and seating areas.", cat: "modern", service: "Full Landscaping", duration: "3 weeks", location: "Lalitpur", budget: "$$$", image: "images/modern1.webp", height: 260, bg: "#dcefc3" },
    { title: "Bali Garden", description: "Tropical planting and stone features designed for a warm, low-maintenance courtyard.", cat: "tropical", service: "Design & Planting", duration: "4 weeks", location: "Lalitpur", budget: "$$$", image: "images/topical1.webp", height: 220, bg: "#d7efc5" },
    { title: "Sunstone Patio", description: "Hardscape-focused patio with clean lines and evening lighting.", cat: "patio", service: "Patio & Hardscape", duration: "2 weeks", location: "Kathmandu", budget: "$$$", image: "images/patio1.webp", height: 180, bg: "#f4d7a8" },
    { title: "Evergreen Lawn", description: "Sodded lawn installation and edging to create a crisp green yard.", cat: "lawn", service: "Lawn Installation", duration: "2 days", location: "Bhaktapur", budget: "$$", image: "images/lawns.webp", height: 150, bg: "#b8dba3" },
    { title: "Courtyard Design", description: "A private courtyard with statement planting and textured paving.", cat: "patio", service: "Garden Design", duration: "3 weeks", location: "Kathmandu", budget: "$$$", image: "images/patio2.webp", height: 200, bg: "#f1e3c3" },
    { title: "Water Feature", description: "Modern water feature with integrated lighting and stone detailing.", cat: "modern", service: "Water Feature", duration: "2 weeks", location: "Lalitpur", budget: "$$$$", image: "images/modern2.webp", height: 160, bg: "#dce8f0" },
    { title: "Meadow Lawn", description: "A greener, softer lawn finish that suits a family outdoor space.", cat: "lawn", service: "Lawn Maintenance", duration: "1 week", location: "Lalitpur", budget: "$$", image: "images/lawns1.webp", height: 140, bg: "#cfeab4" },
    { title: "Evening Garden", description: "Lighting and layered planting created a new social outdoor zone.", cat: "modern", service: "Outdoor Lighting", duration: "4 weeks", location: "Bhaktapur", budget: "$$$$", image: "images/moder3.webp", height: 180, bg: "#e5ddf7" }
  ];

  function emit(rows) {
    window.GALLERY_DATA = rows.map(function (r) {
      return Object.assign({}, r, { desc: r.description || r.desc || "" });
    });
    document.dispatchEvent(new Event("galleryReady"));
  }

  fetch(API + "/api/gallery")
    .then(function (res) {
      if (!res.ok) throw new Error("Gallery fetch failed: " + res.status);
      return res.json();
    })
    .then(function (rows) {
      emit(rows || fallbackRows);
    })
    .catch(function (err) {
      console.warn("[data-gallery.js] Using local fallback gallery data.");
      emit(fallbackRows);
    });
})();
