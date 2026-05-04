const LANG_KEY = "portfolioLang";
const CV_MODE_KEY = "portfolioCvMode";

let skillsPageIndex = 0;
let currentLanguage = localStorage.getItem(LANG_KEY) || "fr";

const navLinks = document.querySelector("#nav-links");
const menuButton = document.querySelector("#menu-btn");
const langFrBtn = document.querySelector("#lang-fr");
const langEnBtn = document.querySelector("#lang-en");
const themeButton = document.querySelector("#theme-toggle");
const scrollTopBtn = document.querySelector("#scroll-top-btn");

const iconSun =
  '<svg class="theme-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
const iconMoon =
  '<svg class="theme-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

const iconGithub =
  '<svg class="social-svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.44 7.86 10.94.58.11.79-.25.79-.56 0-.28-.01-1.02-.01-2.01-3.2.7-3.88-1.54-3.88-1.54-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.72 1.26 3.38.96.1-.75.41-1.26.74-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.47.11-3.06 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.8 0c2.22-1.5 3.2-1.18 3.2-1.18.63 1.59.23 2.77.12 3.06.75.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.4-5.26 5.68.42.36.8 1.08.8 2.18 0 1.57-.01 2.84-.01 3.23 0 .31.21.68.8.56A10.48 10.48 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>';

const iconLinkedin =
  '<svg class="social-svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.62 0 4.28 2.38 4.28 5.48v6.26ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45Z"/></svg>';

const getContent = () => {
  const locales = window.portfolioLocales || {};
  return locales[currentLanguage] || locales.fr;
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const getTheme = () => {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") {
    return attr;
  }
  try {
    return localStorage.getItem("theme") === "light" ? "light" : "dark";
  } catch (_) {
    return "dark";
  }
};

const THEME_CURTAIN_MS = 1050;
const THEME_VIEW_TRANSITION_MS = 980;

let themeTransitionActive = false;

const commitTheme = (normalized) => {
  document.documentElement.setAttribute("data-theme", normalized);
  document.body.setAttribute("data-theme", normalized);
  try {
    localStorage.setItem("theme", normalized);
  } catch (_) {
    /* ignore */
  }
  themeButton.innerHTML = normalized === "dark" ? iconSun : iconMoon;
  const c = getContent();
  const label = c?.ui
    ? normalized === "dark"
      ? c.ui.themeToLight
      : c.ui.themeToDark
    : "";
  if (label) {
    themeButton.setAttribute("aria-label", label);
    themeButton.title = label;
  }
};

const applyThemeVisual = (theme) => {
  commitTheme(theme === "light" ? "light" : "dark");
};

const playThemeCurtain = (nextTheme, originX, originY) => {
  const normalized = nextTheme === "light" ? "light" : "dark";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    commitTheme(normalized);
    return;
  }

  if (themeTransitionActive) {
    return;
  }

  // Prefer document view transitions when available: this animates
  // the whole page (text, buttons, cards), not only a color overlay.
  if (typeof document.startViewTransition === "function") {
    themeTransitionActive = true;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const dx = Math.max(originX, vw - originX);
    const dy = Math.max(originY, vh - originY);
    const radius = Math.ceil(Math.hypot(dx, dy));

    document.documentElement.style.setProperty("--theme-vt-x", `${originX}px`);
    document.documentElement.style.setProperty("--theme-vt-y", `${originY}px`);
    document.documentElement.style.setProperty("--theme-vt-r", `${radius}px`);
    document.documentElement.classList.add("theme-vt-active");
    document.documentElement.classList.toggle("theme-vt-to-light", normalized === "light");
    document.documentElement.classList.toggle("theme-vt-to-dark", normalized === "dark");

    const transition = document.startViewTransition(() => {
      commitTheme(normalized);
    });

    const cleanup = () => {
      document.documentElement.classList.remove("theme-vt-active", "theme-vt-to-light", "theme-vt-to-dark");
      document.documentElement.style.removeProperty("--theme-vt-x");
      document.documentElement.style.removeProperty("--theme-vt-y");
      document.documentElement.style.removeProperty("--theme-vt-r");
      themeTransitionActive = false;
    };

    transition.finished.then(cleanup).catch(cleanup);
    window.setTimeout(cleanup, THEME_VIEW_TRANSITION_MS + 240);
    return;
  }

  if (!CSS.supports?.("clip-path", "circle(1px at 1px 1px)")) {
    commitTheme(normalized);
    return;
  }

  themeTransitionActive = true;
  document.body.classList.add("theme-transition-running");

  const curtain = document.createElement("div");
  curtain.className = "theme-transition-curtain";
  curtain.setAttribute("data-incoming", normalized);
  curtain.setAttribute("role", "presentation");
  curtain.style.setProperty("--theme-ox", `${originX}px`);
  curtain.style.setProperty("--theme-oy", `${originY}px`);

  let finished = false;
  const finish = () => {
    if (finished) {
      return;
    }
    finished = true;
    window.clearTimeout(fallbackTimer);
    curtain.removeEventListener("transitionend", onTransitionEnd);
    commitTheme(normalized);
    curtain.remove();
    document.body.classList.remove("theme-transition-running");
    themeTransitionActive = false;
  };

  const onTransitionEnd = (event) => {
    if (event.target !== curtain) {
      return;
    }
    const pn = event.propertyName;
    if (pn !== "clip-path" && pn !== "-webkit-clip-path") {
      return;
    }
    finish();
  };

  const fallbackTimer = window.setTimeout(finish, THEME_CURTAIN_MS + 250);

  document.body.appendChild(curtain);
  curtain.addEventListener("transitionend", onTransitionEnd);

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      curtain.classList.add("is-open");
    });
  });
};

