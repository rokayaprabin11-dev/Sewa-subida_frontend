// render-pricing.js
// Listens for 'pricingReady' from data-pricing.js then renders
// all pricing plan cards into .pricing-grid.
//
// DB field names used:
//   plan.name, plan.icon, plan.description (or plan.desc)
//   plan.price, plan.period, plan.note, plan.popular
//   plan.cta_style (or plan.ctaStyle), plan.features [{text, enabled}]
//
// Place at project ROOT (same folder as services.html)

document.addEventListener("pricingReady", function () {
  var data = window.PRICING_DATA || [];
  var grid = document.querySelector(".pricing-grid");

  function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>'"]/g, function(tag) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag;
    });
  }

  if (!grid) {
    console.error("[render-pricing.js] .pricing-grid element not found in DOM");
    return;
  }

  if (data.length === 0) {
    grid.innerHTML =
      '<p style="text-align:center;color:#7A7A72;padding:60px 0;grid-column:1/-1">' +
      "Pricing plans coming soon.</p>";
    return;
  }

  grid.innerHTML = data.map(function (plan, i) {
    var desc     = escapeHTML(plan.description || plan.desc || "");
    var ctaStyle = escapeHTML(plan.cta_style   || plan.ctaStyle || "outline");
    var icon     = escapeHTML(plan.icon        || "fa-leaf");
    var features = Array.isArray(plan.features) ? plan.features : [];
    var delay    = "delay-" + (i + 1);

    var featuresHtml = features.map(function (f) {
      var disabledClass = f.enabled ? "" : " disabled";
      var iconClass     = f.enabled ? "fa-check" : "fa-xmark";
      return (
        '<div class="price-feat' + disabledClass + '">' +
          '<i class="fa-solid ' + iconClass + '"></i> ' +
          escapeHTML(f.text || "") +
        "</div>"
      );
    }).join("");

    var popularBadge = plan.popular
      ? '<span class="popular-badge">Most Popular</span>'
      : "";

    var waMessage = "Hi! I'm interested in the \"" + (plan.name || "") + "\" plan" +
      (plan.price ? " (Rs. " + plan.price + (plan.period || "/month") + ")" : "") +
      ". Can we get started?";
    var waLink = "https://wa.me/9779851206373?text=" + encodeURIComponent(waMessage);

    return (
      '<div class="price-card' +
        (plan.popular ? " popular" : "") +
        " reveal-scale " + delay + '">' +

        popularBadge +

        '<div class="price-icon">' +
          '<i class="fa-solid ' + icon + '"></i>' +
        "</div>" +

        "<h3>" + escapeHTML(plan.name || "") + "</h3>" +

        '<p class="price-desc">' + desc + "</p>" +

        '<div class="price-amount">' +
          '<span class="price-currency">Rs.</span>' +
          '<span class="price-num">'  + escapeHTML(plan.price  || "") + "</span>" +
          '<span class="price-per">'  + escapeHTML(plan.period || "/month") + "</span>" +
        "</div>" +

        '<p class="price-note">' + escapeHTML(plan.note || "") + "</p>" +

        '<div class="price-divider"></div>' +

        '<div class="price-features">' + featuresHtml + "</div>" +

        '<a href="' + escapeHTML(waLink) + '" target="_blank" rel="noopener" class="price-cta price-cta-' +
          ctaStyle + '">Get Started \u2192</a>' +

      "</div>"
    );
  }).join("");

  // Hook into page's scroll-reveal IntersectionObserver
  if (window._revealObserver) {
    grid.querySelectorAll(".reveal-scale").forEach(function (el) {
      window._revealObserver.observe(el);
    });
  } else {
    setTimeout(function () {
      if (window._revealObserver) {
        grid.querySelectorAll(".reveal-scale").forEach(function (el) {
          window._revealObserver.observe(el);
        });
      } else {
        grid.querySelectorAll(".reveal-scale").forEach(function (el) {
          el.classList.add("visible");
        });
      }
    }, 150);
  }
});
