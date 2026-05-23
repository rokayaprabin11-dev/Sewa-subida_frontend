// data-pricing.js
// Fetches pricing rows from the Railway API.
// Fires 'pricingReady' when data is on window.PRICING_DATA.
// Place at project ROOT (same folder as services.html)

(function () {
var API = "https://sewa-subida-backend.onrender.com";

  fetch(API + "/api/pricing")
    .then(function (res) {
      if (!res.ok) throw new Error("Pricing fetch failed: " + res.status);
      return res.json();
    })
    .then(function (rows) {
      // DB fields: description, cta_style
      // Map to aliases so render script handles both forms safely
      window.PRICING_DATA = rows.map(function (r) {
        return Object.assign({}, r, {
          desc:     r.description,
          ctaStyle: r.cta_style
        });
      });
      document.dispatchEvent(new Event("pricingReady"));
    })
    .catch(function (err) {
      console.error("[data-pricing.js]", err);
      window.PRICING_DATA = [];
      document.dispatchEvent(new Event("pricingReady"));
    });
})();