const syncLangSegments = () => {
  const isFr = currentLanguage === "fr";
  langFrBtn.classList.toggle("is-active", isFr);
  langEnBtn.classList.toggle("is-active", !isFr);
  langFrBtn.setAttribute("aria-pressed", isFr ? "true" : "false");
  langEnBtn.setAttribute("aria-pressed", (!isFr).toString());
  langFrBtn.closest(".segmented-lang")?.setAttribute("aria-label", getContent().ui.languageGroup);
};

const renderNav = () => {
  const c = getContent();
  navLinks.innerHTML = c.nav
    .map((item) => `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`)
    .join("");
};

const socialIconMarkup = (id) => {
  if (id === "linkedin") {
    return iconLinkedin;
  }
  return iconGithub;
};

const wireHeroCv = () => {
  const h = getContent().hero;
  const pdf = h.cv.pdfPath;
  const modeButton = document.getElementById("cv-mode-toggle");
  const link = document.getElementById("cv-main-link");
  const modeLabel = document.getElementById("cv-mode-label");
  const splitRoot = modeButton?.closest(".cv-split-btn");

  if (!modeButton || !link || !modeLabel) {
    return;
  }

  let mode = localStorage.getItem(CV_MODE_KEY) || "download";
  if (mode !== "download" && mode !== "open") {
    mode = "download";
  }

  const apply = () => {
    link.href = pdf;
    if (mode === "download") {
      link.setAttribute("download", h.cv.downloadFileName || "CV.pdf");
      link.removeAttribute("target");
      link.removeAttribute("rel");
      link.textContent = h.cv.ctaDownload;
      modeLabel.textContent = h.cv.segmentDownload;
      modeButton.setAttribute("aria-label", h.cv.segmentOpen);
      modeButton.title = h.cv.segmentOpen;
    } else {
      link.removeAttribute("download");
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
      link.textContent = h.cv.ctaOpen;
      modeLabel.textContent = h.cv.segmentOpen;
      modeButton.setAttribute("aria-label", h.cv.segmentDownload);
      modeButton.title = h.cv.segmentDownload;
    }
    modeButton.classList.toggle("is-open-mode", mode === "open");
    splitRoot?.classList.toggle("is-view-mode", mode === "open");
  };

  modeButton.onclick = () => {
    mode = mode === "download" ? "open" : "download";
    localStorage.setItem(CV_MODE_KEY, mode);
    apply();
  };
  apply();
};

