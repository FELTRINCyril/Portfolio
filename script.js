/* =========================================================================
   Portfolio - Cyril Feltrin (v3)
   Rendu depuis data.js, i18n FR/EN, theme, effets (type, count-up,
   particules, scroll progress, reveal, magnetic).
   ========================================================================= */
(function () {
  "use strict";

  var D = window.portfolioData;
  var LANG_KEY = "portfolioLang";
  var THEME_KEY = "theme";
  var lang = getLang();
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var typeTimer = null;

  function getLang() { try { return localStorage.getItem(LANG_KEY) === "en" ? "en" : "fr"; } catch (e) { return "fr"; } }

  function t(field) {
    if (field && typeof field === "object" && ("fr" in field || "en" in field)) {
      return field[lang] != null ? field[lang] : field.fr;
    }
    return field;
  }
  function age() {
    var b = new Date(D.identity.birthdate + "T00:00:00"), now = new Date();
    var a = now.getFullYear() - b.getFullYear(), m = now.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < b.getDate())) a--;
    return a;
  }
  function fillTokens(s) { return String(s).replace("{age}", age()); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "class") e.className = attrs[k];
      else if (k === "html") e.innerHTML = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    if (html != null) e.innerHTML = html;
    return e;
  }

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
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/></svg>'
  };

  /* ---------- Header ---------- */
  function renderHeader() {
    document.getElementById("footer-brand").textContent = D.identity.shortBrand;
    var ul = document.getElementById("nav-links");
    ul.innerHTML = "";
    D.nav.forEach(function (n) {
      var li = el("li");
      li.appendChild(el("a", { href: n.href }, esc(t(n.label))));
      ul.appendChild(li);
    });
  }

  /* ---------- Hero ---------- */
  function renderHero() {
    var h = D.home;
    document.getElementById("home-status-text").textContent = t(h.status);
    document.getElementById("home-kicker").textContent = t(h.kicker);
    var name = document.getElementById("home-name");
    name.textContent = h.name;
    name.className = "hero-name grad";
    document.getElementById("home-tagline").textContent = fillTokens(t(h.tagline));
    document.getElementById("scroll-cue-text").textContent = t(h.scroll);

    var actions = document.getElementById("home-actions");
    actions.innerHTML = "";
    actions.appendChild(el("a", { class: "btn btn-primary magnetic", href: h.ctaPrimary.href }, ICON.user + "<span>" + esc(t(h.ctaPrimary.label)) + "</span>"));
    actions.appendChild(el("a", { class: "btn btn-ghost magnetic", href: h.ctaSecondary.href }, ICON.eye + "<span>" + esc(t(h.ctaSecondary.label)) + "</span>"));
    actions.appendChild(el("a", { class: "btn btn-ghost magnetic", href: D.ui.cvPath, download: D.ui.cvFileName }, ICON.download + "<span>" + esc(t(D.ui.cvDownload)) + "</span>"));

    startTyping(h.titles[lang] || h.titles.fr);
  }

  function startTyping(titles) {
    var target = document.getElementById("home-role");
    if (typeTimer) { clearTimeout(typeTimer); typeTimer = null; }
    if (reduceMotion) { target.textContent = titles[0]; return; }
    var i = 0, pos = 0, deleting = false;
    function step() {
      var full = titles[i];
      target.textContent = full.slice(0, pos);
      if (!deleting && pos < full.length) { pos++; typeTimer = setTimeout(step, 65); }
      else if (!deleting && pos === full.length) { deleting = true; typeTimer = setTimeout(step, 1600); }
      else if (deleting && pos > 0) { pos--; typeTimer = setTimeout(step, 32); }
      else { deleting = false; i = (i + 1) % titles.length; typeTimer = setTimeout(step, 350); }
    }
    step();
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
      if (node.dataset.done) return;
      node.dataset.done = "1";
      var target = parseInt(node.getAttribute("data-val"), 10) || 0;
      var suffix = node.getAttribute("data-suffix") || "";
      if (reduceMotion) { node.textContent = target + suffix; return; }
      var start = null, dur = 1300;
      function frame(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        node.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
  }

  /* ---------- Section head ---------- */
  function sectionHead(s) {
    var head = el("div", { class: "section-head" });
    head.appendChild(el("p", { class: "eyebrow" }, esc(t(s.eyebrow))));
    var title = t(s.title), sp = title.indexOf(" ");
    var titleHtml = sp > 0 ? '<span class="grad">' + esc(title.slice(0, sp)) + "</span>" + esc(title.slice(sp)) : '<span class="grad">' + esc(title) + "</span>";
    head.appendChild(el("h2", { class: "section-title", id: s.id + "-title" }, titleHtml));
    if (s.intro) head.appendChild(el("p", { class: "section-intro" }, esc(fillTokens(t(s.intro)))));
    return head;
  }

  /* ---------- About ---------- */
  function renderAbout() {
    var s = D.sections.about, sec = document.getElementById("a-propos");
    sec.innerHTML = "";
    // Head sans intro (l'intro est dans la colonne de gauche, pas de doublon)
    var head = el("div", { class: "section-head" });
    head.appendChild(el("p", { class: "eyebrow" }, esc(t(s.eyebrow))));
    var atitle = t(s.title), asp = atitle.indexOf(" ");
    head.appendChild(el("h2", { class: "section-title", id: "a-propos-title" },
      asp > 0 ? '<span class="grad">' + esc(atitle.slice(0, asp)) + "</span>" + esc(atitle.slice(asp)) : '<span class="grad">' + esc(atitle) + "</span>"));
    sec.appendChild(head);

    var grid = el("div", { class: "about-grid" });
    var main = el("div");
    main.appendChild(el("p", { class: "about-lead" }, esc(fillTokens(t(s.intro)))));
    var card = el("div", { class: "profile-card" });
    if (s.photo) card.appendChild(el("img", { class: "profile-photo", src: s.photo, alt: t(s.photoAlt), width: "813", height: "1400", loading: "lazy" }));
    card.appendChild(el("h3", null, esc(t(s.profileTitle))));
    s.profile.forEach(function (r) {
      var row = el("div", { class: "profile-row" });
      row.appendChild(el("span", { class: "k" }, esc(t(r.key))));
      row.appendChild(el("span", { class: "v" }, esc(fillTokens(t(r.value)))));
      card.appendChild(row);
    });
    grid.appendChild(main);
    grid.appendChild(card);
    sec.appendChild(grid);

    sec.appendChild(el("p", { class: "interests-title" }, esc(t(s.interestsTitle))));
    var gal = el("div", { class: "interests" });
    s.interests.forEach(function (it) {
      var cell;
      if (it.image) {
        cell = el("div", { class: "interest" });
        cell.appendChild(el("img", { src: it.image, alt: t(it.alt || it.label), loading: "lazy" }));
        cell.appendChild(el("div", { class: "interest-cap" }, esc(t(it.label))));
      } else {
        cell = el("div", { class: "interest no-image" });
        var cap = el("div", { class: "interest-cap" });
        cap.appendChild(el("span", { class: "interest-emoji" }, it.emoji || "★"));
        var lab = el("div", null, esc(t(it.label)));
        if (it.note) lab.appendChild(el("small", null, esc(t(it.note))));
        cap.appendChild(lab);
        cell.appendChild(cap);
      }
      gal.appendChild(cell);
    });
    sec.appendChild(gal);
  }

  /* ---------- Experience + education ---------- */
  function renderExperience() {
    var s = D.sections.experience, sec = document.getElementById("experience");
    sec.innerHTML = "";
    sec.appendChild(sectionHead(s));

    var tl = el("div", { class: "timeline" });
    s.items.forEach(function (x) {
      var item = el("div", { class: "tl-item" + (x.current ? " current" : "") });
      item.appendChild(el("p", { class: "tl-date" }, esc(t(x.date))));
      var head = el("div", { class: "tl-head" });
      head.appendChild(el("span", { class: "tl-role" }, esc(t(x.role))));
      head.appendChild(el("span", { class: "tl-org" }, esc(x.org)));
      if (x.place) head.appendChild(el("span", { class: "tl-place" }, esc(t(x.place))));
      if (x.current) head.appendChild(el("span", { class: "badge-now" }, lang === "en" ? "now" : "en cours"));
      item.appendChild(head);
      item.appendChild(el("p", { class: "tl-text" }, esc(t(x.text))));
      tl.appendChild(item);
    });
    sec.appendChild(tl);

    sec.appendChild(el("p", { class: "edu-title" }, esc(t(s.educationTitle))));
    var eg = el("div", { class: "edu-grid" });
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
    sec.appendChild(sectionHead(s));
    var grid = el("div", { class: "projects-grid" });
    s.items.forEach(function (p) {
      var card = el("article", { class: "project" + (p.featured ? " featured" : "") });
      var media;
      if (p.image) {
        media = el("div", { class: "project-media" });
        media.appendChild(el("img", { src: p.image, alt: t(p.title), loading: "lazy" }));
      } else {
        media = el("div", { class: "project-media placeholder", html: ICON.folder });
      }
      card.appendChild(media);
      var body = el("div", { class: "project-body" });
      var top = el("div", { class: "project-top" });
      top.appendChild(el("h3", null, esc(t(p.title))));
      if (p.date) top.appendChild(el("span", { class: "year-badge" }, esc(p.date)));
      body.appendChild(top);
      body.appendChild(el("p", null, esc(t(p.text))));
      if (p.tags && p.tags.length) {
        var tags = el("div", { class: "tags" });
        p.tags.forEach(function (tg) { tags.appendChild(el("span", { class: "tag" }, esc(tg))); });
        body.appendChild(tags);
      }
      if (p.link) body.appendChild(el("a", { class: "project-link", href: p.link.href, target: "_blank", rel: "noopener" }, esc(t(p.link.label)) + ICON.arrow));
      card.appendChild(body);
      grid.appendChild(card);
    });
    sec.appendChild(grid);
  }

  /* ---------- Skills ---------- */
  function renderSkills() {
    var s = D.sections.skills, sec = document.getElementById("competences");
    sec.innerHTML = "";
    sec.appendChild(sectionHead(s));
    var grid = el("div", { class: "skills-grid" });
    var left = el("div");
    left.appendChild(el("p", { class: "eyebrow", style: "text-align:left" }, esc(t(s.barsCaption))));
    var all = [];
    s.categories.forEach(function (cat) {
      var block = el("div", { class: "skill-cat" });
      block.appendChild(el("p", { class: "skill-cat-label" }, esc(t(cat.label))));
      cat.items.forEach(function (item) {
        all.push(item);
        var bar = el("div", { class: "bar" });
        var head = el("div", { class: "bar-head" });
        head.appendChild(el("span", { class: "name" }, esc(item.label)));
        head.appendChild(el("span", { class: "val" }, item.value + "%"));
        bar.appendChild(head);
        var track = el("div", { class: "bar-track" });
        var fill = el("div", { class: "bar-fill" });
        fill.setAttribute("data-val", item.value);
        track.appendChild(fill);
        bar.appendChild(track);
        block.appendChild(bar);
      });
      left.appendChild(block);
    });
    var right = el("div", { class: "radar-wrap" });
    right.appendChild(el("p", { class: "cap" }, esc(t(s.radarCaption))));
    right.appendChild(buildRadar(all));
    grid.appendChild(left);
    grid.appendChild(right);
    sec.appendChild(grid);
  }

  function buildRadar(items) {
    var n = items.length, size = 260, c = size / 2, R = 88, ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 " + size + " " + size);
    svg.setAttribute("role", "img");
    function pt(i, r) { var a = (Math.PI * 2 * i) / n - Math.PI / 2; return [c + r * Math.cos(a), c + r * Math.sin(a)]; }
    [0.25, 0.5, 0.75, 1].forEach(function (f) {
      var pts = [];
      for (var i = 0; i < n; i++) { var p = pt(i, R * f); pts.push(p[0].toFixed(1) + "," + p[1].toFixed(1)); }
      var poly = document.createElementNS(ns, "polygon"); poly.setAttribute("points", pts.join(" ")); poly.setAttribute("class", "radar-grid"); svg.appendChild(poly);
    });
    for (var i = 0; i < n; i++) {
      var e = pt(i, R), line = document.createElementNS(ns, "line");
      line.setAttribute("x1", c); line.setAttribute("y1", c); line.setAttribute("x2", e[0].toFixed(1)); line.setAttribute("y2", e[1].toFixed(1)); line.setAttribute("class", "radar-axis"); svg.appendChild(line);
      var lp = pt(i, R + 16), label = document.createElementNS(ns, "text");
      label.setAttribute("x", lp[0].toFixed(1)); label.setAttribute("y", lp[1].toFixed(1)); label.setAttribute("class", "radar-label"); label.setAttribute("dominant-baseline", "middle");
      label.setAttribute("text-anchor", lp[0] > c + 6 ? "start" : lp[0] < c - 6 ? "end" : "middle");
      label.textContent = items[i].label; svg.appendChild(label);
    }
    var dpts = [], dots = [];
    for (var j = 0; j < n; j++) { var p = pt(j, R * (items[j].value / 100)); dpts.push(p[0].toFixed(1) + "," + p[1].toFixed(1)); dots.push(p); }
    var area = document.createElementNS(ns, "polygon"); area.setAttribute("points", dpts.join(" ")); area.setAttribute("class", "radar-area"); svg.appendChild(area);
    dots.forEach(function (p) { var d = document.createElementNS(ns, "circle"); d.setAttribute("cx", p[0].toFixed(1)); d.setAttribute("cy", p[1].toFixed(1)); d.setAttribute("r", "2.6"); d.setAttribute("class", "radar-dot"); svg.appendChild(d); });
    return svg;
  }

  /* ---------- Contact ---------- */
  function renderContact() {
    var s = D.sections.contact, sec = document.getElementById("contact");
    sec.innerHTML = "";
    sec.appendChild(sectionHead(s));
    var grid = el("div", { class: "contact-grid" });

    var links = el("div", { class: "contact-links" });
    links.appendChild(contactLink(ICON.mail, t(D.ui.email), D.identity.email, "mailto:" + D.identity.email));
    links.appendChild(contactLink(ICON.phone, t(D.ui.phone), D.identity.phoneDisplay, D.identity.phoneHref));
    links.appendChild(contactLink(ICON.pin, t(D.ui.location), t(D.identity.location), "https://www.google.com/maps/search/?api=1&query=Annecy"));
    links.appendChild(contactLink(ICON.github, "GitHub", "@FELTRINCyril", D.identity.github));
    links.appendChild(contactLink(ICON.linkedin, "LinkedIn", "Cyril Feltrin", D.identity.linkedin));
    grid.appendChild(links);

    var form = el("form", { class: "contact-form", novalidate: "novalidate" });
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
    form.addEventListener("submit", function (ev) { ev.preventDefault(); handleSubmit(form, note, s); });
    grid.appendChild(form);
    sec.appendChild(grid);
  }
  function contactLink(icon, label, value, href) {
    var external = href.indexOf("http") === 0;
    var a = el("a", { class: "contact-link", href: href });
    if (external) { a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener"); }
    a.appendChild(el("span", { class: "ic", html: icon }));
    var txt = el("span");
    txt.appendChild(el("span", { class: "lbl" }, esc(label)));
    txt.appendChild(el("span", { class: "val" }, esc(value)));
    a.appendChild(txt);
    return a;
  }
  function field(kind, name, label, placeholder, type, required) {
    var f = el("div", { class: "field" });
    f.appendChild(el("label", { for: "f-" + name }, esc(label)));
    var input = kind === "textarea"
      ? el("textarea", { id: "f-" + name, name: name, placeholder: placeholder })
      : el("input", { id: "f-" + name, name: name, type: type || "text", placeholder: placeholder });
    if (required) input.setAttribute("required", "required");
    f.appendChild(input);
    return f;
  }
  function handleSubmit(form, note, s) {
    note.className = "form-note"; note.textContent = "";
    var data = { name: form.name.value.trim(), email: form.email.value.trim(), subject: form.subject.value.trim(), message: form.message.value.trim(), company: form.company.value };
    if (data.company) return;
    if (!data.name || !data.email || !data.message) {
      note.className = "form-note err";
      note.textContent = lang === "en" ? "Please fill in name, email and message." : "Merci de remplir nom, email et message.";
      return;
    }
    var url = s.formActionUrl;
    if (url) {
      fetch(url, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(data) })
        .then(function (r) {
          if (r.ok) { form.reset(); note.className = "form-note ok"; note.textContent = t(s.success); }
          else { note.className = "form-note err"; note.textContent = t(s.errorSend); }
        })
        .catch(function () { note.className = "form-note err"; note.textContent = t(s.errorNetwork); });
    } else {
      var body = fillTokens(t(s.mailtoBodyIntro)).replace("{name}", data.name).replace("{email}", data.email) + data.message;
      var subject = data.subject || (lang === "en" ? "Portfolio contact" : "Contact portfolio");
      window.location.href = "mailto:" + D.identity.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      note.className = "form-note ok";
      note.textContent = lang === "en" ? "Opening your email app..." : "Ouverture de votre messagerie...";
    }
  }

  function renderFooter() {
    document.getElementById("footer-text").textContent = t(D.ui.footerRights) + " " + D.identity.fullName + " · © " + new Date().getFullYear();
    var soc = document.getElementById("footer-social");
    soc.innerHTML = "";
    soc.appendChild(el("a", { href: D.identity.github, target: "_blank", rel: "noopener", "aria-label": t(D.ui.socialGithub), html: ICON.github }));
    soc.appendChild(el("a", { href: D.identity.linkedin, target: "_blank", rel: "noopener", "aria-label": t(D.ui.socialLinkedin), html: ICON.linkedin }));
  }

  /* ---------- Controls ---------- */
  function currentTheme() { return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark"; }
  function updateLabels() {
    document.getElementById("lang-group").setAttribute("aria-label", t(D.ui.langGroup));
    document.getElementById("menu-btn").setAttribute("aria-label", t(D.ui.menu));
    var tt = document.getElementById("theme-toggle");
    tt.setAttribute("aria-label", currentTheme() === "light" ? t(D.ui.themeToDark) : t(D.ui.themeToLight));
    document.getElementById("to-top").setAttribute("aria-label", t(D.ui.scrollTop));
    var fr = document.getElementById("lang-fr"), en = document.getElementById("lang-en");
    fr.classList.toggle("is-active", lang === "fr"); en.classList.toggle("is-active", lang === "en");
    fr.setAttribute("aria-pressed", lang === "fr"); en.setAttribute("aria-pressed", lang === "en");
  }
  function setLang(l) { if (l === lang) return; lang = l; try { localStorage.setItem(LANG_KEY, l); } catch (e) {} renderAll(); }
  function setTheme(th) { document.documentElement.setAttribute("data-theme", th); try { localStorage.setItem(THEME_KEY, th); } catch (e) {} updateLabels(); }

  function setupControls() {
    document.getElementById("lang-fr").addEventListener("click", function () { setLang("fr"); });
    document.getElementById("lang-en").addEventListener("click", function () { setLang("en"); });
    document.getElementById("theme-toggle").addEventListener("click", function () { setTheme(currentTheme() === "light" ? "dark" : "light"); });

    var menuBtn = document.getElementById("menu-btn"), navLinks = document.getElementById("nav-links");
    menuBtn.innerHTML = ICON.menu;
    menuBtn.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      menuBtn.innerHTML = open ? ICON.close : ICON.menu;
      menuBtn.setAttribute("aria-expanded", open);
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { navLinks.classList.remove("open"); menuBtn.innerHTML = ICON.menu; menuBtn.setAttribute("aria-expanded", "false"); }
    });

    var toTop = document.getElementById("to-top");
    toTop.innerHTML = ICON.up;
    toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

    var progress = document.getElementById("scroll-progress");
    window.addEventListener("scroll", function () {
      var st = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (st / max) * 100 : 0) + "%";
      toTop.classList.toggle("show", st > 600);
    }, { passive: true });
  }

  /* ---------- Reveal / spy / bars / stats ---------- */
  function setupObservers() {
    var reveals = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      reveals.forEach(function (r) { r.classList.add("is-visible"); });
      animateBars(); countUp(); return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); if (en.target.id === "competences") animateBars(); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (r) { io.observe(r); });

    var statsEl = document.getElementById("stats");
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { countUp(); so.unobserve(en.target); } });
    }, { threshold: 0.3 });
    so.observe(statsEl);

    var links = {};
    document.querySelectorAll("#nav-links a").forEach(function (a) { links[a.getAttribute("href")] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) Object.keys(links).forEach(function (h) { links[h].classList.toggle("is-current", h === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    D.nav.forEach(function (n) { var s = document.querySelector(n.href); if (s) spy.observe(s); });
  }
  function animateBars() { document.querySelectorAll(".bar-fill").forEach(function (f) { f.style.width = (f.getAttribute("data-val") || 0) + "%"; }); }

  /* ---------- Magnetic buttons ---------- */
  function setupMagnetic() {
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;
    document.querySelectorAll(".magnetic").forEach(function (m) {
      m.addEventListener("mousemove", function (e) {
        var r = m.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.25, y = (e.clientY - r.top - r.height / 2) * 0.35;
        m.style.transform = "translate(" + x + "px," + y + "px)";
      });
      m.addEventListener("mouseleave", function () { m.style.transform = ""; });
    });
  }

  /* ---------- Particles ---------- */
  function setupParticles() {
    var canvas = document.getElementById("particles");
    if (!canvas || reduceMotion) return;
    var ctx = canvas.getContext("2d"), w, h, parts = [], raf;
    function resize() {
      w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight;
      var count = Math.min(70, Math.round(w * h / 26000));
      parts = [];
      for (var i = 0; i < count; i++) parts.push({ x: rand(w), y: rand(h), r: rand(1.6) + 0.4, vx: (rand(1) - 0.5) * 0.25, vy: (rand(1) - 0.5) * 0.25, a: rand(0.5) + 0.25 });
    }
    function rand(m) { return Math.random() * m; }
    var color = getComputedStyle(document.documentElement).getPropertyValue("--particle") || "rgba(190,170,255,0.6)";
    function draw() {
      ctx.clearRect(0, 0, w, h);
      color = getComputedStyle(document.documentElement).getPropertyValue("--particle");
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.globalAlpha = p.a;
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }
    resize(); draw();
    var rt;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(resize, 200); });
  }

  /* ---------- Init ---------- */
  function renderAll() {
    document.documentElement.lang = lang;
    renderHeader(); renderHero(); renderStats();
    renderAbout(); renderExperience(); renderProjects(); renderSkills(); renderContact(); renderFooter();
    updateLabels();
    setupObservers();
    setupMagnetic();
  }
  function init() {
    if (!D) return;
    renderAll();
    setupControls();
    setupParticles();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
