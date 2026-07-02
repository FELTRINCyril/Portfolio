/* =========================================================================
   Portfolio - Cyril Feltrin (v3.1)
   Rendu depuis data.js, i18n FR/EN, theme, effets fideles a la reference :
   nom SVG anime, particules, timeline scroll, reveal scroll-linked, etc.
   ========================================================================= */
(function () {
  "use strict";

  var D = window.portfolioData;
  var LANG_KEY = "portfolioLang";
  var THEME_KEY = "theme";
  var lang = getLang();
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var typeTimer = null;
  var srNodes = [];
  var railEl = null;

  function getLang() { try { return localStorage.getItem(LANG_KEY) === "en" ? "en" : "fr"; } catch (e) { return "fr"; } }
  function t(f) { return f && typeof f === "object" && ("fr" in f || "en" in f) ? (f[lang] != null ? f[lang] : f.fr) : f; }
  function age() { var b = new Date(D.identity.birthdate + "T00:00:00"), n = new Date(), a = n.getFullYear() - b.getFullYear(), m = n.getMonth() - b.getMonth(); if (m < 0 || (m === 0 && n.getDate() < b.getDate())) a--; return a; }
  function fill(s) { return String(s).replace("{age}", age()); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { if (k === "class") e.className = attrs[k]; else if (k === "html") e.innerHTML = attrs[k]; else e.setAttribute(k, attrs[k]); });
    if (html != null) e.innerHTML = html;
    return e;
  }
  // Marque un element pour le reveal (one-shot ; le CSS gere l'etat initial)
  function sr(node, variant) { node.classList.add("sr"); node.setAttribute("data-sr", variant || "fade-up"); return node; }

  var ICON = {
    github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.8 18.3 5.1 18.3 5.1c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5Z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.7-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM7.1 20.4H3.5V9h3.6v11.4ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7m0 0H8m9 0v9"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m0 0-6-6m6 6-6 6"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21a8 8 0 1 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg>',
    folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/></svg>',
    erp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8 8-4 4 4 4M16 8l4 4-4 4M13 5l-2 14"/></svg>',
    db: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg>',
    cap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 22V4m0 0 2.5 1.5H16l-1.5 4L16 13H6.5L4 11.5"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h18M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16M15 21V9h3a1 1 0 0 1 1 1v11"/><path d="M8 7h1m-1 4h1m-1 4h1"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M4.5 4.5l1.4 1.4M18.1 18.1l1.4 1.4M2.5 12h2M19.5 12h2M4.5 19.5l1.4-1.4M18.1 5.9l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8Z"/></svg>'
  };

  /* ---------- Header + nav ---------- */
  function renderHeader() {
    document.getElementById("footer-brand").textContent = D.identity.shortBrand;
    var ul = document.getElementById("nav-links");
    var mob = document.getElementById("mobile-links");
    ul.innerHTML = ""; mob.innerHTML = "";
    D.nav.forEach(function (n) {
      var li = el("li");
      li.appendChild(el("a", { href: n.href }, esc(t(n.label))));
      ul.appendChild(li);
      var mli = el("li");
      mli.appendChild(el("a", { href: n.href, html: ICON.arrow + "<span>" + esc(t(n.label)) + "</span>" }));
      mob.appendChild(mli);
    });
  }

  /* ---------- Hero ---------- */
  function renderHero() {
    var h = D.home;
    document.getElementById("home-status-text").textContent = t(h.status);
    var k = esc(t(h.kicker)).replace(/^\/\//, '<span class="sl">//</span>');
    document.getElementById("home-kicker").innerHTML = k;
    document.getElementById("name-stroke").textContent = h.name;
    document.getElementById("name-fill").textContent = h.name;
    document.getElementById("home-name-sr").textContent = h.name;
    fitNameSvg();
    document.getElementById("home-tagline").textContent = fill(t(h.tagline));
    document.getElementById("scroll-cue-text").textContent = t(h.scroll);

    var actions = document.getElementById("home-actions");
    actions.innerHTML = "";
    actions.appendChild(el("a", { class: "btn btn-primary magnetic", href: h.ctaPrimary.href }, ICON.user + "<span>" + esc(t(h.ctaPrimary.label)) + "</span>"));
    actions.appendChild(el("a", { class: "btn btn-ghost magnetic", href: h.ctaSecondary.href }, ICON.eye + "<span>" + esc(t(h.ctaSecondary.label)) + "</span>"));

    startTyping(h.titles[lang] || h.titles.fr);
  }
  // Ajuste le viewBox du nom SVG a la largeur reelle du texte (evite tout debordement)
  function fitNameSvg() {
    var svg = document.getElementById("hero-name-svg"), f = document.getElementById("name-fill"), s = document.getElementById("name-stroke");
    if (!svg || !f) return;
    [f, s].forEach(function (n) { n.removeAttribute("textLength"); n.removeAttribute("lengthAdjust"); });
    try {
      var w = f.getComputedTextLength();
      if (w > 0) svg.setAttribute("viewBox", "0 0 " + Math.ceil(w + 6) + " 172");
    } catch (e) {}
  }

  function startTyping(titles) {
    var target = document.getElementById("home-role");
    if (typeTimer) { clearTimeout(typeTimer); typeTimer = null; }
    if (reduceMotion) { target.textContent = titles[0]; return; }
    var i = 0, pos = 0, del = false;
    (function step() {
      var full = titles[i];
      target.textContent = full.slice(0, pos);
      if (!del && pos < full.length) { pos++; typeTimer = setTimeout(step, 65); }
      else if (!del && pos === full.length) { del = true; typeTimer = setTimeout(step, 1600); }
      else if (del && pos > 0) { pos--; typeTimer = setTimeout(step, 30); }
      else { del = false; i = (i + 1) % titles.length; typeTimer = setTimeout(step, 320); }
    })();
  }

  /* ---------- Stats ---------- */
  function renderStats() {
    var grid = document.getElementById("stats-grid");
    grid.innerHTML = "";
    D.home.stats.forEach(function (s) {
      var cell = el("div", { class: "stat" });
      cell.appendChild(el("div", { class: "stat-value grad", "data-val": s.value, "data-suffix": s.suffix || "" }, "0"));
      cell.appendChild(el("div", { class: "stat-label" }, esc(t(s.label))));
      grid.appendChild(cell);
    });
  }
  function countUp() {
    document.querySelectorAll(".stat-value").forEach(function (node) {
      if (node.dataset.done) return; node.dataset.done = "1";
      var target = parseInt(node.getAttribute("data-val"), 10) || 0, suffix = node.getAttribute("data-suffix") || "";
      if (reduceMotion) { node.textContent = target + suffix; return; }
      var start = null;
      requestAnimationFrame(function f(ts) { if (!start) start = ts; var p = Math.min((ts - start) / 1300, 1); node.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target) + suffix; if (p < 1) requestAnimationFrame(f); });
    });
  }

  /* ---------- Section head ---------- */
  function head(s, centered) {
    var h = el("div", { class: "section-head" });
    h.appendChild(el("p", { class: "eyebrow" }, esc(t(s.eyebrow))));
    var title = t(s.title), sp = title.indexOf(" ");
    h.appendChild(el("h2", { class: "section-title", id: s.id + "-title" },
      sp > 0 ? '<span class="grad">' + esc(title.slice(0, sp)) + "</span>" + esc(title.slice(sp)) : '<span class="grad">' + esc(title) + "</span>"));
    if (centered && s.intro) h.appendChild(el("p", { class: "section-intro" }, esc(fill(t(s.intro)))));
    return sr(h, "fade-up");
  }
  function slug(text) { return el("span", { class: "section-slug", "aria-hidden": "true" }, esc(text)); }

  /* ---------- About ---------- */
  function renderAbout() {
    var s = D.sections.about, sec = document.getElementById("a-propos");
    sec.innerHTML = "";
    sec.appendChild(slug(t(s.eyebrow)));
    sec.appendChild(head(s, false));

    var grid = el("div", { class: "about-grid" });

    var media = sr(el("div", { class: "about-media" }), "slide-left");
    media.appendChild(el("img", { src: s.photo, alt: t(s.photoAlt), width: "813", height: "1400", loading: "lazy" }));
    var tag = el("div", { class: "about-tag" });
    var tinfo = el("div"); tinfo.appendChild(el("b", null, esc(D.identity.fullName))); tinfo.appendChild(el("span", null, esc(t(D.identity.location))));
    tag.appendChild(tinfo);
    tag.appendChild(el("small", null, "● " + esc(t(s.available))));
    media.appendChild(tag);

    var body = el("div", { class: "about-body" });
    body.appendChild(sr(el("div", { class: "about-copy", html: fill(t(s.bio || s.intro)) }), "fade-up"));

    var hls = sr(el("div", { class: "about-highlights" }), "fade-up");
    s.highlights.forEach(function (h2) {
      var card = el("div", { class: "hl" });
      card.appendChild(el("div", { class: "hl-ic", html: ICON[h2.icon] || ICON.code }));
      card.appendChild(el("b", null, esc(t(h2.title))));
      card.appendChild(el("span", null, esc(t(h2.sub))));
      card.addEventListener("mousemove", glow);
      hls.appendChild(card);
    });
    body.appendChild(hls);

    var acts = sr(el("div", { class: "about-actions" }), "fade-up");
    acts.appendChild(buildCvToggle());
    acts.appendChild(el("a", { class: "btn btn-ghost magnetic", href: "#contact" }, ICON.mail + "<span>" + (lang === "en" ? "Contact me" : "Me contacter") + "</span>"));
    body.appendChild(acts);

    grid.appendChild(media);
    grid.appendChild(body);
    sec.appendChild(grid);
  }

  function renderInterests() {
    var s = D.sections.about, sec = document.getElementById("interets");
    sec.innerHTML = "";
    sec.appendChild(sr(el("h3", { class: "interests-title", id: "interets-title" }, esc(t(s.interestsTitle))), "fade-up"));
    var gal = sr(el("div", { class: "interests" }), "fade-up");
    s.interests.forEach(function (it) {
      var cell;
      if (it.image) { cell = el("div", { class: "interest" }); cell.appendChild(el("img", { src: it.image, alt: t(it.alt || it.label), loading: "lazy" })); cell.appendChild(el("div", { class: "interest-cap" }, esc(t(it.label)))); }
      else { cell = el("div", { class: "interest no-image" }); var cap = el("div", { class: "interest-cap" }); cap.appendChild(el("span", { class: "interest-emoji" }, it.emoji || "★")); var lab = el("div", null, esc(t(it.label))); if (it.note) lab.appendChild(el("small", null, esc(t(it.note)))); cap.appendChild(lab); cell.appendChild(cap); }
      gal.appendChild(cell);
    });
    sec.appendChild(gal);
  }
  function glow(e) { var r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--mx", (e.clientX - r.left) + "px"); e.currentTarget.style.setProperty("--my", (e.clientY - r.top) + "px"); }

  // Bouton CV unique : bascule Voir <-> Telecharger (gagne de la place)
  function buildCvToggle() {
    var mode = "view";
    var group = el("div", { class: "cv-group magnetic" });
    var main = el("button", { type: "button", class: "cv-main" });
    var sw = el("button", { type: "button", class: "cv-switch" });
    function paint() {
      if (mode === "view") { main.innerHTML = ICON.eye + "<span>" + esc(t(D.ui.cvView)) + "</span>"; sw.innerHTML = ICON.download; sw.title = t(D.ui.cvDownload); sw.setAttribute("aria-label", t(D.ui.cvDownload)); }
      else { main.innerHTML = ICON.download + "<span>" + esc(t(D.ui.cvDownload)) + "</span>"; sw.innerHTML = ICON.eye; sw.title = t(D.ui.cvView); sw.setAttribute("aria-label", t(D.ui.cvView)); }
    }
    main.addEventListener("click", function () {
      if (mode === "view") { window.open(D.ui.cvPath, "_blank", "noopener"); }
      else { var a = el("a", { href: D.ui.cvPath, download: D.ui.cvFileName }); document.body.appendChild(a); a.click(); a.remove(); }
    });
    sw.addEventListener("click", function () { mode = mode === "view" ? "download" : "view"; paint(); });
    paint();
    group.appendChild(main); group.appendChild(sw);
    return group;
  }

  function initials(org) {
    var parts = String(org).trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  /* ---------- Experience (timeline zig-zag) ---------- */
  function renderExperience() {
    var s = D.sections.experience, sec = document.getElementById("experience");
    sec.innerHTML = "";
    sec.appendChild(slug(t(s.eyebrow)));
    sec.appendChild(head(s, true));

    var tl = el("div", { class: "xp-timeline" });
    railEl = el("div", { class: "xp-rail", id: "xp-rail", "aria-hidden": "true" });
    tl.appendChild(railEl);
    var ol = el("ol", { class: "xp-items" });
    s.items.forEach(function (x, i) {
      var side = i % 2 === 0 ? "left" : "right";
      var li = el("li", { class: "xp-item " + side });
      var cw = el("div", { class: "xp-cw" });
      var content = el("div", { class: "xp-content" });
      content.appendChild(el("div", { class: "xp-date" }, esc(t(x.date))));
      content.appendChild(el("h3", { class: "xp-role" }, esc(t(x.role))));
      content.appendChild(el("p", { class: "xp-co" }, esc(x.org) + (x.place ? " · " + esc(t(x.place)) : "")));
      content.appendChild(el("p", { class: "xp-desc" }, esc(t(x.text))));
      if (x.tech && x.tech.length) { var tc = el("div", { class: "xp-tech" }); x.tech.forEach(function (tg) { tc.appendChild(el("span", { class: "chip" }, esc(tg))); }); content.appendChild(tc); }
      content.appendChild(el("span", { class: "xp-more", html: "<span>" + esc(t(D.ui.xpDetails)) + "</span>" + ICON.arrowRight }));
      content.setAttribute("role", "button");
      content.setAttribute("tabindex", "0");
      content.addEventListener("mousemove", glow);
      (function (item) {
        content.addEventListener("click", function () { openXpModal(item); });
        content.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openXpModal(item); } });
      })(x);
      // reveal : glisse depuis le cote du bloc (le CSS force "depuis la droite" en mobile)
      sr(cw, side === "left" ? "slide-left" : "slide-right");
      cw.appendChild(content);
      li.appendChild(cw);
      var dot = el("div", { class: "xp-dot", "aria-hidden": "true" }, esc(initials(x.org)));
      li.appendChild(dot);
      ol.appendChild(li);
    });
    tl.appendChild(ol);
    var end = el("div", { class: "xp-end" });
    end.appendChild(el("span", { class: "xp-end-dot", html: ICON.flag }));
    tl.appendChild(end);
    sec.appendChild(tl);

    sec.appendChild(sr(el("p", { class: "edu-title" }, esc(t(s.educationTitle))), "fade-up"));
    var eg = sr(el("div", { class: "edu-grid" }), "fade-up");
    s.education.forEach(function (e2) {
      var c = el("div", { class: "edu-card" });
      c.appendChild(el("span", { class: "edu-tag" }, esc(t(e2.tag))));
      c.appendChild(el("p", { class: "edu-date" }, esc(t(e2.date))));
      c.appendChild(el("h3", null, esc(t(e2.title))));
      c.appendChild(el("p", { class: "edu-org" }, esc(t(e2.org))));
      c.appendChild(el("p", null, esc(t(e2.text))));
      eg.appendChild(c);
    });
    sec.appendChild(eg);
  }

  /* ---------- Projects ---------- */
  function renderProjects() {
    var s = D.sections.projects, sec = document.getElementById("projets");
    sec.innerHTML = "";
    sec.appendChild(slug(t(s.eyebrow)));
    sec.appendChild(head(s, true));
    var grid = el("div", { class: "projects-grid" });
    s.items.forEach(function (p) {
      var card = sr(el("article", { class: "project" + (p.featured ? " featured" : "") }), "fade-up");
      var media = p.image ? el("div", { class: "project-media" }) : el("div", { class: "project-media placeholder", html: ICON.folder });
      if (p.image) media.appendChild(el("img", { src: p.image, alt: t(p.title), loading: "lazy" }));
      card.appendChild(media);
      var body = el("div", { class: "project-body" });
      var top = el("div", { class: "project-top" });
      top.appendChild(el("h3", null, esc(t(p.title))));
      if (p.date) top.appendChild(el("span", { class: "year-badge" }, esc(p.date)));
      body.appendChild(top);
      body.appendChild(el("p", null, esc(t(p.text))));
      if (p.tags) { var tags = el("div", { class: "tags" }); p.tags.forEach(function (tg) { tags.appendChild(el("span", { class: "tag" }, esc(tg))); }); body.appendChild(tags); }
      if (p.link) body.appendChild(el("a", { class: "project-link", href: p.link.href, target: "_blank", rel: "noopener" }, esc(t(p.link.label)) + ICON.arrow));
      card.appendChild(body);
      grid.appendChild(card);
    });
    sec.appendChild(grid);
  }

  /* ---------- Skills (tuiles-logos + radars par categorie) ---------- */
  function iconImg(name, size, accent) {
    // icones monochromes (ph:, simple-icons:) -> colorees en violet pour rester visibles sur tout fond
    var mono = accent || name.indexOf("simple-icons:") === 0 || name.indexOf("ph:") === 0;
    var url = "https://api.iconify.design/" + name + ".svg" + (mono ? "?color=%238b5cf6" : "");
    return '<img src="' + url + '" width="' + size + '" height="' + size + '" alt="" loading="lazy" ' +
      'onerror="this.style.display=\'none\';if(this.nextElementSibling)this.nextElementSibling.style.display=\'grid\'">';
  }
  function initials2(l) { return String(l).replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase(); }
  function buildTile(item) {
    var tile = el("div", { class: "skill-tile", title: item.label });
    var inner = el("div", { class: "skill-tile-inner" });
    var front = el("div", { class: "skill-tile-front" });
    front.innerHTML = iconImg(item.icon, 34, false) + '<span class="tile-fallback" style="display:none">' + esc(initials2(item.label)) + "</span>";
    var back = el("div", { class: "skill-tile-back" });
    back.appendChild(el("span", { class: "tile-name" }, esc(item.label)));
    var dots = el("span", { class: "tile-dots" });
    var filled = Math.round(item.value / 20);
    for (var d = 0; d < 5; d++) dots.appendChild(el("span", { class: "tile-dot" + (d < filled ? " on" : "") }));
    back.appendChild(dots);
    inner.appendChild(front); inner.appendChild(back);
    tile.appendChild(inner);
    return tile;
  }
  function renderSkills() {
    var s = D.sections.skills, sec = document.getElementById("competences");
    sec.innerHTML = "";
    sec.appendChild(slug(t(s.eyebrow)));
    sec.appendChild(head(s, true));

    var groups = el("div", { class: "skill-groups" });
    s.categories.forEach(function (cat) {
      var card = sr(el("article", { class: "skill-card" }), "scale");
      var h = el("div", { class: "skill-card-head" });
      h.appendChild(el("span", { class: "skill-card-ic", html: iconImg(cat.icon, 22, true) }));
      h.appendChild(el("h3", null, esc(t(cat.label))));
      card.appendChild(h);
      var tiles = el("div", { class: "skill-tiles" });
      cat.items.forEach(function (item) { tiles.appendChild(buildTile(item)); });
      card.appendChild(tiles);
      card.addEventListener("mousemove", glow);
      groups.appendChild(card);
    });
    sec.appendChild(groups);

    // Radars par categorie (celles avec assez de competences)
    var graphable = s.categories.filter(function (c) { return c.items.length >= 3; });
    if (graphable.length) {
      sec.appendChild(sr(el("p", { class: "graphs-cap" }, esc(t(s.graphsCaption))), "fade-up"));
      var graphs = el("div", { class: "skill-graphs" });
      graphable.forEach(function (cat) {
        var g = sr(el("div", { class: "graph-card" }), "fade-up");
        g.appendChild(el("p", { class: "graph-title" }, esc(t(cat.label))));
        g.appendChild(buildRadar(cat.items));
        graphs.appendChild(g);
      });
      sec.appendChild(graphs);
    }
  }
  function shortLabel(l) { return String(l).replace(/ \/ /g, "/").replace(" (Figma)", ""); }
  function buildRadar(items) {
    var n = items.length, W = 360, H = 320, cx = W / 2, cy = 162, R = 96, ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg"); svg.setAttribute("viewBox", "0 0 " + W + " " + H); svg.setAttribute("role", "img");
    function pt(i, r) { var a = (Math.PI * 2 * i) / n - Math.PI / 2; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
    [0.25, 0.5, 0.75, 1].forEach(function (f) { var p = []; for (var i = 0; i < n; i++) { var q = pt(i, R * f); p.push(q[0].toFixed(1) + "," + q[1].toFixed(1)); } var poly = document.createElementNS(ns, "polygon"); poly.setAttribute("points", p.join(" ")); poly.setAttribute("class", "radar-grid"); svg.appendChild(poly); });
    for (var i = 0; i < n; i++) {
      var e = pt(i, R), line = document.createElementNS(ns, "line"); line.setAttribute("x1", cx); line.setAttribute("y1", cy); line.setAttribute("x2", e[0].toFixed(1)); line.setAttribute("y2", e[1].toFixed(1)); line.setAttribute("class", "radar-axis"); svg.appendChild(line);
      var lp = pt(i, R + 14), lb = document.createElementNS(ns, "text"); lb.setAttribute("x", lp[0].toFixed(1)); lb.setAttribute("y", lp[1].toFixed(1)); lb.setAttribute("class", "radar-label"); lb.setAttribute("dominant-baseline", "middle"); lb.setAttribute("text-anchor", lp[0] > cx + 6 ? "start" : lp[0] < cx - 6 ? "end" : "middle"); lb.textContent = shortLabel(items[i].label); svg.appendChild(lb);
    }
    var dp = [], dots = []; for (var j = 0; j < n; j++) { var p = pt(j, R * (items[j].value / 100)); dp.push(p[0].toFixed(1) + "," + p[1].toFixed(1)); dots.push(p); }
    var area = document.createElementNS(ns, "polygon"); area.setAttribute("points", dp.join(" ")); area.setAttribute("class", "radar-area"); svg.appendChild(area);
    dots.forEach(function (p) { var d = document.createElementNS(ns, "circle"); d.setAttribute("cx", p[0].toFixed(1)); d.setAttribute("cy", p[1].toFixed(1)); d.setAttribute("r", "2.6"); d.setAttribute("class", "radar-dot"); svg.appendChild(d); });
    return svg;
  }

  /* ---------- Contact ---------- */
  function renderContact() {
    var s = D.sections.contact, sec = document.getElementById("contact");
    sec.innerHTML = "";
    sec.appendChild(slug(t(s.eyebrow)));
    sec.appendChild(head(s, true));
    var grid = el("div", { class: "contact-grid" });
    var links = sr(el("div", { class: "contact-links" }), "slide-left");
    links.appendChild(cl(ICON.mail, t(D.ui.email), D.identity.email, "mailto:" + D.identity.email));
    links.appendChild(cl(ICON.phone, t(D.ui.phone), D.identity.phoneDisplay, D.identity.phoneHref));
    links.appendChild(cl(ICON.building, t(D.ui.office), D.identity.workName + " · " + t(D.identity.workAddress), D.identity.workMaps));
    links.appendChild(cl(ICON.github, "GitHub", "@FELTRINCyril", D.identity.github));
    links.appendChild(cl(ICON.linkedin, "LinkedIn", "Cyril Feltrin", D.identity.linkedin));
    grid.appendChild(links);

    var form = sr(el("form", { class: "contact-form", novalidate: "novalidate" }), "slide-right");
    form.appendChild(field("input", "name", t(s.labels.name), t(s.placeholders.name), "text", true));
    var two = el("div", { class: "field-2" });
    two.appendChild(field("input", "email", t(s.labels.email), t(s.placeholders.email), "email", true));
    two.appendChild(field("input", "subject", t(s.labels.subject), t(s.placeholders.subject), "text", false));
    form.appendChild(two);
    form.appendChild(field("textarea", "message", t(s.labels.message), t(s.placeholders.message), null, true));
    var hp = el("div", { class: "honeypot", "aria-hidden": "true" });
    hp.appendChild(el("label", { for: "company" }, esc(t(s.honeypotLabel))));
    hp.appendChild(el("input", { id: "company", name: "company", type: "text", tabindex: "-1", autocomplete: "off" }));
    form.appendChild(hp);
    form.appendChild(el("button", { type: "submit", class: "btn btn-primary" }, esc(t(s.labels.submit)) + ICON.arrowRight));
    var note = el("p", { class: "form-note", role: "status", "aria-live": "polite" });
    form.appendChild(note);
    form.addEventListener("submit", function (ev) { ev.preventDefault(); submit(form, note, s); });
    grid.appendChild(form);
    sec.appendChild(grid);

    // Carte du bureau, pleine largeur sous la grille
    var map = sr(el("div", { class: "contact-map wide" }), "fade-up");
    map.appendChild(el("iframe", { src: D.identity.mapEmbed, title: t(D.ui.office), loading: "lazy" }));
    map.appendChild(el("a", { class: "contact-map-label", href: D.identity.workMaps, target: "_blank", rel: "noopener", html: ICON.pin + "<span>" + esc(D.identity.workName + " · Chavanod") + "</span>" }));
    sec.appendChild(map);
  }
  function cl(icon, label, value, href) {
    var ext = href.indexOf("http") === 0;
    var a = el("a", { class: "contact-link", href: href }); if (ext) { a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener"); }
    a.appendChild(el("span", { class: "ic", html: icon }));
    var tx = el("span"); tx.appendChild(el("span", { class: "lbl" }, esc(label))); tx.appendChild(el("span", { class: "val" }, esc(value))); a.appendChild(tx);
    return a;
  }
  function field(kind, name, label, ph, type, req) {
    var f = el("div", { class: "field" });
    f.appendChild(el("label", { for: "f-" + name }, esc(label)));
    var input = kind === "textarea" ? el("textarea", { id: "f-" + name, name: name, placeholder: ph }) : el("input", { id: "f-" + name, name: name, type: type || "text", placeholder: ph });
    if (req) input.setAttribute("required", "required");
    f.appendChild(input); return f;
  }
  function submit(form, note, s) {
    note.className = "form-note"; note.textContent = "";
    var d = { name: form.name.value.trim(), email: form.email.value.trim(), subject: form.subject.value.trim(), message: form.message.value.trim(), company: form.company.value };
    if (d.company) return;
    if (!d.name || !d.email || !d.message) { note.className = "form-note err"; note.textContent = lang === "en" ? "Please fill in name, email and message." : "Merci de remplir nom, email et message."; return; }
    if (s.formActionUrl) {
      fetch(s.formActionUrl, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(d) })
        .then(function (r) { if (r.ok) { form.reset(); note.className = "form-note ok"; note.textContent = t(s.success); } else { note.className = "form-note err"; note.textContent = t(s.errorSend); } })
        .catch(function () { note.className = "form-note err"; note.textContent = t(s.errorNetwork); });
    } else {
      var body = fill(t(s.mailtoBodyIntro)).replace("{name}", d.name).replace("{email}", d.email) + d.message;
      window.location.href = "mailto:" + D.identity.email + "?subject=" + encodeURIComponent(d.subject || (lang === "en" ? "Portfolio contact" : "Contact portfolio")) + "&body=" + encodeURIComponent(body);
      note.className = "form-note ok"; note.textContent = lang === "en" ? "Opening your email app..." : "Ouverture de votre messagerie...";
    }
  }

  function renderFooter() {
    document.getElementById("footer-text").textContent = t(D.ui.footerRights) + " " + D.identity.fullName + " · © " + new Date().getFullYear();
    var soc = document.getElementById("footer-social"); soc.innerHTML = "";
    soc.appendChild(el("a", { href: D.identity.github, target: "_blank", rel: "noopener", "aria-label": t(D.ui.socialGithub), html: ICON.github }));
    soc.appendChild(el("a", { href: D.identity.linkedin, target: "_blank", rel: "noopener", "aria-label": t(D.ui.socialLinkedin), html: ICON.linkedin }));
  }

  /* ---------- Modal experience ---------- */
  function openXpModal(x) {
    var body = document.getElementById("xp-modal-body");
    body.innerHTML = "";
    body.appendChild(el("div", { class: "xpm-icon" }, esc(initials(x.org))));
    body.appendChild(el("p", { class: "xpm-date" }, esc(t(x.date))));
    body.appendChild(el("h3", { class: "xpm-role" }, esc(t(x.role))));
    body.appendChild(el("p", { class: "xpm-co", html: "<b>" + esc(x.org) + "</b>" }));
    if (x.place) body.appendChild(el("p", { class: "xpm-place" }, esc(t(x.place))));
    body.appendChild(el("p", { class: "xpm-text" }, esc(t(x.text))));
    if (x.tech && x.tech.length) { var tc = el("div", { class: "xpm-tech" }); x.tech.forEach(function (tg) { tc.appendChild(el("span", { class: "chip" }, esc(tg))); }); body.appendChild(tc); }
    var modal = document.getElementById("xp-modal");
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.getElementById("xp-modal-close").focus();
  }
  function closeXpModal() {
    var modal = document.getElementById("xp-modal");
    modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  /* ---------- Controls ---------- */
  function currentTheme() { return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark"; }
  function updateLabels() {
    document.getElementById("lang-toggle").setAttribute("aria-label", t(D.ui.langGroup));
    document.getElementById("menu-btn").setAttribute("aria-label", t(D.ui.menu));
    var tb = document.getElementById("theme-toggle");
    tb.setAttribute("aria-label", currentTheme() === "light" ? t(D.ui.themeToDark) : t(D.ui.themeToLight));
    tb.innerHTML = currentTheme() === "light" ? ICON.moon : ICON.sun;
    document.getElementById("to-top").setAttribute("aria-label", t(D.ui.scrollTop));
    document.getElementById("lseg-fr").classList.toggle("is-active", lang === "fr");
    document.getElementById("lseg-en").classList.toggle("is-active", lang === "en");
  }
  function setLang(l) { if (l === lang) return; lang = l; try { localStorage.setItem(LANG_KEY, l); } catch (e) {} renderAll(); }
  function setTheme(th) { document.documentElement.setAttribute("data-theme", th); try { localStorage.setItem(THEME_KEY, th); } catch (e) {} updateLabels(); }
  // Bascule de theme avec une vague circulaire depuis le bouton
  var vtRunning = false;
  function toggleTheme() {
    var next = currentTheme() === "light" ? "dark" : "light";
    if (reduceMotion || !document.startViewTransition || vtRunning) { setTheme(next); return; }
    var b = document.getElementById("theme-toggle").getBoundingClientRect();
    var x = b.left + b.width / 2, y = b.top + b.height / 2;
    var r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    var toLight = next === "light", root = document.documentElement;
    root.classList.add(toLight ? "vt-to-light" : "vt-to-dark");
    vtRunning = true;
    function cleanup() { vtRunning = false; root.classList.remove("vt-to-light", "vt-to-dark"); }
    var vt;
    try { vt = document.startViewTransition(function () { setTheme(next); }); }
    catch (e) { setTheme(next); cleanup(); return; }
    // onRejected en no-op sur ready ET finished pour ne jamais laisser de rejet non gere
    vt.ready.then(function () {
      var full = "circle(" + r + "px at " + x + "px " + y + "px)", zero = "circle(0px at " + x + "px " + y + "px)";
      try {
        root.animate(
          { clipPath: toLight ? [zero, full] : [full, zero] },
          { duration: 620, easing: "ease-in-out", pseudoElement: toLight ? "::view-transition-new(root)" : "::view-transition-old(root)" }
        );
      } catch (e) {}
    }, function () {});
    vt.finished.then(cleanup, cleanup);
  }

  function setupControls() {
    document.getElementById("lang-toggle").addEventListener("click", function () { setLang(lang === "fr" ? "en" : "fr"); });
    document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

    var menuBtn = document.getElementById("menu-btn"), menu = document.getElementById("mobile-menu"), backdrop = document.getElementById("mobile-backdrop");
    function closeMenu() { menu.classList.remove("open"); backdrop.classList.remove("show"); menuBtn.setAttribute("aria-expanded", "false"); menu.setAttribute("aria-hidden", "true"); }
    function openMenu() { menu.classList.add("open"); backdrop.classList.add("show"); menuBtn.setAttribute("aria-expanded", "true"); menu.setAttribute("aria-hidden", "false"); }
    menuBtn.addEventListener("click", function () { menu.classList.contains("open") ? closeMenu() : openMenu(); });
    backdrop.addEventListener("click", closeMenu);
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });

    var xpClose = document.getElementById("xp-modal-close"); xpClose.innerHTML = ICON.close;
    xpClose.addEventListener("click", closeXpModal);
    document.getElementById("xp-modal-backdrop").addEventListener("click", closeXpModal);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeMenu(); closeXpModal(); } });

    document.getElementById("to-top").innerHTML = ICON.up;
    document.getElementById("to-top").addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }

  /* ---------- Scroll engine (progress, scan, header, reveal, rail, spy) ---------- */
  var lastY = 0, ticking = false, navLinksMap = {};
  function setupReveal() {
    srNodes = [].slice.call(document.querySelectorAll(".sr"));
    if (reduceMotion || !("IntersectionObserver" in window)) { srNodes.forEach(function (n) { n.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    srNodes.forEach(function (n) { io.observe(n); });
  }
  function onScrollFrame() {
    ticking = false;
    var y = window.scrollY, vh = window.innerHeight;
    var docH = document.documentElement.scrollHeight - vh;
    var pct = docH > 0 ? y / docH : 0;
    document.getElementById("scroll-progress").style.width = (pct * 100) + "%";
    document.documentElement.style.setProperty("--scroll-pct", (pct * 100).toFixed(1) + "%");

    var header = document.getElementById("site-header");
    header.classList.toggle("hide", y > 160 && y > lastY);
    lastY = y;
    document.getElementById("to-top").classList.toggle("show", y > 600);

    // rail fill
    if (railEl) { var rr = railEl.getBoundingClientRect(); var anchor = vh * 0.6; var rp = ((anchor - rr.top) / rr.height) * 100; rp = rp < 0 ? 0 : rp > 100 ? 100 : rp; railEl.style.setProperty("--rail-fill", rp.toFixed(1) + "%"); }

    // scroll spy
    var mid = y + vh * 0.4, cur = null;
    D.nav.forEach(function (nv) { var el2 = document.querySelector(nv.href); if (el2) { var top = el2.offsetTop; if (mid >= top) cur = nv.href; } });
    Object.keys(navLinksMap).forEach(function (h) { navLinksMap[h].forEach(function (a) { a.classList.toggle("is-current", h === cur); }); });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(onScrollFrame); } }

  /* ---------- Bars animation (once visible) ---------- */
  function setupBars() {
    if (!("IntersectionObserver" in window)) { animateBars(); countUp(); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { animateBars(); io.disconnect(); } }); }, { threshold: 0.15 });
    io.observe(document.getElementById("competences"));
    var so = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { countUp(); so.disconnect(); } }); }, { threshold: 0.35 });
    so.observe(document.getElementById("stats"));
  }
  function animateBars() { document.querySelectorAll(".bar-fill").forEach(function (f) { f.style.width = (f.getAttribute("data-val") || 0) + "%"; }); }

  /* ---------- Magnetic ---------- */
  function setupMagnetic() {
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;
    document.querySelectorAll(".magnetic").forEach(function (m) {
      m.addEventListener("mousemove", function (e) { var r = m.getBoundingClientRect(); m.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + "px," + ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + "px)"; });
      m.addEventListener("mouseleave", function () { m.style.transform = ""; });
    });
  }

  /* ---------- Particles (montent) ---------- */
  function setupParticles() {
    var canvas = document.getElementById("particles");
    if (!canvas || reduceMotion) return;
    var ctx = canvas.getContext("2d"), w, h, parts = [], dpr = Math.min(window.devicePixelRatio || 1, 2);
    function resize() { w = canvas.width = canvas.offsetWidth * dpr; h = canvas.height = canvas.offsetHeight * dpr; }
    function reset() { var count = window.innerWidth < 768 ? 36 : 60; parts = []; for (var i = 0; i < count; i++) parts.push({ x: Math.random() * w, y: Math.random() * h, r: (Math.random() * 2 + 0.5) * dpr, vy: -(Math.random() * 0.4 + 0.1) * dpr, vx: (Math.random() - 0.5) * 0.2 * dpr, a: Math.random() * 0.6 + 0.2 }); }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      var color = getComputedStyle(document.documentElement).getPropertyValue("--particle").trim() || "#bfa8ff";
      ctx.fillStyle = color;
      for (var i = 0; i < parts.length; i++) { var p = parts[i]; p.x += p.vx; p.y += p.vy; if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; } if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10; ctx.globalAlpha = p.a; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); }
      ctx.globalAlpha = 1; requestAnimationFrame(draw);
    }
    resize(); reset(); draw();
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { resize(); reset(); }, 200); });
  }

  /* ---------- Init ---------- */
  function renderAll() {
    document.documentElement.lang = lang;
    renderHeader(); renderHero(); renderStats();
    renderAbout(); renderInterests(); renderExperience(); renderProjects(); renderSkills(); renderContact(); renderFooter();
    updateLabels();
    navLinksMap = {};
    document.querySelectorAll("#nav-links a, #mobile-links a").forEach(function (a) { var h = a.getAttribute("href"); (navLinksMap[h] = navLinksMap[h] || []).push(a); });
    setupReveal();
    setupBars();
    setupMagnetic();
    onScrollFrame();
  }
  function init() {
    if (!D) return;
    renderAll();
    setupControls();
    setupParticles();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitNameSvg);
    window.addEventListener("scroll", onScroll, { passive: true });
    var rzt;
    window.addEventListener("resize", function () { onScroll(); clearTimeout(rzt); rzt = setTimeout(fitNameSvg, 150); }, { passive: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