const renderHero = () => {
  const h = getContent().hero;
  document.querySelector("#hero-kicker").textContent = h.kicker;
  document.querySelector("#hero-title").innerHTML =
    `${escapeHtml(h.titleBeforeAccent)}<span class="accent">${escapeHtml(h.titleAccent)}</span>.`;
  document.querySelector("#hero-text").textContent = h.text;

  const socialHtml = (h.social || [])
    .map((s) => {
      const icon = socialIconMarkup(s.id);
      return `<a class="btn btn-social" href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(s.ariaLabel)}">${icon}</a>`;
    })
    .join("");

  const contact = h.contactCta;
  document.querySelector("#hero-actions").innerHTML = `
    <div class="hero-actions-inner">
      <a class="btn btn-primary" href="${escapeHtml(contact.href)}">${escapeHtml(contact.label)}</a>
      <div class="hero-social-row" aria-label="${escapeHtml(h.socialGroupAria || "")}">
        ${socialHtml}
      </div>
      <div class="hero-cv-block" aria-label="${escapeHtml(h.cvGroupAria || "")}">
        <div class="cv-split-btn" role="group" aria-label="${escapeHtml(h.cv.modeGroupAria || "")}">
          <a class="btn btn-ghost hero-cv-link" href="#" id="cv-main-link">CV</a>
          <button type="button" class="cv-mode-toggle" id="cv-mode-toggle">
            <span id="cv-mode-label"></span>
          </button>
        </div>
      </div>
    </div>
  `;
  wireHeroCv();
};

const renderAbout = () => {
  const section = getContent().sections.about;
  const el = document.querySelector(`#${section.id}`);
  const interests = Array.isArray(section.interests) ? section.interests : [];
  const interestsStrip =
    interests.length > 0
      ? `
    <div class="about-interests">
      <h3 class="about-interests-title">${escapeHtml(section.interestsTitle || "")}</h3>
      ${
        section.interestsCaption
          ? `<p class="about-interests-caption">${escapeHtml(section.interestsCaption)}</p>`
          : ""
      }
      <div class="interests-strip-wrap">
        <div
          class="interests-strip interests-strip--${interests.length}"
          role="group"
          aria-label="${escapeHtml(section.interestsAria || "")}"
        >
          ${interests
            .map((item, i) => {
              const label = item.label || "";
              const alt = item.alt || label;
              const style = `--img: url(${JSON.stringify(item.image)})`;
              return `<div
                class="interest-box box-${i + 1}"
                style="${escapeHtml(style)}"
                data-text="${escapeHtml(label)}"
                role="img"
                aria-label="${escapeHtml(alt)}"
                tabindex="0"
              ></div>`;
            })
            .join("")}
        </div>
      </div>
    </div>
  `
      : "";

  el.innerHTML = `
    <h2 class="section-title-centered">${escapeHtml(section.title)}</h2>
    <p class="about-intro">${escapeHtml(section.intro)}</p>
    <div class="about-layout">
      <div class="about-profile">
        ${section.cards
          .map(
            (card) => `
            <article class="card tilt-card about-profile-card">
              <h3>${escapeHtml(card.title)}</h3>
              <ul>${card.list.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
            </article>
          `
          )
          .join("")}
      </div>
      ${interestsStrip}
    </div>
  `;
};

function buildRadarMarkup(data, svgSize = 300, maxInnerR = 95) {
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const n = data.length;
  const levels = [20, 40, 60, 80];
  let circlesSvg = "";
  levels.forEach((lvl) => {
    const rr = (lvl / 100) * maxInnerR;
    circlesSvg += `<circle class="radar-grid-ring" cx="${cx}" cy="${cy}" r="${rr.toFixed(2)}" />`;
  });

  const pointStr = data
    .map((item, i) => {
      const angle = -Math.PI / 2 + (i * (2 * Math.PI)) / n;
      const r = (item.value / 100) * maxInnerR;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  let labelsSvg = "";
  data.forEach((item, i) => {
    const angle = -Math.PI / 2 + (i * (2 * Math.PI)) / n;
    const lr = maxInnerR + 24;
    const lx = cx + lr * Math.cos(angle);
    const ly = cy + lr * Math.sin(angle);
    const anchor =
      Math.abs(Math.cos(angle)) < 0.2 ? "middle" : Math.cos(angle) > 0 ? "start" : "end";
    const dy = Math.sin(angle) > 0.55 ? "0.35em" : Math.sin(angle) < -0.55 ? "-0.35em" : "0.35em";
    labelsSvg += `<text class="radar-label" text-anchor="${anchor}" dominant-baseline="middle" transform="translate(${lx.toFixed(2)}, ${ly.toFixed(2)})" dy="${dy}">${escapeHtml(item.label)}</text>`;
  });

  const axisLines = data
    .map((_, i) => {
      const angle = -Math.PI / 2 + (i * (2 * Math.PI)) / n;
      const xe = cx + maxInnerR * Math.cos(angle);
      const ye = cy + maxInnerR * Math.sin(angle);
      return `<line class="radar-axis" x1="${cx}" y1="${cy}" x2="${xe.toFixed(2)}" y2="${ye.toFixed(2)}" />`;
    })
    .join("");

  return `
    <svg class="radar-chart" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}" role="img" aria-hidden="true">
      ${circlesSvg}
      ${axisLines}
      <polygon class="radar-shape" fill="currentColor" points="${pointStr}" />
      ${labelsSvg}
    </svg>
  `;
}

const observeSkillAnimations = (sectionId) => {
  const root = document.querySelector(`#${sectionId}`);
  if (!root) {
    return;
  }
  const prevKey = `__skillObs_${sectionId}`;
  if (globalThis[prevKey]) {
    globalThis[prevKey].disconnect();
  }
  const fillBars = () => {
    root.querySelectorAll(".skill-bar-card").forEach((card) => {
      const p = parseInt(card.dataset.skillPercent || "0", 10);
      const span = card.querySelector(".skill-progress-fill");
      if (span) {
        span.style.width = `${p}%`;
      }
    });
    const radarShape = root.querySelector(".radar-shape");
    if (radarShape) {
      radarShape.classList.add("radar-shape-visible");
    }
  };

  if (!("IntersectionObserver" in window)) {
    fillBars();
    return;
  }

  const obs = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fillBars();
          observer.disconnect();
          globalThis[prevKey] = undefined;
        }
      });
    },
    { threshold: 0.2 }
  );
  globalThis[prevKey] = obs;
  obs.observe(root);
};

