window.portfolioLocales = window.portfolioLocales || {};
window.portfolioLocales.fr = {
  identity: {
    shortBrand: "CF",
    fullName: "Cyril Feltrin"
  },
  nav: [
    { href: "#a-propos", label: "A propos" },
    { href: "#competences", label: "Competences" },
    { href: "#projets", label: "Projets" },
    { href: "#experience", label: "Experience" },
    { href: "#formation", label: "Formation" },
    { href: "#contact", label: "Contact" }
  ],
  hero: {
    kicker: "ETUDIANT EN BUT INFORMATIQUE",
    titleBeforeAccent: "Je conçois des experiences web ",
    titleAccent: "simples, elegantes et efficaces",
    text: "Je suis Cyril Feltrin, 19 ans, en 2e annee de BUT Informatique (IUT d'Annecy). Je cherche a construire des interfaces modernes avec un vrai souci du detail, de la performance et de l'experience utilisateur.",
    contactCta: { href: "#contact", label: "Me contacter" },
    social: [
      {
        id: "github",
        url: "https://github.com/FELTRINCyril",
        ariaLabel: "Profil GitHub"
      },
      {
        id: "linkedin",
        url: "https://www.linkedin.com/in/TON_PROFIL_LINKEDIN/",
        ariaLabel: "Profil LinkedIn"
      }
    ],
    socialGroupAria: "Profils externes",
    cvGroupAria: "Curriculum vitae PDF",
    cv: {
      pdfPath: "./assets/pdf/CV_Feltrin_Cyril.pdf",
      downloadFileName: "CV_Cyril_Feltrin.pdf",
      modeGroupAria: "Choisir : telecharger ou ouvrir le PDF",
      segmentDownload: "Telecharger",
      segmentOpen: "Voir",
      ctaDownload: "CV — telecharger",
      ctaOpen: "CV — ouvrir en ligne"
    }
  },
  sections: {
    about: {
      id: "a-propos",
      title: "A propos",
      intro:
        "Mon parcours combine des experiences terrain (service, caisse, logistique, paysagisme) et un cursus technique en informatique. Cette base me donne de la rigueur, de l'adaptabilite et un bon sens du travail en equipe.",
      interestsTitle: "Centres d'interet",
      interestsAria: "Galerie : centres d'interet",
      interestsCaption: "Passe ou place le curseur pour agrandir un panneau.",
      interests: [
        {
          image: "./assets/images/interests/CI_Moto.jpg",
          label: "Moto",
          alt: "Moto cross et balades au guidon."
        },
        {
          image: "./assets/images/interests/CI_Snowboard.jpg",
          label: "Snowboard",
          alt: "Glisse au snowboard dans les montagnes."
        },
        {
          image: "./assets/images/interests/CI_Muscu.jpg",
          label: "Musculation",
          alt: "Seances de musculation en salle plusieurs fois par semaine."
        },
        {
          image: "./assets/images/interests/CI_Cinema.jpeg",
          label: "Cinema",
          alt: "Cinema, surtout action et science-fiction."
        }
      ],
      cards: [
        {
          title: "Profil",
          rows: [
            { key: "Nom", value: "Cyril Feltrin" },
            { key: "Localisation", value: "Les Villards-sur-Thones (74)" },
            { key: "Age", value: "19 ans" },
            { key: "Parcours", value: "BUT Informatique - Gestion de projet" }
          ]
        }
      ]
    },
    skills: {
      id: "competences",
      title: "Competences",
      leftCaption: "Niveaux estimes",
      rightCaption: "Radar (memes competences)",
      carouselPrev: "Page competences precedente",
      carouselNext: "Page competences suivante",
      pages: [
        {
          label: "Web & interface",
          items: [
            { iconEmoji: "</>", label: "HTML5", value: 80 },
            { iconEmoji: "{}", label: "CSS3", value: 78 },
            { iconEmoji: "JS", label: "JavaScript", value: 65 },
            { iconEmoji: "PHP", label: "PHP", value: 60 },
            { iconEmoji: "UX", label: "UX/UI", value: 70 },
            { iconEmoji: "LV", label: "Laravel", value: 58 }
          ]
        },
        {
          label: "Donnees, outils & langages",
          items: [
            { iconEmoji: "pg", label: "PostgreSQL", value: 60 },
            { iconEmoji: "Ad", label: "pgAdmin", value: 65 },
            { iconEmoji: "Py", label: "Python", value: 45 },
            { iconEmoji: "C#", label: "C#", value: 40 },
            { iconEmoji: "C", label: "C", value: 50 },
            { iconEmoji: "Od", label: "Odoo", value: 55 }
          ]
        }
      ]
    },
    project: {
      id: "projets",
      title: "Projets marquants",
      carouselAria: "Sélection d'un projet",
      carouselPrev: "Projet precedent",
      carouselNext: "Projet suivant",
      dotAriaTpl: "Voir le projet {num} sur {total}",
      items: [
        {
          hue: "a",
          tag: "Web · equipe · IUT Annecy",
          date: "2024 - 2025 | Projet universitaire",
          title: "Recreation d'un site type Vinted",
          text:
            "Travail en equipe (5 personnes) : modelisation (PowerAMC / MCD), PostgreSQL (pgAdmin), puis stack HTML / CSS / JavaScript / PHP et Laravel.",
          image: "./assets/images/PM_Vinted.png",
          links: [{ href: "https://github.com/FELTRINCyril", label: "Voir sur GitHub" }]
        },
        {
          hue: "b",
          tag: "Interface · cours",
          date: "2024 | Projet pedagogique",
          title: "Espace client responsive accessible",
          text:
            "Maquettes haute-fidelite puis integration responsive avec theming dynamique et formulaires verifies cote utilisateur.",
          image: "",
          links: []
        },
        {
          hue: "c",
          tag: "Ce site",
          date: "2025 | Portfolio personnel",
          title: "Portfolio en statique ultra leger",
          text:
            "HTML / CSS / JavaScript vanilla, bilangue avec stockage local, animations thematiques sobres et deploiement GitHub Actions sur Pages.",
          image: "",
          links: [{ href: "https://github.com/FELTRINCyril/Portfolio", label: "Code source" }]
        }
      ]
    },
    experience: {
      id: "experience",
      title: "Experiences professionnelles",
      intro:
        "Des missions en contact client et en equipe, en parallele de ma formation : rigueur, sens du service et polyvalence.",
      items: [
        {
          tag: "Grande distribution",
          date: "Ete 2023 & Ete 2024 — 3 mois",
          title: "Intermarche",
          subtitle: "Les Villards-sur-Thones",
          role: "Caissier · Mise en rayon",
          text:
            "Accueil et encaissement, reapprovisionnement des rayons, tenue de caisse et coordination avec l'equipe magasin.",
          image: "./assets/images/EP_Intermarche.jpg"
        },
        {
          tag: "Paysagisme",
          date: "Ete 2022 — 1,5 mois",
          title: "Niwaki Paysage",
          subtitle: "Thones",
          role: "Operateur terrain",
          text: "Tonte, taille et entretien des espaces verts, terrassement et utilisation d'outillage professionnel.",
          variant: "nature"
        },
        {
          tag: "Restauration",
          date: "Ete 2021 — 1,5 mois",
          title: "Le Colomban",
          subtitle: "Les Villards-sur-Thones",
          role: "Service salle & bar",
          text: "Service en salle et au bar, mise en place, encaissement et debarrassage en coordination avec la cuisine.",
          variant: "hospitality"
        }
      ]
    },
    education: {
      id: "formation",
      title: "Formation",
      intro:
        "Parcours oriente developpement logiciel, gestion de projet et culture numerique — du baccalaureat technique au BUT Informatique.",
      items: [
        {
          tag: "En cours",
          date: "2024 - 2025",
          title: "IUT d'Annecy — Universite Savoie Mont Blanc",
          subtitle: "BUT Informatique — parcours Gestion de projet",
          text:
            "Developpement web et logiciel, bases de donnees, gestion de projet agile, travaux en equipe et conception d'interfaces.",
          variant: "university"
        },
        {
          tag: "Baccalaureat",
          date: "2023",
          title: "Lycee Louis Lachenal",
          subtitle: "Argonay — filiere STI2D",
          text: "Baccalaureat STI2D, option systemes d'information et numerique (SIN).",
          variant: "school"
        }
      ]
    },
    contact: {
      id: "contact",
      title: "Contact",
      intro: "Disponible pour alternance, stage, ou mission en developpement web.",
      links: [
        { href: "mailto:cyril.feltrin@etu.univ-smb.fr", label: "cyril.feltrin@etu.univ-smb.fr" },
        { href: "tel:+33641802477", label: "06 41 80 24 77" }
      ],
      mailtoRecipient: "cyril.feltrin@etu.univ-smb.fr",
      mailtoBodyIntro: "Message de {name} ({email}) :\n\n",
      labels: {
        name: "Nom",
        email: "Email",
        subject: "Sujet",
        message: "Message",
        submit: "Envoyer"
      },
      placeholders: {
        name: "Votre nom",
        email: "vous@email.com",
        subject: "Objet du message",
        message: "Votre message..."
      },
      honeypotLabel: "Ne pas remplir",
      successMessage: "Message envoye avec succes.",
      fallbackHint:
        "Configure formActionUrl dans content-fr.js / content-en.js avec ton URL gratuite Formspree (voir README).",
      formActionUrl: ""
    }
  },
  ui: {
    menu: "Menu",
    languageGroup: "Choisir la langue",
    themeToLight: "Passer au theme clair",
    themeToDark: "Passer au theme sombre",
    footerRights: "Tous droits reserves.",
    scrollTop: "Remonter en haut",
    formErrorSend: "L'envoi a echoue. Verifie ton URL Formspree ou reessaie plus tard.",
    formErrorNetwork: "Erreur reseau. Reessaie plus tard."
  }
};
