let currentAdIndex = 0;
let adContainer = null;
let rotationInterval = null;

const TRANSITION_DURATION = 300;

const firebaseConfig = {
  apiKey: "AIzaSyBpdvNze3lDLIGjFn9Dx0VFS0BnNaMTpwo",
  authDomain: "attendance75-b740c.firebaseapp.com",
  projectId: "attendance75-b740c",
  storageBucket: "attendance75-b740c.firebasestorage.app",
  messagingSenderId: "461722758532",
  appId: "1:461722758532:web:25df0747bc2f274d6f41d1",
  measurementId: "G-TMZ8FHG55P",
};

firebase.initializeApp(firebaseConfig);
const remoteConfig = firebase.remoteConfig();

remoteConfig.defaultConfig = {
  ads: JSON.stringify([]),
  adRotationInterval: 8000,
};
remoteConfig.settings.minimumFetchIntervalMillis = 1000 * 60 * 60; // 1 Hour

function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

function createAdHTML(ad) {
  return `
    <div class="ad-container">
      <img src="${ad.imageUrl}" width="50" height="50" class="ad-icon" alt="${ad.title} icon">
      <div class="ad-content">
        <a href="${ad.link}" target="_blank" style="text-decoration: none; color: inherit;" class="ad-link" data-ad-id="${ad.id}">
          <div class="ad-text">
            <div class="ad-title">${ad.title}</div>
            <p class="ad-description">${ad.description} ↗</p>
          </div>
        </a>
        ${
          ad.canBeClosed
            ? `<button type="button" class="ad-close-btn">
                <svg xmlns="http://www.w3.org/2000/svg" class="ad-close-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
              </button>`
            : ""
        }
      </div>
    </div>
  `;
}

function trackAdClick(ad, index) {
  if (typeof gtag !== "undefined") {
    gtag("event", "ad_click", {
      event_category: "Ads",
      event_label: ad.id,
      ad_id: ad.id,
      ad_title: ad.title,
      ad_description: ad.description,
      ad_link: ad.link,
      ad_position: index, // Useful if you track carousel/index
      timestamp: new Date().toISOString()
    });
  } else {
    console.warn("gtag not defined – ad click not tracked");
  }
}

function setupAdEventHandlers(ad, index) {
  const adLink = adContainer.querySelector(".ad-link");
  if (adLink) {
    adLink.addEventListener("click", () => trackAdClick(ad, index));
  }

  if (ad.canBeClosed) {
    const closeBtn = adContainer.querySelector(".ad-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const adElement = adContainer.querySelector(".ad-container");
        adElement.classList.add("fade-out");
        setTimeout(() => {
          adContainer.remove();
          clearInterval(rotationInterval);
        }, TRANSITION_DURATION);
      });
    }
  }
}

function renderAd(ad, index) {
  preloadImage(ad.imageUrl)
    .then(() => {
      adContainer.innerHTML = createAdHTML(ad);
      setupAdEventHandlers(ad, index);

      const newAdElement = adContainer.querySelector(".ad-container");
      newAdElement.offsetHeight;
      requestAnimationFrame(() => newAdElement.classList.add("show"));
    })
    .catch((error) => {
      console.error("Error preloading ad image:", error);
    });
}

function showNextAd(adsArray) {
  if (!adContainer || adsArray.length === 0) return;

  const currentAdElement = adContainer.querySelector(".ad-container");
  if (currentAdElement) {
    currentAdElement.classList.add("fade-out");
    setTimeout(() => {
      const ad = adsArray[currentAdIndex];
      renderAd(ad, currentAdIndex);
      currentAdIndex = (currentAdIndex + 1) % adsArray.length;
    }, TRANSITION_DURATION);
  } else {
    const ad = adsArray[currentAdIndex];
    renderAd(ad, currentAdIndex);
    currentAdIndex = (currentAdIndex + 1) % adsArray.length;
  }
}

function initAds() {
  remoteConfig.fetchAndActivate()
    .then(() => {
      try {
        const adsValue = remoteConfig.getValue("ads").asString();
        const adsArray = JSON.parse(adsValue);
        const adRotationTime = remoteConfig.getValue("adRotationInterval").asNumber();

        if (!document.getElementById("ad-container")) {
          adContainer = document.createElement("div");
          adContainer.id = "ad-container";
          document.body.appendChild(adContainer);
        } else {
          adContainer = document.getElementById("ad-container");
        }

        if (adsArray.length > 0) {
          preloadImage(adsArray[0].imageUrl)
            .then(() => {
              showNextAd(adsArray);
              rotationInterval = setInterval(() => showNextAd(adsArray), adRotationTime);
            })
            .catch((err) => {
              console.error("Image preload failed, still rotating:", err);
              showNextAd(adsArray);
              rotationInterval = setInterval(() => showNextAd(adsArray), adRotationTime);
            });
        } else {
          console.warn("No ads to show");
        }
      } catch (error) {
        console.error("Ad config parse error:", error);
      }
    })
    .catch((error) => {
      console.error("Failed to fetch remote config:", error);
    });
}

document.addEventListener("DOMContentLoaded", initAds);