const renderSkillCards = () => {
  const section = getContent().sections.skills;
  const pages = section.pages;
  if (!pages?.length) {
    return;
  }
  skillsPageIndex = Math.max(0, Math.min(skillsPageIndex, pages.length - 1));
  const page = pages[skillsPageIndex];
  const bars = page.items.map((bar) => ({
    emoji: escapeHtml(bar.iconEmoji),
    label: bar.label,
    percent: bar.value
  }));

  const radarData = page.items.map((item) => ({ label: item.label, value: item.value }));

  const title = escapeHtml(section.title);
  const subMain = escapeHtml(section.leftCaption);
  const subRadar = escapeHtml(section.rightCaption);
  const carousel =
    pages.length > 1
      ? `
    <div class="skills-carousel" role="group" aria-label="Pagination competences">
      <button type="button" class="carousel-nav-btn" data-skill-nav="-1" aria-label="${escapeHtml(
        section.carouselPrev
      )}">‹</button>
      <div class="carousel-dots">
        ${pages
          .map((_, i) =>
            `<button type="button" class="carousel-dot${i === skillsPageIndex ? " is-active" : ""}" data-skill-dot="${i}" aria-label="Page ${i + 1}/${pages.length}" aria-current="${i === skillsPageIndex ? "step" : "false"}"></button>`.trim()
          )
          .join("")}
      </div>
      <button type="button" class="carousel-nav-btn" data-skill-nav="1" aria-label="${escapeHtml(
        section.carouselNext
      )}">›</button>
    </div>
  `
      : "";

  document.querySelector(`#${section.id}`).innerHTML = `
    <h2 class="section-title-centered">${title}</h2>
    ${pages.length > 1 ? `<p class="skills-page-indicator">${escapeHtml(page.label)}</p>` : ""}
    <div class="skills-layout">
      <div class="skills-col skills-col-main">
        <p class="skills-col-title">${subMain}</p>
        <div class="skill-bars-stack">
          ${bars
            .map(
              (bar) => `
            <article class="skill-bar-card card" data-skill-percent="${bar.percent}">
              <div class="skill-bar-top">
                <span class="skill-bar-icon">${bar.emoji}</span>
                <span class="skill-bar-name">${escapeHtml(bar.label)}</span>
                <span class="skill-bar-pct">${bar.percent}%</span>
              </div>
              <div class="skill-progress-track"><span class="skill-progress-fill" style="width:0%"></span></div>
            </article>`
            )
            .join("")}
        </div>
        ${carousel}
      </div>
      <div class="skills-col skills-col-radar card">
        <p class="skills-col-title">${subRadar}</p>
        <div class="radar-wrap">${buildRadarMarkup(radarData)}</div>
      </div>
    </div>
  `;

  observeSkillAnimations(section.id);
};

