/* =========================================================================
   Portfolio - Cyril Feltrin
   Rendu du contenu depuis data.js, i18n FR/EN, theme, accent test, radar.
   ========================================================================= */
(function () {
  "use strict";

  var D = window.portfolioData;
  var LANG_KEY = "portfolioLang";
  var THEME_KEY = "theme";
  var ACCENT_KEY = "accent";

  var lang = getLang();

  /* ---------- Helpers ---------- */

  function getLang() {
    try {
      var l = localStorage.getItem(LANG_KEY);
      return l === "en" ? "en" : "fr";
    } catch (e) {
      return "fr";
    }
  }

  // Retourne la bonne langue d'un champ { fr, en }, ou la valeur brute sinon.
  function t(field) {
    if (field && typeof field === "object" && ("fr" in field || "en" in field)) {
      return field[lang] != null ? field[lang] : field.fr;
    }
    return field;
  }

  function age() {
    var b = new Date(D.identity.birthdate + "T00:00:00");
    var now = new Date();
    var a = now.getFullYear() - b.getFullYear();
    var m = now.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < b.getDate())) a--;
    return a;
  }

  function fillTokens(str) {
    return String(str).replace("{age}", age());
  }

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "class") e.className = attrs[k];
        else if (k === "html") e.innerHTML = attrs[k];
        else e.setAttribute(k, attrs[k]);
      });
    }
    if (html != null) e.innerHTML = html;
    return e;
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ---------- Icones SVG ---------- */
  var ICON = {
    github:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.8 18.3 5.1 18.3 5.1c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5Z"/></svg>',
    linkedin:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.7-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM7.1 20.4H3.5V9h3.6v11.4ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z"/></svg>',
    mail:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    phone:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>',
    download:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',
    eye:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    arrow:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7m0 0H8m9 0v9"/></svg>',
    up:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg>',
    sun:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>',
    menu:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    folder:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/></svg>'
  };

  /* ---------- Rendu ---------- */

  function renderHeader() {
    document.getElementById("brand").textContent = D.identity.shortBrand;
    document.getElementById("footer-brand").textContent = D.identity.shortBrand;

    var ul = document.getElementById("nav-links");
    ul.innerHTML = "";
    D.nav.forEach(function (n) {
      var li = el("li");
      li.appendChild(el("a", { href: n.href }, esc(t(n.label))));
      ul.appendChild(li);
    });
  }

  function renderHero() {
    var h = D.hero;
    document.getElementById("hero-kicker").textContent = t(h.kicker);
    document.getElementById("hero-title").innerHTML =
      esc(t(h.titleBefore)) +
      '<span class="accent">' +
      esc(t(h.titleAccent)) +
      "</span>" +
      esc(t(h.titleAfter));
    document.getElementById("hero-lead").textContent = fillTokens(t(h.text));

    var photo = document.getElementById("hero-photo");
    photo.src = h.photo;
    photo.alt = t(h.photoAlt);

    // Actions : contact + groupe CV
    var actions = document.getElementById("hero-actions");
    actions.innerHTML = "";
    var contact = el("a", { class: "btn btn-primary", href: h.primaryCta.href }, esc(t(h.primaryCta.label)) + ICON.arrow);
    actions.appendChild(contact);

    var cvGroup = el("div", { class: "cv-group" });
    var dl = el("a", {
      class: "btn",
      href: h.cv.pdfPath,
      download: h.cv.downloadFileName
    }, ICON.download + "<span>" + esc(t(h.cv.download)) + "</span>");
    var open = el("a", {
      class: "btn",
      href: h.cv.pdfPath,
      target: "_blank",
      rel: "noopener"
    }, ICON.eye + "<span>" + esc(t(h.cv.open)) + "</span>");
    cvGroup.appendChild(dl);
    cvGroup.appendChild(open);
    actions.appendChild(cvGroup);

    // Reseaux
    var social = document.getElementById("hero-social");
    social.innerHTML = "";
    social.appendChild(el("a", { href: D.identity.github, target: "_blank", rel: "noopener", "aria-label": t(D.ui.socialGithub) }, ICON.github));
    social.appendChild(el("a", { href: D.identity.linkedin, target: "_blank", rel: "noopener", "aria-label": t(D.ui.socialLinkedin) }, ICON.linkedin));
  }

  function sectionHead(s) {
    var head = el("div", { class: "section-head" });
    head.appendChild(el("p", { class: "kicker" }, esc(t(s.title))));
    head.appendChild(el("h2", { class: "section-title", id: s.id + "-title" }, esc(t(s.title))));
    if (s.intro) head.appendChild(el("p", { class: "section-intro" }, esc(t(s.intro))));
    return head;
  }

  function renderAbout() {
    var s = D.sections.about;
    var sec = document.getElementById("a-propos");
    sec.innerHTML = "";

    // Head : titre seul (l'intro va dans la colonne de gauche, pas de doublon)
    var head = el("div", { class: "section-head" });
    head.appendChild(el("p", { class: "kicker" }, esc(t(s.title))));
    head.appendChild(el("h2", { class: "section-title", id: "a-propos-title" }, esc(t(s.title))));
    sec.appendChild(head);

    var grid = el("div", { class: "about-grid" });

    var mainCol = el("div");
    mainCol.appendChild(el("p", { class: "about-lead" }, esc(fillTokens(t(s.intro)))));

    var card = el("div", { class: "profile-card" });
    card.appendChild(el("h3", null, esc(t(s.profileTitle))));
    s.profile.forEach(function (r) {
      var row = el("div", { class: "profile-row" });
      row.appendChild(el("span", { class: "k" }, esc(t(r.key))));
      row.appendChild(el("span", { class: "v" }, esc(fillTokens(t(r.value)))));
      card.appendChild(row);
    });

    grid.appendChild(mainCol);
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
        cap.appendChild(el("span", { class: "interest-emoji" }, "🪂"));
        var label = el("div", null, esc(t(it.label)));
        cap.appendChild(label);
        if (it.note) label.appendChild(el("small", null, esc(t(it.note))));
        cell.appendChild(cap);
      }
      gal.appendChild(cell);
    });
    sec.appendChild(gal);
  }

  function renderSkills() {
    var s = D.sections.skills;
    var sec = document.getElementById("competences");
    sec.innerHTML = "";
    sec.appendChild(sectionHead(s));

    var grid = el("div", { class: "skills-grid" });

    // Colonne gauche : barres groupees
    var left = el("div");
    left.appendChild(el("p", { class: "kicker" }, esc(t(s.barsCaption))));
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

    // Colonne droite : radar de toutes les competences
    var right = el("div", { class: "radar-wrap" });
    right.appendChild(el("p", { class: "cap" }, esc(t(s.radarCaption))));
    right.appendChild(buildRadar(all));

    grid.appendChild(left);
    grid.appendChild(right);
    sec.appendChild(grid);
  }

  // Radar SVG a partir d'une liste { label, value(0-100) }
  function buildRadar(items) {
    var n = items.length;
    var size = 260;
    var c = size / 2;
    var R = 88;
    var svgns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgns, "svg");
    svg.setAttribute("viewBox", "0 0 " + size + " " + size);
    svg.setAttribute("role", "img");

    function pt(i, r) {
      var ang = (Math.PI * 2 * i) / n - Math.PI / 2;
      return [c + r * Math.cos(ang), c + r * Math.sin(ang)];
    }

    // anneaux
    [0.25, 0.5, 0.75, 1].forEach(function (f) {
      var pts = [];
      for (var i = 0; i < n; i++) {
        var p = pt(i, R * f);
        pts.push(p[0].toFixed(1) + "," + p[1].toFixed(1));
      }
      var poly = document.createElementNS(svgns, "polygon");
      poly.setAttribute("points", pts.join(" "));
      poly.setAttribute("class", "radar-grid");
      svg.appendChild(poly);
    });

    // axes + labels
    for (var i = 0; i < n; i++) {
      var edge = pt(i, R);
      var line = document.createElementNS(svgns, "line");
      line.setAttribute("x1", c);
      line.setAttribute("y1", c);
      line.setAttribute("x2", edge[0].toFixed(1));
      line.setAttribute("y2", edge[1].toFixed(1));
      line.setAttribute("class", "radar-axis");
      svg.appendChild(line);

      var lp = pt(i, R + 16);
      var label = document.createElementNS(svgns, "text");
      label.setAttribute("x", lp[0].toFixed(1));
      label.setAttribute("y", lp[1].toFixed(1));
      label.setAttribute("class", "radar-label");
      label.setAttribute("dominant-baseline", "middle");
      var anchor = "middle";
      if (lp[0] > c + 6) anchor = "start";
      else if (lp[0] < c - 6) anchor = "end";
      label.setAttribute("text-anchor", anchor);
      label.textContent = items[i].label;
      svg.appendChild(label);
    }

    // aire des valeurs
    var dpts = [];
    var dots = [];
    for (var j = 0; j < n; j++) {
      var p = pt(j, R * (items[j].value / 100));
      dpts.push(p[0].toFixed(1) + "," + p[1].toFixed(1));
      dots.push(p);
    }
    var area = document.createElementNS(svgns, "polygon");
    area.setAttribute("points", dpts.join(" "));
    area.setAttribute("class", "radar-area");
    svg.appendChild(area);

    dots.forEach(function (p) {
      var dot = document.createElementNS(svgns, "circle");
      dot.setAttribute("cx", p[0].toFixed(1));
      dot.setAttribute("cy", p[1].toFixed(1));
      dot.setAttribute("r", "2.6");
      dot.setAttribute("class", "radar-dot");
      svg.appendChild(dot);
    });

    return svg;
  }

  function renderProjects() {
    var s = D.sections.projects;
    var sec = document.getElementById("projets");
    sec.innerHTML = "";
    sec.appendChild(sectionHead(s));

    var wrap = el("div", { class: "cards" });
    s.items.forEach(function (p) {
      var card = el("article", { class: "card" });
      var media;
      if (p.image) {
        media = el("div", { class: "card-media" });
        media.appendChild(el("img", { src: p.image, alt: t(p.title), loading: "lazy" }));
      } else {
        media = el("div", { class: "card-media placeholder", html: ICON.folder });
      }
      card.appendChild(media);

      var body = el("div", { class: "card-body" });
      body.appendChild(el("span", { class: "card-tag" }, esc(t(p.tag))));
      body.appendChild(el("p", { class: "card-date" }, esc(t(p.date))));
      body.appendChild(el("h3", null, esc(t(p.title))));
      body.appendChild(el("p", null, esc(t(p.text))));
      if (p.link) {
        body.appendChild(el("a", {
          class: "card-link",
          href: p.link.href,
          target: "_blank",
          rel: "noopener"
        }, esc(t(p.link.label)) + ICON.arrow));
      }
      card.appendChild(body);
      wrap.appendChild(card);
    });
    sec.appendChild(wrap);
  }

  function renderExperience() {
    var s = D.sections.experience;
    var sec = document.getElementById("experience");
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
  }

  function renderEducation() {
    var s = D.sections.education;
    var sec = document.getElementById("formation");
    sec.innerHTML = "";
    sec.appendChild(sectionHead(s));

    var grid = el("div", { class: "edu-grid" });
    s.items.forEach(function (e2) {
      var card = el("div", { class: "edu-card" });
      card.appendChild(el("span", { class: "edu-tag" }, esc(t(e2.tag))));
      card.appendChild(el("p", { class: "edu-date" }, esc(t(e2.date))));
      card.appendChild(el("h3", null, esc(t(e2.title))));
      card.appendChild(el("p", { class: "edu-org" }, esc(t(e2.org))));
      card.appendChild(el("p", null, esc(t(e2.text))));
      grid.appendChild(card);
    });
    sec.appendChild(grid);
  }

  function renderContact() {
    var s = D.sections.contact;
    var sec = document.getElementById("contact");
    sec.innerHTML = "";
    sec.appendChild(sectionHead(s));

    var grid = el("div", { class: "contact-grid" });

    // Colonne liens
    var links = el("div", { class: "contact-links" });
    links.appendChild(contactLink(ICON.mail, t(D.ui.email), D.identity.email, "mailto:" + D.identity.email));
    links.appendChild(contactLink(ICON.phone, t(D.ui.phone), D.identity.phoneDisplay, D.identity.phoneHref));
    links.appendChild(contactLink(ICON.github, "GitHub", "@FELTRINCyril", D.identity.github));
    links.appendChild(contactLink(ICON.linkedin, "LinkedIn", "Cyril Feltrin", D.identity.linkedin));
    grid.appendChild(links);

    // Colonne formulaire
    var form = el("form", { class: "contact-form", novalidate: "novalidate" });
    form.appendChild(field("input", "name", t(s.labels.name), t(s.placeholders.name), "text", true));
    var two = el("div", { class: "field-2" });
    two.appendChild(field("input", "email", t(s.labels.email), t(s.placeholders.email), "email", true));
    two.appendChild(field("input", "subject", t(s.labels.subject), t(s.placeholders.subject), "text", false));
    form.appendChild(two);
    form.appendChild(field("textarea", "message", t(s.labels.message), t(s.placeholders.message), null, true));

    // honeypot anti-spam
    var hp = el("div", { class: "honeypot", "aria-hidden": "true" });
    hp.appendChild(el("label", { for: "company" }, esc(t(s.honeypotLabel))));
    hp.appendChild(el("input", { id: "company", name: "company", type: "text", tabindex: "-1", autocomplete: "off" }));
    form.appendChild(hp);

    var submit = el("button", { type: "submit", class: "btn btn-primary" }, esc(t(s.labels.submit)) + ICON.arrow);
    form.appendChild(submit);
    var note = el("p", { class: "form-note", role: "status", "aria-live": "polite" });
    form.appendChild(note);

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      handleSubmit(form, note, s);
    });

    grid.appendChild(form);
    sec.appendChild(grid);
  }

  function contactLink(icon, label, value, href) {
    var external = href.indexOf("http") === 0;
    var a = el("a", { class: "contact-link", href: href });
    if (external) {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    }
    a.appendChild(el("span", { class: "ic", html: icon }));
    var txt = el("span", { class: "txt" });
    txt.appendChild(el("span", { class: "lbl" }, esc(label)));
    txt.appendChild(el("span", { class: "val" }, esc(value)));
    a.appendChild(txt);
    return a;
  }

  function field(kind, name, label, placeholder, type, required) {
    var f = el("div", { class: "field" });
    f.appendChild(el("label", { for: "f-" + name }, esc(label)));
    var input;
    if (kind === "textarea") {
      input = el("textarea", { id: "f-" + name, name: name, placeholder: placeholder });
    } else {
      input = el("input", { id: "f-" + name, name: name, type: type || "text", placeholder: placeholder });
    }
    if (required) input.setAttribute("required", "required");
    f.appendChild(input);
    return f;
  }

  function handleSubmit(form, note, s) {
    note.className = "form-note";
    note.textContent = "";
    var data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),
      company: form.company.value
    };
    if (data.company) return; // honeypot rempli -> bot
    if (!data.name || !data.email || !data.message) {
      note.className = "form-note err";
      note.textContent = lang === "en" ? "Please fill in name, email and message." : "Merci de remplir nom, email et message.";
      return;
    }

    var url = s.formActionUrl;
    if (url) {
      // Envoi via Formspree (ou service compatible)
      fetch(url, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (r) {
          if (r.ok) {
            form.reset();
            note.className = "form-note ok";
            note.textContent = t(s.success);
          } else {
            note.className = "form-note err";
            note.textContent = t(s.errorSend);
          }
        })
        .catch(function () {
          note.className = "form-note err";
          note.textContent = t(s.errorNetwork);
        });
    } else {
      // Repli mailto prerempli
      var body = fillTokens(t(s.mailtoBodyIntro))
        .replace("{name}", data.name)
        .replace("{email}", data.email) + data.message;
      var subject = data.subject || (lang === "en" ? "Portfolio contact" : "Contact portfolio");
      window.location.href =
        "mailto:" + D.identity.email +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      note.className = "form-note ok";
      note.textContent = lang === "en" ? "Opening your email app..." : "Ouverture de votre messagerie...";
    }
  }

  function renderFooter() {
    document.getElementById("footer-text").textContent =
      "© " + new Date().getFullYear() + " " + D.identity.fullName + ". " + t(D.ui.footerRights);
  }

  function renderAll() {
    document.documentElement.lang = lang;
    renderHeader();
    renderHero();
    renderAbout();
    renderSkills();
    renderProjects();
    renderExperience();
    renderEducation();
    renderContact();
    renderFooter();
    updateStaticLabels();
    setupReveals();
    setupScrollSpy();
  }

  /* ---------- Controles (theme, langue, accent, menu) ---------- */

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }
  function currentAccent() {
    return document.documentElement.getAttribute("data-accent") === "violet" ? "violet" : "slate";
  }

  function updateStaticLabels() {
    var themeBtn = document.getElementById("theme-toggle");
    var dark = currentTheme() === "dark";
    themeBtn.innerHTML = dark ? ICON.sun : ICON.moon;
    themeBtn.setAttribute("aria-label", dark ? t(D.ui.themeToLight) : t(D.ui.themeToDark));

    document.getElementById("lang-group").setAttribute("aria-label", t(D.ui.langGroup));
    document.getElementById("accent-test-label").textContent = t(D.ui.accentTest);
    document.getElementById("menu-btn").setAttribute("aria-label", t(D.ui.menu));
    document.getElementById("to-top").innerHTML = ICON.up;
    document.getElementById("to-top").setAttribute("aria-label", t(D.ui.scrollTop));

    var frBtn = document.getElementById("lang-fr");
    var enBtn = document.getElementById("lang-en");
    frBtn.classList.toggle("is-active", lang === "fr");
    enBtn.classList.toggle("is-active", lang === "en");
    frBtn.setAttribute("aria-pressed", lang === "fr");
    enBtn.setAttribute("aria-pressed", lang === "en");
  }

  function setLang(l) {
    if (l === lang) return;
    lang = l;
    try { localStorage.setItem(LANG_KEY, l); } catch (e) {}
    renderAll();
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    updateStaticLabels();
  }

  function setAccent(accent) {
    document.documentElement.setAttribute("data-accent", accent);
    try { localStorage.setItem(ACCENT_KEY, accent); } catch (e) {}
  }

  function setupControls() {
    document.getElementById("lang-fr").addEventListener("click", function () { setLang("fr"); });
    document.getElementById("lang-en").addEventListener("click", function () { setLang("en"); });

    document.getElementById("theme-toggle").addEventListener("click", function () {
      setTheme(currentTheme() === "dark" ? "light" : "dark");
    });

    // TEMP : bascule couleur d'accent (a supprimer avec le bouton)
    document.getElementById("accent-test").addEventListener("click", function () {
      setAccent(currentAccent() === "violet" ? "slate" : "violet");
    });

    var menuBtn = document.getElementById("menu-btn");
    var navLinks = document.getElementById("nav-links");
    menuBtn.innerHTML = ICON.menu;
    menuBtn.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      menuBtn.innerHTML = open ? ICON.close : ICON.menu;
      menuBtn.setAttribute("aria-expanded", open);
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("open");
        menuBtn.innerHTML = ICON.menu;
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });

    var toTop = document.getElementById("to-top");
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    var header = document.getElementById("site-header");
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 8);
      toTop.classList.toggle("show", y > 600);
    }, { passive: true });
  }

  /* ---------- Reveal + animation barres ---------- */

  function setupReveals() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (i) { i.classList.add("is-visible"); });
      animateBars();
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          if (en.target.id === "competences") animateBars();
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (i) { io.observe(i); });
  }

  function animateBars() {
    document.querySelectorAll(".bar-fill").forEach(function (f) {
      f.style.width = (f.getAttribute("data-val") || 0) + "%";
    });
  }

  /* ---------- Scroll spy (nav) ---------- */

  function setupScrollSpy() {
    var sections = D.nav.map(function (n) { return document.querySelector(n.href); }).filter(Boolean);
    var links = {};
    document.querySelectorAll("#nav-links a").forEach(function (a) {
      links[a.getAttribute("href")] = a;
    });
    if (!("IntersectionObserver" in window)) return;
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          Object.keys(links).forEach(function (h) {
            links[h].classList.toggle("is-current", h === "#" + en.target.id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Init ---------- */
  function init() {
    if (!D) return;
    renderAll();
    setupControls();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
