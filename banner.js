(function () {
  "use strict";

  /* ----------------------------- CONFIG ---------------------------------- */
  const BANNER_CONFIG = {
    affiliateLink: "https://takeuforward.org/pricing?affiliate=attendance75#plans",
    saleOn: true, // flip to false when the sale ends
    discountBadge: "40% OFF", // edit when the discount changes
    stripClickCooldownDays: 30, // hide the strip for this long after someone clicks it
  };

  const LS = {
    stripSuppressUntil: "tuf_strip_suppress_until",
  };

  // Dark-theme tokens from the revamped takeuforward.org stylesheet.
  const BRAND = {
    bg: "#0d0e12", // --color-card-1
    card: "#13161b", // --color-card-2
    stroke: "#1f2023", // --color-stroke-default
    text: "#fcfcfd", // --color-text-primary
    textMuted: "#c1c4cc", // --color-text-secondary
    blue: "#327cf6", // --color-brand-blue
    blueHover: "#4a8bf7", // --color-brand-hover
    gold: "#feeed4", // --color-semantic-yellow-900
    goldBorder: "#9d7110", // --color-semantic-yellow-800 (light)
  };

  // TUF+ "Plus" mark, as used on the upgrade page.
  const plusMark =
    '<svg class="tuf-plus-mark" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M6.10259 0.0116852C6.56952 -0.0394528 6.95596 0.0736239 7.27999 0.422824C7.7451 0.924081 7.70296 1.55083 7.68346 2.1843C7.67623 2.41892 7.71945 2.67883 7.70714 2.91687C7.6999 3.18176 7.71131 3.55589 7.67114 3.81265C7.62434 4.11184 7.34607 4.58124 7.10897 4.76831C6.79923 5.01271 6.70747 5.06931 6.48929 5.42017C6.20117 5.8844 6.15224 6.38531 5.74039 6.7816C5.00272 7.49134 4.06322 7.43117 3.12393 7.43028L1.63615 7.4284C1.11669 7.42798 0.845475 7.43083 0.434868 7.06281C-0.127908 6.55843 -0.138392 5.59846 0.368206 5.05142C0.504008 4.90487 0.675053 4.79598 0.864842 4.73528C1.33478 4.58814 1.72668 4.647 2.20631 4.64087C2.72276 4.63428 3.24558 4.64762 3.76077 4.64087C4.15243 4.64057 4.33046 4.54421 4.60801 4.28004C4.96087 3.94419 4.90742 3.6671 4.90613 3.21757L4.90292 2.13603C4.90131 1.54464 4.82982 0.902361 5.25538 0.411192C5.43234 0.206928 5.83407 0.0184335 6.10259 0.0116852Z" fill="url(#tuf-plus-g0)"/>' +
    '<path d="M9.01286 4.68751C9.30729 4.67164 9.72107 4.69161 10.035 4.68751C10.3134 4.68388 10.9921 4.65973 11.2429 4.68751C11.4266 4.70857 11.5796 4.71047 11.7496 4.78353C11.8307 4.8182 11.9506 4.8748 12.0184 4.93058C12.9098 5.66444 12.6796 7.10551 11.5195 7.38978C11.2252 7.4619 10.7531 7.4289 10.4488 7.42832L9.14434 7.42561C8.86577 7.42546 8.55579 7.40881 8.29314 7.51721C8.08402 7.60351 7.85398 7.81361 7.76738 8.02409C7.61162 8.40257 7.6683 9.8799 7.6758 10.3817C7.67878 10.5806 7.70956 10.8436 7.63134 11.0293C7.46838 11.4068 7.29353 11.7188 6.89182 11.8873C6.48357 12.0587 5.89808 12.0366 5.51661 11.8062C4.73782 11.3359 4.92336 10.3948 4.90209 9.62846C4.86556 8.75342 4.96897 8.09329 5.78606 7.63071C6.12793 7.44406 6.47268 7.20617 6.66043 6.8447C7.07576 6.04511 7.32941 5.19587 8.24048 4.8269C8.4848 4.72797 8.76195 4.7514 9.01286 4.68751Z" fill="url(#tuf-plus-g1)"/>' +
    "<defs>" +
    '<linearGradient id="tuf-plus-g0" x1="6.23283" y1="5.97466" x2="3.87592" y2="3.70608" gradientUnits="userSpaceOnUse"><stop stop-color="#FCE3AC"/><stop offset="1" stop-color="#E7A007"/></linearGradient>' +
    '<linearGradient id="tuf-plus-g1" x1="8.72464" y1="8.33213" x2="6.7798" y2="6.54752" gradientUnits="userSpaceOnUse"><stop stop-color="#E7A007"/><stop offset="1" stop-color="#FCE3AC"/></linearGradient>' +
    "</defs></svg>";

  const chevron =
    '<svg class="tuf-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';

  const DAY_MS = 24 * 60 * 60 * 1000;

  function ls_get(k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
  }
  function ls_set(k, v) {
    try { localStorage.setItem(k, v); } catch (e) { /* private mode - ignore */ }
  }

  function track(event, params) {
    if (typeof gtag !== "undefined") {
      gtag("event", event, Object.assign({ event_category: "affiliate" }, params || {}));
    } else {
      console.warn("gtag not defined – " + event + " not tracked");
    }
  }

  function openAffiliate() {
    window.open(BANNER_CONFIG.affiliateLink, "_blank", "noopener");
  }

  /* ----------------------------- STYLES ----------------------------------- */
  function injectStyles() {
    // DM Sans is TUF's UI font; loaded here so only the promo pieces use it.
    const font = document.createElement("link");
    font.rel = "stylesheet";
    font.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap";
    document.head.appendChild(font);

    const css = `
    .tuf-strip, .tuf-result { font-family: "DM Sans", "Manrope", sans-serif; }
    .tuf-plus-mark { width: 15px; height: 14px; flex: none; }
    .tuf-chevron { width: 14px; height: 14px; flex: none; }

    .tuf-strip {
      background: ${BRAND.bg};
      border-bottom: 1px solid ${BRAND.stroke};
      color: ${BRAND.textMuted};
      font-size: 0.875rem;
      line-height: 1.3;
      padding: 8px 12px;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      cursor: pointer;
      overflow: hidden;
    }
    .tuf-strip-txt {
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .tuf-strip-txt b { color: ${BRAND.text}; font-weight: 600; }
    .tuf-strip-lead-short { display: none; }
    .tuf-badge {
      flex: none;
      color: ${BRAND.gold};
      border: 1px solid ${BRAND.goldBorder};
      font-size: 0.75rem; font-weight: 600;
      padding: 2px 8px; border-radius: 999px;
    }
    .tuf-strip-cta {
      flex: none;
      display: inline-flex; align-items: center; gap: 2px;
      color: ${BRAND.blue}; font-weight: 500;
      transition: color .15s ease;
    }
    .tuf-strip:hover .tuf-strip-cta { color: ${BRAND.blueHover}; }

    .tuf-result {
      max-width: 460px;
      margin: 0 auto 2rem;
      padding: 0 1rem;
    }
    .tuf-result-card {
      display: block;
      background: ${BRAND.card};
      border: 1px solid ${BRAND.stroke};
      border-radius: 12px;
      padding: 1rem;
      text-align: left;
      text-decoration: none;
      cursor: pointer;
    }
    .tuf-result-head {
      display: flex; align-items: center; gap: 6px;
      margin-bottom: 0.5rem;
    }
    .tuf-result-brand { color: ${BRAND.gold}; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.02em; }
    .tuf-result-head .tuf-badge { margin-left: auto; }
    .tuf-result-txt { display: block; color: ${BRAND.textMuted}; font-size: 0.9rem; line-height: 1.45; }
    .tuf-result-txt b { color: ${BRAND.text}; font-weight: 600; }
    .tuf-result-cta {
      display: flex; align-items: center; justify-content: center; gap: 4px;
      margin-top: 0.85rem;
      background: ${BRAND.blue};
      color: #fff; font-size: 0.875rem; font-weight: 500;
      border-radius: 8px; padding: 8px 14px;
      transition: background-color .15s ease;
    }
    .tuf-result-card:hover .tuf-result-cta { background: ${BRAND.blueHover}; }

    @media screen and (max-width: 480px) {
      .tuf-strip { font-size: .8rem; gap: 6px; }
      .tuf-strip-cta-label, .tuf-strip-lead { display: none; }
      .tuf-strip-lead-short { display: inline; }
    }`;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ------------------------------ STRIP ----------------------------------- */
  function stripInCooldown() {
    const until = parseInt(ls_get(LS.stripSuppressUntil) || "0", 10);
    return Date.now() < until;
  }

  function renderStrip() {
    const strip = document.createElement("div");
    strip.className = "tuf-strip";
    strip.setAttribute("role", "link");
    strip.innerHTML =
      plusMark +
      '<span class="tuf-strip-txt"><span class="tuf-strip-lead">Land your dream tech job</span>' +
      '<span class="tuf-strip-lead-short">Prep</span> with <b>Striver\'s TUF+</b></span>' +
      (BANNER_CONFIG.saleOn ? '<span class="tuf-badge">' + BANNER_CONFIG.discountBadge + "</span>" : "") +
      '<span class="tuf-strip-cta"><span class="tuf-strip-cta-label">Explore</span>' + chevron + "</span>";

    strip.addEventListener("click", function () {
      track("tuf_strip_click", { affiliate_link: BANNER_CONFIG.affiliateLink });
      ls_set(LS.stripSuppressUntil, String(Date.now() + BANNER_CONFIG.stripClickCooldownDays * DAY_MS));
      openAffiliate();
    });

    document.body.insertBefore(strip, document.body.firstChild);
    track("tuf_strip_impression");
  }

  /* --------------------------- RESULT CARD -------------------------------- */
  // Shown under the calculator output; app.js fires "attendance:calculated" after a valid result.
  let resultEl = null;

  function resultCopy(detail) {
    if (detail.canBunk && detail.days > 0) {
      return "You can bunk <b>" + detail.days + "</b> more " + (detail.days === 1 ? "day" : "days") +
        ". Spend them on <b>placement prep</b> with Striver's TUF+.";
    }
    return "Stuck attending classes anyway? Make the hours count with <b>Striver's TUF+</b> placement prep.";
  }

  function renderResultCard(detail) {
    const c = BANNER_CONFIG;
    const outputDiv = document.getElementById("output-div");
    if (!outputDiv) return;

    if (!resultEl) {
      resultEl = document.createElement("div");
      resultEl.className = "tuf-result";
      outputDiv.insertAdjacentElement("afterend", resultEl);
      resultEl.addEventListener("click", function (e) {
        if (!e.target.closest(".tuf-result-card")) return;
        e.preventDefault();
        track("tuf_result_click", { affiliate_link: c.affiliateLink });
        openAffiliate();
      });
    }

    const cta = c.saleOn ? "Get TUF+ at " + c.discountBadge.toLowerCase() : "Explore TUF+";
    resultEl.innerHTML =
      '<a class="tuf-result-card" href="' + c.affiliateLink + '" target="_blank" rel="noopener">' +
      '<span class="tuf-result-head">' + plusMark + '<span class="tuf-result-brand">TUF+</span>' +
      (c.saleOn ? '<span class="tuf-badge">' + c.discountBadge + "</span>" : "") +
      "</span>" +
      '<span class="tuf-result-txt">' + resultCopy(detail) + "</span>" +
      '<span class="tuf-result-cta">' + cta + chevron + "</span>" +
      "</a>";
    resultEl.hidden = false;
    track("tuf_result_impression");
  }

  function hideResultCard() {
    if (resultEl) resultEl.hidden = true;
  }

  /* ------------------------------- INIT ----------------------------------- */
  function init() {
    injectStyles();
    if (!stripInCooldown()) renderStrip();

    document.addEventListener("attendance:calculated", function (e) {
      renderResultCard(e.detail);
    });
    document.addEventListener("attendance:invalid", hideResultCard);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