function initSkillsDelegation() {
  if (globalThis.portfolioSkillsDelegation) {
    return;
  }
  globalThis.portfolioSkillsDelegation = true;
  document.body.addEventListener("click", (e) => {
    const root = document.getElementById("competences");
    if (!root || !root.contains(e.target)) {
      return;
    }

    const section = window.portfolioLocales?.[currentLanguage]?.sections?.skills;
    if (!section?.pages?.length) {
      return;
    }

    const n = section.pages.length;
    if (n <= 1) {
      return;
    }

    const navBtn = e.target.closest("[data-skill-nav]");
    if (navBtn) {
      const dir = parseInt(navBtn.getAttribute("data-skill-nav") || "0", 10);
      skillsPageIndex = (skillsPageIndex + dir + n) % n;
      renderSkillCards();
      return;
    }

    const dotBtn = e.target.closest("[data-skill-dot]");
    if (dotBtn && dotBtn.hasAttribute("data-skill-dot")) {
      const idx = parseInt(dotBtn.getAttribute("data-skill-dot") || "0", 10);
      if (!Number.isNaN(idx) && idx >= 0 && idx < n) {
        skillsPageIndex = idx;
        renderSkillCards();
      }
    }
  });
}

const renderProject = () => {
  const section = getContent().sections.project;
  document.querySelector(`#${section.id}`).innerHTML = `
    <h2 class="section-title-centered">${escapeHtml(section.title)}</h2>
    <article class="card">
      <span class="timeline-date">${escapeHtml(section.date)}</span>
      <h3>${escapeHtml(section.cardTitle)}</h3>
      <p>${escapeHtml(section.text)}</p>
    </article>
  `;
};

const renderTimelineSection = (sectionData) => {
  document.querySelector(`#${sectionData.id}`).innerHTML = `
    <h2 class="section-title-centered">${escapeHtml(sectionData.title)}</h2>
    <div class="timeline">
      ${sectionData.items
        .map(
          (item) => `
            <article class="timeline-item card">
              <span class="timeline-date">${escapeHtml(item.date)}</span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text)}</p>
            </article>
          `
        )
        .join("")}
    </div>
  `;
};

const renderContact = () => {
  const section = getContent().sections.contact;
  const honeypot = escapeHtml(section.honeypotLabel || "");

  document.querySelector(`#${section.id}`).innerHTML = `
    <h2 class="section-title-centered">${escapeHtml(section.title)}</h2>
    <p>${escapeHtml(section.intro)}</p>
    <div class="contact-shell">
      <div class="contact-links-row">
      ${section.links
        .map((link) => `<a class="contact-link card" href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`)
        .join("")}
      </div>
      <form class="contact-form card" id="contact-form" novalidate>
        <div class="form-row two">
          <label class="field">
            <span>${escapeHtml(section.labels.name)}</span>
            <input type="text" name="name" required autocomplete="name" placeholder="${escapeHtml(
              section.placeholders.name
            )}" />
          </label>
          <label class="field">
            <span>${escapeHtml(section.labels.email)}</span>
            <input type="email" name="email" required autocomplete="email" placeholder="${escapeHtml(
              section.placeholders.email
            )}" />
          </label>
        </div>
        <label class="field">
          <span>${escapeHtml(section.labels.subject)}</span>
          <input type="text" name="subject" required placeholder="${escapeHtml(
            section.placeholders.subject
          )}" />
        </label>
        <label class="field">
          <span>${escapeHtml(section.labels.message)}</span>
          <textarea name="message" rows="5" required placeholder="${escapeHtml(
            section.placeholders.message
          )}"></textarea>
        </label>
        <p class="honeypot" aria-hidden="true">
          <label>${honeypot} <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" /></label>
        </p>
        <button type="submit" class="btn btn-primary contact-submit">${escapeHtml(section.labels.submit)}</button>
        <p class="contact-form-status visually-hidden" id="contact-status" aria-live="polite"></p>
      </form>
    </div>
  `;

  wireContactForm(section);
};

