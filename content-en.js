window.portfolioLocales = window.portfolioLocales || {};
window.portfolioLocales.en = {
  identity: {
    shortBrand: "CF",
    fullName: "Cyril Feltrin"
  },
  nav: [
    { href: "#a-propos", label: "About" },
    { href: "#competences", label: "Skills" },
    { href: "#projets", label: "Projects" },
    { href: "#experience", label: "Experience" },
    { href: "#formation", label: "Education" },
    { href: "#contact", label: "Contact" }
  ],
  hero: {
    kicker: "IT STUDENT (BUT)",
    titleBeforeAccent: "I design web experiences that are ",
    titleAccent: "simple, elegant, and effective",
    text: "I am Cyril Feltrin, 19, in my second year of a BUT in Computer Science (IUT Annecy). I focus on modern interfaces with attention to detail, performance, and user experience.",
    contactCta: { href: "#contact", label: "Contact me" },
    social: [
      {
        id: "github",
        url: "https://github.com/FELTRINCyril",
        ariaLabel: "GitHub profile"
      },
      {
        id: "linkedin",
        url: "https://www.linkedin.com/in/TON_PROFIL_LINKEDIN/",
        ariaLabel: "LinkedIn profile"
      }
    ],
    socialGroupAria: "Social profiles",
    cvGroupAria: "PDF resume",
    cv: {
      pdfPath: "./assets/pdf/CV_Feltrin_Cyril.pdf",
      downloadFileName: "CV_Cyril_Feltrin.pdf",
      modeGroupAria: "Choose: download or open the PDF",
      segmentDownload: "Download",
      segmentOpen: "View",
      ctaDownload: "CV — download",
      ctaOpen: "CV — open in new tab"
    }
  },
  sections: {
    about: {
      id: "a-propos",
      title: "About",
      intro:
        "My background blends hands-on jobs (hospitality, cashier, logistics, landscaping) with a technical IT curriculum. That mix gives me discipline, adaptability, and solid teamwork.",
      interestsTitle: "Interests",
      interestsAria: "Image gallery — interests",
      interestsCaption: "Hover or slide to expand a panel.",
      interests: [
        {
          image: "./assets/images/interests/CI_Moto.jpg",
          label: "Motorcycling",
          alt: "Motorcycling and trail riding."
        },
        {
          image: "./assets/images/interests/CI_Snowboard.jpg",
          label: "Snowboarding",
          alt: "Snowboarding in the mountains."
        },
        {
          image: "./assets/images/interests/CI_Muscu.jpg",
          label: "Strength training",
          alt: "Gym workouts several times a week."
        },
        {
          image: "./assets/images/interests/CI_Cinema.jpeg",
          label: "Movies",
          alt: "Action and science-fiction movies."
        }
      ],
      cards: [
        {
          title: "Profile",
          list: [
            "Name: Cyril Feltrin",
            "Location: Les Villards-sur-Thones (74)",
            "Age: 19",
            "Track: BUT Computer Science — Project management"
          ]
        }
      ]
    },
    skills: {
      id: "competences",
      title: "Skills",
      leftCaption: "Estimated levels",
      rightCaption: "Radar (same skills)",
      carouselPrev: "Previous skills page",
      carouselNext: "Next skills page",
      pages: [
        {
          label: "Web & UI",
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
          label: "Data, tools & languages",
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
      title: "Featured projects",
      carouselAria: "Project picker",
      carouselPrev: "Previous project",
      carouselNext: "Next project",
      dotAriaTpl: "Show project {num} of {total}",
      items: [
        {
          hue: "a",
          tag: "Web · team · IUT Annecy",
          date: "2024 - 2025 | University course",
          title: "Vinted-like marketplace rebuild",
          text:
            "Team rebuild (5 people): data modeling (PowerAMC / MCD), PostgreSQL (pgAdmin), then HTML / CSS / JavaScript / PHP and Laravel.",
          image: "./assets/images/projects/vinted.jpg",
          links: [{ href: "https://github.com/FELTRINCyril", label: "View on GitHub" }]
        },
        {
          hue: "b",
          tag: "UI · course work",
          date: "2024 | Guided project",
          title: "Accessible responsive client portal",
          text:
            "High-fidelity mockups, responsive layout, themed UI, client-side validated forms.",
          image: "",
          links: []
        },
        {
          hue: "c",
          tag: "This site",
          date: "2025 | Portfolio",
          title: "Static-first portfolio shell",
          text:
            "Vanilla HTML / CSS / JavaScript with bilingual UX, restrained motion, GitHub Actions to Pages.",
          image: "",
          links: [{ href: "https://github.com/FELTRINCyril/Portfolio", label: "Source code" }]
        }
      ]
    },
    experience: {
      id: "experience",
      title: "Work experience",
      items: [
        {
          date: "Summer 2023 & 2024 (3 months)",
          title: "Intermarche — Les Villards-sur-Thones",
          text: "Cashier and shelf stocking."
        },
        {
          date: "Summer 2022 (1.5 months)",
          title: "Niwaki Paysage — Thones",
          text: "Landscaping: mowing, trimming, earthworks."
        },
        {
          date: "Summer 2021 (1.5 months)",
          title: "Le Colomban — Les Villards-sur-Thones",
          text: "Waiter and bar service, setup and clearing."
        }
      ]
    },
    education: {
      id: "formation",
      title: "Education",
      items: [
        {
          date: "2024 - 2025",
          title: "IUT Annecy — Universite Savoie Mont Blanc",
          text: "Second year of BUT Computer Science, project management track."
        },
        {
          date: "2023",
          title: "Louis Lachenal High School — Argonay",
          text: "French baccalaureate STI2D, information systems option."
        }
      ]
    },
    contact: {
      id: "contact",
      title: "Contact",
      intro: "Open to apprenticeships, internships, or web development work.",
      links: [
        { href: "mailto:cyril.feltrin@etu.univ-smb.fr", label: "cyril.feltrin@etu.univ-smb.fr" },
        { href: "tel:+33641802477", label: "+33 6 41 80 24 77" }
      ],
      mailtoRecipient: "cyril.feltrin@etu.univ-smb.fr",
      mailtoBodyIntro: "Message from {name} ({email}) :\n\n",
      labels: {
        name: "Name",
        email: "Email",
        subject: "Subject",
        message: "Message",
        submit: "Send"
      },
      placeholders: {
        name: "Your name",
        email: "you@email.com",
        subject: "What is it about?",
        message: "Your message..."
      },
      honeypotLabel: "Do not fill",
      successMessage: "Message sent successfully.",
      fallbackHint:
        "Set formActionUrl in content-fr.js / content-en.js with your free Formspree URL (see README).",
      formActionUrl: ""
    }
  },
  ui: {
    menu: "Menu",
    languageGroup: "Choose language",
    themeToLight: "Switch to light theme",
    themeToDark: "Switch to dark theme",
    footerRights: "All rights reserved.",
    scrollTop: "Back to top",
    formErrorSend: "Send failed. Check your Formspree URL or try again later.",
    formErrorNetwork: "Network error. Please try again later."
  }
};
