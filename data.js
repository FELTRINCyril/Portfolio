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
 * Une traduction manquante ? Elle saute aux yeux : fr et en sont cote a cote.
 *
 * L'age est calcule automatiquement depuis la date de naissance (birthdate),
 * il n'y a donc rien a mettre a jour chaque annee.
 */

window.portfolioData = {
  identity: {
    shortBrand: "CF",
    fullName: "Cyril Feltrin",
    // Date de naissance -> age auto (format AAAA-MM-JJ). Ne pas traduire.
    birthdate: "2005-09-05",
    email: "cyril.feltrin@etu.univ-smb.fr",
    phoneDisplay: "06 41 80 24 77",
    phoneHref: "tel:+33641802477",
    github: "https://github.com/FELTRINCyril",
    linkedin: "https://www.linkedin.com/in/cyril-feltrin/"
  },

  nav: [
    { href: "#a-propos", label: { fr: "A propos", en: "About" } },
    { href: "#competences", label: { fr: "Competences", en: "Skills" } },
    { href: "#projets", label: { fr: "Projets", en: "Projects" } },
    { href: "#experience", label: { fr: "Experience", en: "Experience" } },
    { href: "#formation", label: { fr: "Formation", en: "Education" } },
    { href: "#contact", label: { fr: "Contact", en: "Contact" } }
  ],

  hero: {
    kicker: { fr: "Developpeur Odoo & web", en: "Odoo & web developer" },
    // Le titre a une partie mise en accent (couleur) au milieu.
    titleBefore: { fr: "Je transforme des besoins metier en ", en: "I turn business needs into " },
    titleAccent: { fr: "solutions concretes", en: "real-world solutions" },
    titleAfter: { fr: ".", en: "." },
    text: {
      fr: "Cyril Feltrin, {age} ans. En 3e annee de BUT Informatique, aujourd'hui a 100% en entreprise : je suis en alternance chez Kreaddis (ex-Kreatys) sur des projets Odoo et web. Je poursuis l'aventure en CDI l'an prochain, dans la meme equipe.",
      en: "Cyril Feltrin, {age}. Third-year Computer Science student, now working full-time: I am an apprentice at Kreaddis (formerly Kreatys) on Odoo and web projects. I continue the journey on a permanent contract next year, with the same team."
    },
    photo: "./assets/images/profil.webp",
    photoAlt: { fr: "Portrait de Cyril Feltrin", en: "Portrait of Cyril Feltrin" },
    primaryCta: { href: "#contact", label: { fr: "Me contacter", en: "Get in touch" } },
    cv: {
      pdfPath: "./assets/pdf/CV_Feltrin_Cyril.pdf",
      downloadFileName: "CV_Cyril_Feltrin.pdf",
      download: { fr: "Telecharger le CV", en: "Download CV" },
      open: { fr: "Voir le CV", en: "View CV" }
    }
  },

  sections: {
    about: {
      id: "a-propos",
      title: { fr: "A propos", en: "About" },
      intro: {
        fr: "Mon parcours mele des experiences de terrain (service, caisse, logistique, paysagisme) et un cursus technique en informatique. J'y ai gagne de la rigueur, de la polyvalence et le sens du travail en equipe - des qualites que j'applique aujourd'hui au developpement Odoo et web.",
        en: "My background blends hands-on jobs (hospitality, checkout, logistics, landscaping) with a technical degree in computer science. It gave me rigor, versatility and a real team spirit - qualities I now bring to Odoo and web development."
      },
      profileTitle: { fr: "Profil", en: "Profile" },
      profile: [
        { key: { fr: "Nom", en: "Name" }, value: { fr: "Cyril Feltrin", en: "Cyril Feltrin" } },
        { key: { fr: "Localisation", en: "Location" }, value: { fr: "Les Villards-sur-Thones (74)", en: "Les Villards-sur-Thones (74), France" } },
        // {age} est remplace automatiquement par l'age calcule.
        { key: { fr: "Age", en: "Age" }, value: { fr: "{age} ans", en: "{age} years old" } },
        { key: { fr: "Statut", en: "Status" }, value: { fr: "Alternant BUT Info, bientot en CDI (Kreaddis)", en: "CS apprentice, soon on a permanent contract (Kreaddis)" } }
      ],
      interestsTitle: { fr: "Centres d'interet", en: "Interests" },
      interests: [
        { image: "./assets/images/interests/moto.webp", label: { fr: "Moto", en: "Motorcycle" }, alt: { fr: "Moto", en: "Motorcycle" } },
        { image: "./assets/images/interests/snowboard.webp", label: { fr: "Snowboard", en: "Snowboarding" }, alt: { fr: "Snowboard", en: "Snowboarding" } },
        { image: "./assets/images/interests/muscu.webp", label: { fr: "Musculation", en: "Weight training" }, alt: { fr: "Musculation", en: "Weight training" } },
        // Pas d'image pour le parachute : une tuile "accent" avec libelle est generee.
        { image: "", label: { fr: "Parachute", en: "Skydiving" }, note: { fr: "PAC en aout", en: "License course in August" } }
      ]
    },

    skills: {
      id: "competences",
      title: { fr: "Competences", en: "Skills" },
      intro: {
        fr: "Niveaux estimes - forcement subjectifs. Odoo par exemple : presque un an de pratique quotidienne, mais l'ecosysteme est immense. A prendre comme des reperes, pas comme une note.",
        en: "Self-estimated levels - necessarily subjective. Odoo for instance: nearly a year of daily practice, yet the ecosystem is huge. Read them as landmarks, not grades."
      },
      barsCaption: { fr: "Niveaux par domaine", en: "Levels by area" },
      radarCaption: { fr: "Vue d'ensemble", en: "Overview" },
      // Chaque categorie = un groupe de barres. Le radar reprend toutes les competences.
      categories: [
        {
          label: { fr: "ERP", en: "ERP" },
          items: [
            { label: "Odoo", value: 70 },
            { label: "Dynamics", value: 35 }
          ]
        },
        {
          label: { fr: "Developpement & design", en: "Development & design" },
          items: [
            { label: "HTML / CSS / JS", value: 78 },
            { label: "XML", value: 75 },
            { label: "Python", value: 50 },
            { label: "UX/UI (Figma)", value: 62 }
          ]
        },
        {
          label: { fr: "Bases de donnees", en: "Databases" },
          items: [
            { label: "PostgreSQL", value: 62 },
            { label: "pgAdmin", value: 65 },
            { label: "MongoDB", value: 45 }
          ]
        }
      ]
    },

    projects: {
      id: "projets",
      title: { fr: "Projets", en: "Projects" },
      intro: {
        fr: "Quelques projets menes en formation et en autonomie.",
        en: "A few projects built during my studies and on my own."
      },
      items: [
        {
          tag: { fr: "Web - equipe - IUT Annecy", en: "Web - team - IUT Annecy" },
          date: { fr: "2024 - 2025 | Projet universitaire", en: "2024 - 2025 | University project" },
          title: { fr: "Site type Vinted", en: "Vinted-style marketplace" },
          text: {
            fr: "Projet en equipe (5 personnes) : modelisation (MCD), base PostgreSQL via pgAdmin, puis integration en HTML / CSS / JavaScript / PHP avec le framework Laravel.",
            en: "Team project (5 people): data modeling (ERD), PostgreSQL database via pgAdmin, then integration in HTML / CSS / JavaScript / PHP with the Laravel framework."
          },
          image: "./assets/images/vinted.webp",
          link: { href: "https://github.com/FELTRINCyril", label: { fr: "GitHub", en: "GitHub" } }
        },
        {
          tag: { fr: "ERP - Odoo - IUT Annecy", en: "ERP - Odoo - IUT Annecy" },
          date: { fr: "2025 | Projet universitaire", en: "2025 | University project" },
          title: { fr: "Parametrage et dev Odoo (CYNIA)", en: "Odoo configuration & dev (CYNIA)" },
          text: {
            fr: "Parametrage fonctionnel et developpement sur Odoo : configuration de modules et personnalisations pour repondre a un cas d'usage metier.",
            en: "Functional configuration and development on Odoo: module setup and customizations to fit a real business use case."
          },
          image: "",
          link: { href: "https://github.com/FELTRINCyril/CYNIA", label: { fr: "Voir le depot", en: "View repo" } }
        },
        {
          tag: { fr: "Ce site", en: "This site" },
          date: { fr: "2025 | Portfolio personnel", en: "2025 | Personal portfolio" },
          title: { fr: "Ce portfolio", en: "This portfolio" },
          text: {
            fr: "Site statique en HTML / CSS / JavaScript vanilla, bilingue (FR/EN), theme clair/sombre, contenu centralise dans un seul fichier de donnees et deploiement automatique sur GitHub Pages.",
            en: "Static site in vanilla HTML / CSS / JavaScript, bilingual (FR/EN), light/dark theme, content centralized in a single data file and automatic deployment to GitHub Pages."
          },
          image: "",
          link: { href: "https://github.com/FELTRINCyril/Portfolio", label: { fr: "Code source", en: "Source code" } }
        }
      ]
    },

    experience: {
      id: "experience",
      title: { fr: "Experience", en: "Experience" },
      intro: {
        fr: "Du developpement Odoo aujourd'hui, apres plusieurs saisons en contact client et sur le terrain.",
        en: "Odoo development today, after several seasons in customer-facing and hands-on jobs."
      },
      items: [
        {
          date: { fr: "2025 - 2026 - Alternance", en: "2025 - 2026 - Apprenticeship" },
          role: { fr: "Developpeur Odoo & web", en: "Odoo & web developer" },
          org: "Kreaddis",
          place: { fr: "Chavanod", en: "Chavanod, France" },
          text: {
            fr: "Alternance de 3e annee de BUT Informatique, ex-Kreatys. Developpement et parametrage Odoo, web, en equipe.",
            en: "Third-year apprenticeship (BUT Computer Science), formerly Kreatys. Odoo development and configuration, web work, in a team."
          },
          current: true
        },
        {
          date: { fr: "Ete 2025 - 1 mois", en: "Summer 2025 - 1 month" },
          role: { fr: "Developpeur", en: "Developer" },
          org: "Kreaddis",
          place: { fr: "Chavanod", en: "Chavanod, France" },
          text: {
            fr: "Mission de developpement d'un mois chez Kreaddis (ex-Kreatys) entre deux annees de formation.",
            en: "One-month development assignment at Kreaddis (formerly Kreatys) between two academic years."
          }
        },
        {
          date: { fr: "2025 - Stage 2 mois", en: "2025 - 2-month internship" },
          role: { fr: "Stagiaire developpement", en: "Development intern" },
          org: "Kreaddis",
          place: { fr: "Chavanod", en: "Chavanod, France" },
          text: {
            fr: "Stage de 2e annee de BUT Informatique chez Kreaddis (ex-Kreatys) : premiere immersion sur Odoo et le developpement en entreprise.",
            en: "Second-year internship (BUT Computer Science) at Kreaddis (formerly Kreatys): first immersion in Odoo and professional development."
          }
        },
        {
          date: { fr: "Ete 2024 - 1,5 mois", en: "Summer 2024 - 1.5 months" },
          role: { fr: "Mise en rayon", en: "Stock replenishment" },
          org: "Intermarche",
          place: { fr: "Les Villards-sur-Thones", en: "Les Villards-sur-Thones, France" },
          text: {
            fr: "Reapprovisionnement des rayons, gestion des stocks et coordination avec l'equipe magasin.",
            en: "Shelf restocking, inventory handling and coordination with the store team."
          },
          image: "./assets/images/intermarche.webp"
        },
        {
          date: { fr: "Ete 2023 - 1,5 mois", en: "Summer 2023 - 1.5 months" },
          role: { fr: "Caissier", en: "Cashier" },
          org: "Intermarche",
          place: { fr: "Les Villards-sur-Thones", en: "Les Villards-sur-Thones, France" },
          text: {
            fr: "Accueil clients, encaissement et tenue de caisse en grande distribution.",
            en: "Customer welcome, checkout and till management in retail."
          }
        },
        {
          date: { fr: "Ete 2022 - 1,5 mois", en: "Summer 2022 - 1.5 months" },
          role: { fr: "Paysagiste", en: "Landscaper" },
          org: "Niwaki Paysage",
          place: { fr: "Thones", en: "Thones, France" },
          text: {
            fr: "Tonte, taille et entretien d'espaces verts, terrassement et utilisation d'outillage professionnel.",
            en: "Mowing, pruning and green-space maintenance, earthwork and professional tooling."
          }
        },
        {
          date: { fr: "Ete 2021 - 1,5 mois", en: "Summer 2021 - 1.5 months" },
          role: { fr: "Service salle & bar", en: "Dining & bar service" },
          org: "Le Colomban",
          place: { fr: "Les Villards-sur-Thones", en: "Les Villards-sur-Thones, France" },
          text: {
            fr: "Service en salle et au bar, mise en place, encaissement et coordination avec la cuisine.",
            en: "Table and bar service, setup, payment handling and coordination with the kitchen."
          }
        }
      ]
    },

    education: {
      id: "formation",
      title: { fr: "Formation", en: "Education" },
      intro: {
        fr: "Un parcours oriente developpement logiciel et gestion de projet.",
        en: "A path focused on software development and project management."
      },
      items: [
        {
          tag: { fr: "En cours - derniere annee", en: "Ongoing - final year" },
          date: { fr: "Depuis 2023", en: "Since 2023" },
          title: { fr: "BUT Informatique", en: "BUT Computer Science" },
          org: { fr: "IUT d'Annecy - Universite Savoie Mont Blanc", en: "IUT of Annecy - Savoie Mont Blanc University" },
          text: {
            fr: "Developpement web et logiciel, bases de donnees, gestion de projet et conception d'interfaces. Derniere annee en alternance.",
            en: "Web and software development, databases, project management and interface design. Final year as an apprenticeship."
          }
        },
        {
          tag: { fr: "Obtenu - Mention AB", en: "Obtained - with honors" },
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

    contact: {
      id: "contact",
      title: { fr: "Contact", en: "Contact" },
      intro: {
        fr: "Une question, un projet Odoo ou web, une opportunite ? Ecrivez-moi, je reponds rapidement.",
        en: "A question, an Odoo or web project, an opportunity? Send me a message, I reply quickly."
      },
      // Formulaire : laisser vide pour un mailto prerempli, ou coller une URL Formspree.
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
        submit: { fr: "Envoyer", en: "Send" }
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
    scrollTop: { fr: "Remonter en haut", en: "Back to top" },
    socialGithub: { fr: "Profil GitHub", en: "GitHub profile" },
    socialLinkedin: { fr: "Profil LinkedIn", en: "LinkedIn profile" },
    email: { fr: "Email", en: "Email" },
    phone: { fr: "Telephone", en: "Phone" },
    footerRights: { fr: "Tous droits reserves.", en: "All rights reserved." },
    // --- TEMP : bascule de couleur d'accent, a supprimer apres validation ---
    accentTest: { fr: "Test couleur", en: "Accent test" }
  }
};