const wireContactForm = (section) => {
  const form = document.querySelector("#contact-form");
  if (!form) {
    return;
  }

  const status = document.querySelector("#contact-status");
  const ui = getContent().ui;

  form.addEventListener("submit", async (event) => {
    const honeypot = form.querySelector('input[name="_gotcha"]');
    if (honeypot?.value) {
      event.preventDefault();
      return;
    }

    const endpoint = section.formActionUrl?.trim();
    if (endpoint) {
      event.preventDefault();
      const fd = new FormData(form);
      fd.append("_replyto", String(fd.get("email") || ""));
      fd.append("_subject", String(fd.get("subject") || "Contact portfolio"));

      status.classList.remove("visually-hidden");
      status.textContent = "";

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: fd
        });
        if (res.ok) {
          status.textContent = section.successMessage;
          form.reset();
        } else {
          status.textContent = ui.formErrorSend;
        }
      } catch (_) {
        status.textContent = ui.formErrorNetwork;
      }
      return;
    }

    event.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const subject = String(fd.get("subject") || "").trim();
    const message = String(fd.get("message") || "").trim();
    const to = section.mailtoRecipient || "";

    status.classList.remove("visually-hidden");
    status.textContent = "";

    const introTpl =
      typeof section.mailtoBodyIntro === "string"
        ? section.mailtoBodyIntro
        : "Message from {name} ({email}) :\n\n";
    const intro = introTpl.replaceAll("{name}", name).replaceAll("{email}", email);
    const bodyParts = intro + message;
    const mailtoHref = `mailto:${to}?subject=${encodeURIComponent(subject || "Contact portfolio")}&body=${encodeURIComponent(bodyParts)}`;

    window.location.href = mailtoHref;
    status.textContent = section.fallbackHint;
  });
};

const renderFooter = () => {
  const c = getContent();
  const year = new Date().getFullYear();
  document.querySelector("#footer-text").textContent =
    `${String.fromCharCode(169)} ${year} ${c.identity.fullName}. ${c.ui.footerRights}`;
};

const attachScrollTop = () => {
  const aria = getContent().ui.scrollTop;
  scrollTopBtn.setAttribute("aria-label", aria);
  scrollTopBtn.title = aria;

  if (!window.portfolioScrollTopInit) {
    window.portfolioScrollTopInit = true;
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    const toggle = () => {
      scrollTopBtn.classList.toggle("is-visible", window.scrollY > 420);
    };
    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
  }
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 }
);

let portfolioNavDelegation = false;

const attachDynamicEvents = async () => {
  if (!portfolioNavDelegation) {
    portfolioNavDelegation = true;
    navLinks.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        navLinks.classList.remove("is-open");
      }
    });
  }

  const tiltCards = document.querySelectorAll(".tilt-card");
  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = -((y - rect.height / 2) / 22);
      const rotateY = (x - rect.width / 2) / 22;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    });
  });

  const revealElements = document.querySelectorAll(".reveal");
  revealObserver.disconnect();
  revealElements.forEach((el) => revealObserver.observe(el));

  attachScrollTop();
};

const renderAll = async () => {
  document.documentElement.lang = currentLanguage === "fr" ? "fr" : "en";

  const c = getContent();
  document.querySelector("#brand-short").textContent = c.identity.shortBrand;
  menuButton.textContent = c.ui.menu;

  syncLangSegments();
  applyThemeVisual(getTheme());

  renderNav();
  renderHero();
  renderAbout();
  initSkillsDelegation();
  renderSkillCards();
  renderProject();
  renderTimelineSection(c.sections.experience);
  renderTimelineSection(c.sections.education);
  renderContact();
  renderFooter();

  await attachDynamicEvents();
};

menuButton.addEventListener("click", () => {
  navLinks.classList.toggle("is-open");
});

langFrBtn.addEventListener("click", async () => {
  if (currentLanguage === "fr") {
    return;
  }
  currentLanguage = "fr";
  localStorage.setItem(LANG_KEY, "fr");
  await renderAll();
});

langEnBtn.addEventListener("click", async () => {
  if (currentLanguage === "en") {
    return;
  }
  currentLanguage = "en";
  localStorage.setItem(LANG_KEY, "en");
  await renderAll();
});

themeButton.addEventListener("click", (event) => {
  const next = getTheme() === "dark" ? "light" : "dark";
  const rect = themeButton.getBoundingClientRect();
  const x = Number.isFinite(event.clientX) ? event.clientX : rect.left + rect.width / 2;
  const y = Number.isFinite(event.clientY) ? event.clientY : rect.top + rect.height / 2;
  playThemeCurtain(next, x, y);
});

renderAll();
