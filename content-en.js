window.portfolioLocales = window.portfolioLocales || {};
window.portfolioLocales.en = {
  identity: {
    shortBrand: "CF",
    fullName: "Cyril Feltrin"
  },
  nav: [
    { href: "#a-propos", label: "About" },
    { href: "#competences", label: "Skills" },
    { href: "#projets", label: "Project" },
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
        url: "https://github.com/TON_COMPTE_GITHUB",
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
      pdfPath: "./CV_Feltrin_Cyril.pdf",
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
      cards: [
        {
          title: "Profile",
          list: [
            "Name: Cyril Feltrin",
            "Location: Les Villards-sur-Thones (74)",
            "Age: 19",
            "Track: BUT Computer Science — Project management"
          ]
        },
        {
          title: "Interests",
          list: ["Motorcycling and snowboarding", "Strength training (5x/week)", "Movies (action / sci-fi)"]
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
      title: "Featured project",
      date: "2024 - 2025 | University project (IUT Annecy)",
      cardTitle: "Vinted-like marketplace rebuild",
      text:
        "Team project (5 people) to rebuild a full site: data modeling (PowerAMC / MCD), PostgreSQL database (pgAdmin), then the web stack with HTML, CSS, JavaScript, PHP, and the Laravel framework."
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
