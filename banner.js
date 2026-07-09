(function () {
  "use strict";

  /* ----------------------------- CONFIG ---------------------------------- */
  const BANNER_CONFIG = {
    affiliateLink: "https://takeuforward.org/plus?affiliate=attendance75",
    saleOn: true, // flip to false when the sale ends
    discountBadge: "50% OFF", // edit when the discount changes
    price: "₹2,950.00",
    originalPrice: "₹5,899.00",
    learners: "16,75,998+", // verbatim from the TUF+ page
    timerEnabled: true, // false = no auto-close countdown
    autoCloseSeconds: 10,
    autoCooldownDays: 7, // countdown elapsed -> suppress this long
    manualCooldownDays: 14, // manual close / backdrop / CTA click -> suppress this long
  };

  const LS = {
    firstVisit: "tuf_first_visit",
    suppressUntil: "tuf_suppress_until",
  };

  const BRAND = { dark: "#121212", orange: "#ea763f", orangeHover: "#e55a00", orangeDark: "#d9612c" };

  const DAY_MS = 24 * 60 * 60 * 1000;
  const todayStr = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const now = () => Date.now();

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

  const forceShow = new URLSearchParams(window.location.search).get("show_banner") === "true";

  function isSecondDayOrLater() {
    const first = ls_get(LS.firstVisit);
    if (!first) {
      ls_set(LS.firstVisit, todayStr());
      return false; // first ever day
    }
    return first !== todayStr();
  }

  function interstitialInCooldown() {
    const until = parseInt(ls_get(LS.suppressUntil) || "0", 10);
    return now() < until;
  }

  function setCooldown(days) {
    if (forceShow) return; // never pollute real state while testing
    ls_set(LS.suppressUntil, String(now() + days * DAY_MS));
  }

  /* ----------------------------- STYLES ----------------------------------- */
  function injectStyles() {
    const css = `
    .tuf-strip {
      background: ${BRAND.orange};
      color: #fff;
      font-family: "Manrope", sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      line-height: 1.3;
      padding: 8px 12px;
      display: flex; align-items: center; justify-content: center; gap: 6px;
      cursor: pointer;
      overflow: hidden;
    }
    .tuf-strip:hover { background: ${BRAND.orangeDark}; }
    .tuf-strip-icon { flex: none; line-height: 1; }
    .tuf-strip-txt {
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }

    .tuf-overlay {
      position: fixed; inset: 0; z-index: 1000;
      background: rgba(10,10,10,0.97);
      display: flex; align-items: center; justify-content: center;
      padding: 1.25rem;
      font-family: "Manrope", sans-serif;
      opacity: 0; transition: opacity .25s ease;
    }
    .tuf-overlay.show { opacity: 1; }

    .tuf-card {
      position: relative;
      width: 100%; max-width: 460px;
      background: ${BRAND.dark};
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 2.25rem 1.75rem 1.5rem;
      text-align: center;
      color: #fff;
      transform: translateY(12px) scale(.98);
      transition: transform .25s ease;
    }
    .tuf-overlay.show .tuf-card { transform: translateY(0) scale(1); }

    .tuf-close {
      position: absolute; top: 10px; right: 10px;
      width: 34px; height: 34px;
      display: flex; align-items: center; justify-content: center;
      background: rgba(255,255,255,0.08); border: none; border-radius: 50%;
      color: #bbb; cursor: pointer; transition: all .2s ease;
    }
    .tuf-close:hover { background: rgba(255,255,255,0.16); color: #fff; }
    .tuf-close svg { width: 16px; height: 16px; }

    .tuf-logo {
      height: 26px; width: auto; display: block; margin: 0 auto 1.2rem;
    }

    .tuf-headline {
      font-size: 1.5rem; font-weight: 700; line-height: 1.2;
      margin-bottom: .75rem; letter-spacing: -0.5px;
    }
    .tuf-sub {
      font-size: .95rem; line-height: 1.5; color: #b8b8b8;
      margin-bottom: 1.25rem;
    }
    .tuf-sub b { color: #fff; font-weight: 500; }

    .tuf-price {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: .5rem; margin-bottom: 1.25rem;
    }
    .tuf-price-was {
      display: inline-flex; align-items: center; gap: .5rem;
    }
    .tuf-badge {
      background: ${BRAND.orange}; color: #fff; font-weight: 600;
      font-size: .8rem; padding: 3px 10px; border-radius: 999px;
    }
    .tuf-strike { color: #888; text-decoration: line-through; font-size: .95rem; }
    .tuf-now { font-size: 1.6rem; font-weight: 700; letter-spacing: -0.5px; }

    /* Matches TUF+'s primary CTA (solid orange pill, hover darkens). */
    .tuf-cta {
      display: inline-flex; align-items: center; justify-content: center; gap: .5rem;
      width: 100%;
      background: ${BRAND.orange};
      color: #fff; font-family: inherit; font-size: 16px; font-weight: 600;
      border: none; border-radius: 999px; padding: 12px 24px;
      cursor: pointer; text-decoration: none;
      transition: background-color .15s cubic-bezier(.4,0,.2,1);
    }
    .tuf-cta:hover { background: ${BRAND.orangeHover}; }
    .tuf-countdown {
      margin-top: .85rem; font-size: .8rem; color: #777; height: 1rem;
    }

    @media screen and (max-width: 480px) {
      .tuf-strip { font-size: .8rem; }
      .tuf-headline { font-size: 1.25rem; }
      .tuf-card { padding: 2rem 1.25rem 1.25rem; }
      .tuf-now { font-size: 1.45rem; }
    }`;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  const closeIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>';

  /* ------------------------------ STRIP ----------------------------------- */
  function renderStrip() {
    const strip = document.createElement("div");
    strip.className = "tuf-strip";
    strip.setAttribute("role", "link");
    strip.innerHTML =
      '<span class="tuf-strip-icon">🔥</span>' +
      '<span class="tuf-strip-txt">' +
      "Land your dream tech job with Striver's TUF+" +
      (BANNER_CONFIG.saleOn ? " — " + BANNER_CONFIG.discountBadge : "") +
      " →</span>";

    strip.addEventListener("click", function () {
      track("tuf_strip_click", { affiliate_link: BANNER_CONFIG.affiliateLink });
      window.open(BANNER_CONFIG.affiliateLink, "_blank");
    });

    document.body.insertBefore(strip, document.body.firstChild);
    track("tuf_strip_impression");
  }

  /* --------------------------- INTERSTITIAL ------------------------------- */
  let overlayEl = null;
  let countdownTimer = null;
  let shownThisSession = false;

  function buildCardHTML() {
    const c = BANNER_CONFIG;
    const priceBlock = c.saleOn
      ? '<div class="tuf-price">' +
        '<span class="tuf-price-was">' +
        '<span class="tuf-badge">' + c.discountBadge + "</span>" +
        '<span class="tuf-strike">' + c.originalPrice + "</span>" +
        "</span>" +
        '<span class="tuf-now">' + c.price + "</span>" +
        "</div>"
      : "";
    const ctaLabel = c.saleOn ? "Claim 50% Off" : "Explore TUF+";

    return (
      '<div class="tuf-card" role="dialog" aria-modal="true">' +
      '<button type="button" class="tuf-close" aria-label="Close">' + closeIcon + "</button>" +
      '<img class="tuf-logo" src="./tuf-logo.png" alt="takeUforward" />' +
      '<div class="tuf-headline">Bunked enough classes?<br>Don\'t bunk your placement prep.</div>' +
      '<div class="tuf-sub">Striver\'s TUF+ — trusted by <b>' + c.learners +
      " learners</b>. Crack <b>FAANG</b> interviews with DSA, system design &amp; core CS topics, all in one place.</div>" +
      priceBlock +
      '<a class="tuf-cta" href="' + c.affiliateLink + '" target="_blank" rel="noopener">' +
      ctaLabel + " <span aria-hidden=\"true\">→</span></a>" +
      '<div class="tuf-countdown"></div>' +
      "</div>"
    );
  }

  function closeInterstitial(method) {
    if (!overlayEl) return;
    if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
    overlayEl.classList.remove("show");
    document.body.style.overflow = "";
    const el = overlayEl;
    overlayEl = null;
    setTimeout(function () { if (el && el.parentNode) el.parentNode.removeChild(el); }, 250);

    if (method === "cta") {
      setCooldown(BANNER_CONFIG.manualCooldownDays);
    } else {
      track("tuf_banner_dismiss", { method: method });
      setCooldown(method === "auto" ? BANNER_CONFIG.autoCooldownDays : BANNER_CONFIG.manualCooldownDays);
    }
  }

  function showInterstitial() {
    if (overlayEl || shownThisSession) return;
    shownThisSession = true;

    overlayEl = document.createElement("div");
    overlayEl.className = "tuf-overlay";
    overlayEl.innerHTML = buildCardHTML();
    document.body.appendChild(overlayEl);
    document.body.style.overflow = "hidden"; // scroll lock

    // backdrop click = manual dismiss
    overlayEl.addEventListener("click", function (e) {
      if (e.target === overlayEl) closeInterstitial("manual");
    });
    overlayEl.querySelector(".tuf-close").addEventListener("click", function () {
      closeInterstitial("manual");
    });
    overlayEl.querySelector(".tuf-cta").addEventListener("click", function () {
      track("tuf_banner_click", { affiliate_link: BANNER_CONFIG.affiliateLink });
      closeInterstitial("cta"); // new tab handled by anchor target=_blank
    });

    // countdown (skipped entirely when timerEnabled is false - banner stays open)
    const cdEl = overlayEl.querySelector(".tuf-countdown");
    if (BANNER_CONFIG.timerEnabled) {
      let remaining = BANNER_CONFIG.autoCloseSeconds;
      cdEl.textContent = "auto closes in " + remaining + "…";
      countdownTimer = setInterval(function () {
        remaining -= 1;
        if (remaining <= 0) {
          clearInterval(countdownTimer);
          countdownTimer = null;
          closeInterstitial("auto");
        } else {
          cdEl.textContent = "auto closes in " + remaining + "…";
        }
      }, 1000);
    } else {
      cdEl.style.display = "none";
    }

    requestAnimationFrame(function () { overlayEl.classList.add("show"); });
    track("tuf_banner_impression");
  }

  /* ------------------------------- INIT ----------------------------------- */
  function init() {
    injectStyles();

    // Record first visit / determine 2nd-day eligibility (still gates the interstitial).
    const secondDayOrLater = isSecondDayOrLater();

    // Persistent top strip: shown on EVERY load, regardless of user age.
    renderStrip();

    // Interstitial: gated behind the 2nd-day rule + cooldown (or the force-show key).
    const interstitialArmed = forceShow || (secondDayOrLater && !interstitialInCooldown());
    if (!interstitialArmed) return;

    if (forceShow) {
      // testing: show immediately so the UI can be inspected
      showInterstitial();
    } else {
      const btn = document.getElementById("btn");
      if (btn) btn.addEventListener("click", showInterstitial);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
