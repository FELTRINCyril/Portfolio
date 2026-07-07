/*
 * data.js - Source unique du portfolio (FR + EN)
 * =================================================
 * Un seul fichier a maintenir. La structure est ecrite une seule fois.
 *
 * REGLE SIMPLE :
 *   - Texte a traduire  -> objet { fr: "...", en: "..." }
 *   - Reste (URL, image, date, valeur %, id) -> valeur brute, ecrite une fois
 *
 * Pour ajouter une experience / un projet / une competence :
 *   copier un bloc existant dans la liste correspondante et adapter.
 *
 * L'age est calcule automatiquement depuis birthdate (rien a mettre a jour).
 */

window.portfolioData = {
  identity: {
    shortBrand: "CF",
    fullName: "Cyril Feltrin",
    birthdate: "2005-09-05",
    location: { fr: "Annecy (74), France", en: "Annecy (74), France" },
    email: "cyril@kreaddis.com",
    phoneDisplay: "06 41 80 24 77",
    phoneHref: "tel:+33641802477",
    workName: "Kreaddis",
    workAddress: { fr: "6 rue Andre Ampere, Z.I. des Cesardes, Seynod - 74600 Annecy", en: "6 rue Andre Ampere, Z.I. des Cesardes, Seynod - 74600 Annecy, FR" },
    workMaps: "https://www.google.com/maps/search/?api=1&query=Kreaddis+6+rue+Andre+Ampere+Seynod+Annecy",
    mapEmbed: "https://www.openstreetmap.org/export/embed.html?bbox=6.0500%2C45.8750%2C6.1030%2C45.8990&layer=mapnik&marker=45.8871%2C6.0764",
    github: "https://github.com/FELTRINCyril",
    linkedin: "https://www.linkedin.com/in/cyril-feltrin/"
  },

  nav: [
    { href: "#accueil", label: { fr: "Accueil", en: "Home" } },
    { href: "#a-propos", label: { fr: "A propos", en: "About" } },
    { href: "#experience", label: { fr: "Parcours", en: "Journey" } },
    { href: "#projets", label: { fr: "Projets", en: "Projects" } },
    { href: "#competences", label: { fr: "Competences", en: "Skills" } },
    { href: "#contact", label: { fr: "Contact", en: "Contact" } }
  ],

  home: {
    status: { fr: "Alternant chez Kreaddis · bientot en CDI", en: "Apprentice at Kreaddis · soon permanent" },
    kicker: { fr: "// bonjour, moi c'est", en: "// hello, i'm" },
    name: "Cyril Feltrin",
    // Titres qui defilent (type animation) dans le hero
    titles: {
      fr: ["Business Analyst", "Developpeur Odoo", "Integrateur ERP", "Etudiant en BUT Info"],
      en: ["Business Analyst", "Odoo developer", "ERP integrator", "CS student"]
    },
    tagline: {
      fr: "Etudiant en 3e annee de BUT Informatique, en alternance chez Kreaddis (Annecy) comme Business Analyst / Developpeur Odoo. J'analyse, je parametre et je developpe des solutions Odoo - et je poursuis en CDI l'an prochain.",
      en: "Third-year Computer Science student, apprentice at Kreaddis (Annecy) as Business Analyst / Odoo developer. I analyze, configure and develop Odoo solutions - and I continue on a permanent contract next year."
    },
    ctaPrimary: { href: "#a-propos", label: { fr: "A propos", en: "About me" } },
    ctaSecondary: { href: "#projets", label: { fr: "Voir mes projets", en: "View my work" } },
    scroll: { fr: "defiler", en: "scroll" },
    // Stats animees (comptage). Valeurs honnetes, faciles a ajuster.
    stats: [
      { value: 3, suffix: "", label: { fr: "annees de BUT Info", en: "years of CS degree" } },
      { value: 7, suffix: "", label: { fr: "experiences pro", en: "work experiences" } },
      { value: 3, suffix: "", label: { fr: "projets realises", en: "projects delivered" } },
      { value: 10, suffix: "", label: { fr: "technologies", en: "technologies" } }
    ]
  },

  sections: {
    about: {
      id: "a-propos",
      eyebrow: { fr: "// a propos", en: "// about" },
      title: { fr: "Faire connaissance", en: "Get to know me" },
      intro: {
        fr: "Salut, moi c'est Cyril. Mon parcours mele des experiences de terrain (service, caisse, logistique, paysagisme) et un cursus technique en informatique. J'y ai gagne de la rigueur, de la polyvalence et le sens du travail en equipe - des qualites que j'applique aujourd'hui comme Business Analyst / Developpeur Odoo chez Kreaddis.",
        en: "Hi, I'm Cyril. My background blends hands-on jobs (hospitality, checkout, logistics, landscaping) with a technical degree in computer science. It gave me rigor, versatility and a real team spirit - qualities I now bring as Business Analyst / Odoo developer at Kreaddis."
      },
      // Bio riche (HTML autorise : <b> = mot-cle mis en accent)
      bio: {
        fr: "<p><b>Salut, moi c'est Cyril</b> - etudiant en <b>3e annee de BUT Informatique</b> a l'IUT d'Annecy, aujourd'hui a 100% en entreprise.</p><p>Je suis en <b>alternance chez Kreaddis</b> (ex-Kreatys) comme <b>Business Analyst / Developpeur Odoo</b> : analyse des besoins clients, parametrage de modules et developpement Python/XML sur <b>Odoo</b>.</p><p>Avant l'informatique, plusieurs saisons sur le terrain (service, caisse, logistique, paysagisme) m'ont donne de la <b>rigueur</b> et le <b>sens du travail en equipe</b>. Je poursuis l'aventure en <b>CDI</b> l'an prochain, dans la meme equipe.</p>",
        en: "<p><b>Hi, I'm Cyril</b> - a <b>third-year Computer Science student</b> at IUT of Annecy, now working full-time.</p><p>I'm an <b>apprentice at Kreaddis</b> (formerly Kreatys) as <b>Business Analyst / Odoo developer</b>: client needs analysis, module configuration and Python/XML development on <b>Odoo</b>.</p><p>Before tech, several seasons of hands-on work (hospitality, checkout, logistics, landscaping) gave me <b>rigor</b> and a real <b>team spirit</b>. I continue the journey on a <b>permanent contract</b> next year, with the same team.</p>"
      },
      photo: "./assets/images/profil.webp",
      photoAlt: { fr: "Portrait de Cyril Feltrin", en: "Portrait of Cyril Feltrin" },
      available: { fr: "En alternance", en: "Apprenticeship" },
      // "highlights" : petites cartes (icone + titre + sous-titre)
      highlights: [
        { icon: "erp", title: "Odoo", sub: { fr: "ERP, ~1 an", en: "ERP, ~1 year" } },
        { icon: "code", title: { fr: "Web", en: "Web" }, sub: { fr: "HTML/CSS/JS, Laravel", en: "HTML/CSS/JS, Laravel" } },
        { icon: "ai", title: { fr: "Outils IA", en: "AI tools" }, sub: { fr: "Claude Code, Cursor, Gemini", en: "Claude Code, Cursor, Gemini" } },
        { icon: "cap", title: { fr: "BUT Info", en: "CS degree" }, sub: { fr: "IUT d'Annecy", en: "IUT of Annecy" } }
      ],
      interestsTitle: { fr: "En dehors du code", en: "Beyond the code" },
      interests: [
        { image: "./assets/images/interests/moto.webp", label: { fr: "Moto", en: "Motorcycle" }, alt: { fr: "Moto", en: "Motorcycle" } },
        { image: "./assets/images/interests/snowboard.webp", label: { fr: "Snowboard", en: "Snowboarding" }, alt: { fr: "Snowboard", en: "Snowboarding" } },
        { image: "./assets/images/interests/muscu.webp", label: { fr: "Musculation", en: "Weight training" }, alt: { fr: "Musculation", en: "Weight training" } },
        { image: "", emoji: "🪂", label: { fr: "Parachute", en: "Skydiving" }, note: { fr: "PAC en aout", en: "License course in August" } }
      ]
    },

    experience: {
      id: "experience",
      eyebrow: { fr: "// parcours", en: "// journey" },
      title: { fr: "Experience & formation", en: "Experience & education" },
      intro: {
        fr: "Du developpement Odoo aujourd'hui, apres plusieurs saisons en contact client et sur le terrain.",
        en: "Odoo development today, after several seasons in customer-facing and hands-on jobs."
      },
      items: [
        {
          date: { fr: "2025 - 2026 · Alternance", en: "2025 - 2026 · Apprenticeship" },
          role: { fr: "Business Analyst / Developpeur Odoo", en: "Business Analyst / Odoo developer" },
          org: "Kreaddis",
          place: { fr: "Chavanod", en: "Chavanod, FR" },
          text: {
            fr: "Alternance de 3e annee de BUT Informatique (ex-Kreatys). Developpement et parametrage Odoo, projets clients, en equipe.",
            en: "Third-year apprenticeship, BUT Computer Science (formerly Kreatys). Odoo development and configuration, client projects, in a team."
          },
          tech: ["Odoo", "Python", "XML", "JavaScript"],
          current: true
        },
        {
          date: { fr: "Ete 2025 · 1 mois", en: "Summer 2025 · 1 month" },
          role: { fr: "Developpeur", en: "Developer" },
          org: "Kreaddis",
          place: { fr: "Chavanod", en: "Chavanod, FR" },
          text: {
            fr: "Mission de developpement d'un mois chez Kreaddis (ex-Kreatys) entre deux annees de formation.",
            en: "One-month development assignment at Kreaddis (formerly Kreatys) between two academic years."
          },
          tech: ["Odoo", "Python"]
        },
        {
          date: { fr: "2025 · Stage 2 mois", en: "2025 · 2-month internship" },
          role: { fr: "Stagiaire developpement", en: "Development intern" },
          org: "Kreaddis",
          place: { fr: "Chavanod", en: "Chavanod, FR" },
          text: {
            fr: "Stage de 2e annee de BUT Informatique chez Kreaddis (ex-Kreatys) : premiere immersion sur Odoo et le developpement en entreprise.",
            en: "Second-year internship (BUT Computer Science) at Kreaddis (formerly Kreatys): first immersion in Odoo and professional development."
          },
          tech: ["Odoo", "XML"]
        },
        {
          date: { fr: "Ete 2024 · 1,5 mois", en: "Summer 2024 · 1.5 months" },
          role: { fr: "Mise en rayon", en: "Stock replenishment" },
          org: "Intermarche",
          place: { fr: "Les Villards-sur-Thones", en: "Les Villards-sur-Thones, FR" },
          text: {
            fr: "Reapprovisionnement des rayons, gestion des stocks et coordination avec l'equipe magasin.",
            en: "Shelf restocking, inventory handling and coordination with the store team."
          }
        },
        {
          date: { fr: "Ete 2023 · 1,5 mois", en: "Summer 2023 · 1.5 months" },
          role: { fr: "Caissier", en: "Cashier" },
          org: "Intermarche",
          place: { fr: "Les Villards-sur-Thones", en: "Les Villards-sur-Thones, FR" },
          text: {
            fr: "Accueil clients, encaissement et tenue de caisse en grande distribution.",
            en: "Customer welcome, checkout and till management in retail."
          }
        },
        {
          date: { fr: "Ete 2022 · 1,5 mois", en: "Summer 2022 · 1.5 months" },
          role: { fr: "Paysagiste", en: "Landscaper" },
          org: "Niwaki Paysage",
          place: { fr: "Thones", en: "Thones, FR" },
          text: {
            fr: "Tonte, taille et entretien d'espaces verts, terrassement et outillage professionnel.",
            en: "Mowing, pruning and green-space maintenance, earthwork and professional tooling."
          }
        },
        {
          date: { fr: "Ete 2021 · 1,5 mois", en: "Summer 2021 · 1.5 months" },
          role: { fr: "Service salle & bar", en: "Dining & bar service" },
          org: "Le Colomban",
          place: { fr: "Les Villards-sur-Thones", en: "Les Villards-sur-Thones, FR" },
          text: {
            fr: "Service en salle et au bar, mise en place, encaissement et coordination avec la cuisine.",
            en: "Table and bar service, setup, payment handling and coordination with the kitchen."
          }
        }
      ],
      educationTitle: { fr: "Formation", en: "Education" },
      education: [
        {
          tag: { fr: "En cours · derniere annee", en: "Ongoing · final year" },
          date: { fr: "Depuis 2023", en: "Since 2023" },
          title: { fr: "BUT Informatique", en: "BUT Computer Science" },
          org: { fr: "IUT d'Annecy - Universite Savoie Mont Blanc", en: "IUT of Annecy - Savoie Mont Blanc University" },
          text: {
            fr: "Developpement web et logiciel, bases de donnees, gestion de projet et conception d'interfaces. Derniere annee en alternance.",
            en: "Web and software development, databases, project management and interface design. Final year as an apprenticeship."
          }
        },
        {
          tag: { fr: "Obtenu · Mention AB", en: "Obtained · with honors" },
          date: { fr: "2023", en: "2023" },
          title: { fr: "Baccalaureat STI2D", en: "STI2D Baccalaureate" },
          org: { fr: "Lycee Louis Lachenal - Argonay", en: "Louis Lachenal High School - Argonay" },
          text: {
            fr: "Bac technologique STI2D, option systemes d'information et numerique (SIN). Mention Assez Bien.",
            en: "STI2D technological baccalaureate, digital and information systems option (SIN). Passed with honors."
          }
        }
      ]
    },

    projects: {
      id: "projets",
      eyebrow: { fr: "// ce que j'ai construit", en: "// what i've built" },
      title: { fr: "Projets selectionnes", en: "Selected projects" },
      intro: {
        fr: "Un apercu de projets menes en formation et en autonomie, du web a l'ERP.",
        en: "A cross-section of projects built during my studies and on my own, from web to ERP."
      },
      items: [
        {
          featured: true,
          tags: ["Laravel", "PHP", "PostgreSQL", "JavaScript"],
          date: "2024 - 2025",
          title: { fr: "Site type Vinted", en: "Vinted-style marketplace" },
          text: {
            fr: "Projet en equipe (5 personnes) : modelisation (MCD), base PostgreSQL via pgAdmin, puis integration en HTML / CSS / JavaScript / PHP avec le framework Laravel.",
            en: "Team project (5 people): data modeling (ERD), PostgreSQL database via pgAdmin, then integration in HTML / CSS / JavaScript / PHP with the Laravel framework."
          },
          image: "./assets/images/vinted.webp",
          link: { href: "https://github.com/FELTRINCyril", label: { fr: "GitHub", en: "GitHub" } }
        },
        {
          tags: ["Odoo", "Python", "XML", "JavaScript", "Cursor AI"],
          date: "2025 - 2026",
          title: { fr: "Parametrage & dev Odoo (CYNIA)", en: "Odoo configuration & dev (CYNIA)" },
          text: {
            fr: "Parametrage fonctionnel et developpement sur Odoo : configuration de modules et personnalisations pour un cas d'usage metier.",
            en: "Functional configuration and development on Odoo: module setup and customizations for a real business use case."
          },
          image: "",
          link: { href: "https://github.com/FELTRINCyril/CYNIA", label: { fr: "Voir le depot", en: "View repo" } }
        },
        {
          tags: ["HTML", "CSS", "JavaScript", "Claude Code"],
          date: "2026",
          title: { fr: "Ce portfolio", en: "This portfolio" },
          text: {
            fr: "Site statique en HTML / CSS / JavaScript vanilla, bilingue (FR/EN), contenu centralise dans un seul fichier de donnees et deploiement automatique sur GitHub Pages.",
            en: "Static site in vanilla HTML / CSS / JavaScript, bilingual (FR/EN), content centralized in a single data file and automatic deployment to GitHub Pages."
          },
          image: "",
          link: { href: "https://github.com/FELTRINCyril/Portfolio", label: { fr: "Code source", en: "Source code" } }
        }
      ]
    },

    skills: {
      id: "competences",
      eyebrow: { fr: "// ma boite a outils", en: "// my toolkit" },
      title: { fr: "Competences", en: "Skills" },
      intro: {
        fr: "Niveaux estimes, forcement subjectifs. Odoo par exemple : presque un an de pratique quotidienne, mais l'ecosysteme est immense. A prendre comme des reperes, pas comme une note.",
        en: "Self-estimated levels, necessarily subjective. Odoo for instance: nearly a year of daily practice, yet the ecosystem is huge. Read them as landmarks, not grades."
      },
      graphsCaption: { fr: "Vue par domaine", en: "By area" },
      // icon = nom Iconify (charge via api.iconify.design). value = niveau 0-100.
      categories: [
        {
          key: "dev", icon: "ph:code-bold", label: { fr: "Developpement", en: "Development" },
          items: [
            { label: "HTML", icon: "logos:html-5", value: 80 },
            { label: "CSS", icon: "logos:css-3", value: 80 },
            { label: "JavaScript", icon: "logos:javascript", value: 80 },
            { label: "Bootstrap", icon: "logos:bootstrap", value: 80 },
            { label: "Python", icon: "logos:python", value: 60 },
            { label: "XML", icon: "vscode-icons:file-type-xml", value: 80 }
          ]
        },
        {
          key: "erp", icon: "ph:buildings-bold", label: { fr: "ERP", en: "ERP" },
          items: [
            { label: "Odoo", icon: "simple-icons:odoo", value: 80 },
            { label: "Dynamics", icon: "simple-icons:dynamics365", value: 60 }
          ]
        },
        {
          key: "data", icon: "ph:database-bold", label: { fr: "Bases de donnees", en: "Databases" },
          items: [
            { label: "PostgreSQL", icon: "logos:postgresql", value: 63 },
            { label: "pgAdmin", icon: "devicon:postgresql", value: 40 },
            { label: "MongoDB", icon: "logos:mongodb-icon", value: 60 }
          ]
        },
        {
          key: "tools", icon: "ph:wrench-bold", label: { fr: "Outils & IA", en: "Tools & AI" },
          items: [
            { label: "Git", icon: "logos:git-icon", value: 68 },
            { label: "Docker", icon: "logos:docker-icon", value: 60 },
            { label: "Figma", icon: "logos:figma", value: 60 },
            { label: "Notion", icon: "logos:notion-icon", value: 60 },
            { label: "Cursor", icon: "simple-icons:cursor", value: 80 },
            { label: "Claude AI", icon: "logos:claude-icon", value: 100 },
            { label: "Gemini", icon: "logos:google-gemini", value: 80 }
          ]
        },
        {
          key: "env", icon: "ph:desktop-bold", label: { fr: "Environnements", en: "Environments" },
          items: [
            { label: "macOS", icon: "logos:apple", value: 100 },
            { label: "Linux", icon: "logos:linux-tux", value: 60 },
            { label: "Windows", icon: "logos:microsoft-windows-icon", value: 80 },
            { label: "Excel", icon: "vscode-icons:file-type-excel", value: 70 }
          ]
        }
      ]
    },

    contact: {
      id: "contact",
      eyebrow: { fr: "// prendre contact", en: "// get in touch" },
      title: { fr: "Travaillons ensemble", en: "Let's work together" },
      intro: {
        fr: "Une question, un projet Odoo, une opportunite ? Ecrivez-moi, je reponds rapidement.",
        en: "A question, an Odoo project, an opportunity? Send me a message, I reply quickly."
      },
      formActionUrl: "",
      mailtoBodyIntro: {
        fr: "Message de {name} ({email}) :\n\n",
        en: "Message from {name} ({email}):\n\n"
      },
      labels: {
        name: { fr: "Nom", en: "Name" },
        email: { fr: "Email", en: "Email" },
        subject: { fr: "Sujet", en: "Subject" },
        message: { fr: "Message", en: "Message" },
        submit: { fr: "Envoyer le message", en: "Send message" }
      },
      placeholders: {
        name: { fr: "Votre nom", en: "Your name" },
        email: { fr: "vous@email.com", en: "you@email.com" },
        subject: { fr: "Objet du message", en: "Subject" },
        message: { fr: "Votre message...", en: "Your message..." }
      },
      honeypotLabel: { fr: "Ne pas remplir", en: "Do not fill" },
      success: { fr: "Message envoye, merci. Je reviens vers vous rapidement.", en: "Message sent, thank you. I will get back to you shortly." },
      errorSend: { fr: "L'envoi a echoue. Reessayez ou ecrivez-moi directement par email.", en: "Sending failed. Please try again or email me directly." },
      errorNetwork: { fr: "Erreur reseau. Reessayez plus tard.", en: "Network error. Please try again later." }
    }
  },

  ui: {
    langGroup: { fr: "Choisir la langue", en: "Choose language" },
    menu: { fr: "Menu", en: "Menu" },
    themeToLight: { fr: "Passer au theme clair", en: "Switch to light theme" },
    themeToDark: { fr: "Passer au theme sombre", en: "Switch to dark theme" },
    paletteToViolet: { fr: "Passer a la palette violette", en: "Switch to the purple palette" },
    paletteToKreaddis: { fr: "Passer a la palette Kreaddis", en: "Switch to the Kreaddis palette" },
    scrollTop: { fr: "Remonter en haut", en: "Back to top" },
    socialGithub: { fr: "Profil GitHub", en: "GitHub profile" },
    socialLinkedin: { fr: "Profil LinkedIn", en: "LinkedIn profile" },
    email: { fr: "Email", en: "Email" },
    phone: { fr: "Telephone", en: "Phone" },
    location: { fr: "Localisation", en: "Location" },
    office: { fr: "Bureau", en: "Office" },
    xpDetails: { fr: "Details", en: "Details" },
    footerRights: { fr: "Concu et code par", en: "Designed and coded by" },
    cvDownload: { fr: "Telecharger", en: "Download" },
    cvView: { fr: "Voir le CV", en: "View CV" },
    cvPath: "./assets/pdf/CV_Feltrin_Cyril.pdf",
    cvFileName: "CV_Cyril_Feltrin.pdf"
  }
};
