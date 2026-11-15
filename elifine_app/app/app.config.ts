export default defineAppConfig({
  global: {
    picture: {
      dark: "/images/eli-headshot.png",
      light: "/images/eli-headshot.png",
      alt: "Eli Fine",
    },
  },
  ui: {
    colors: {
      primary: "cyan",
      secondary: "blue",
      success: "green",
      info: "blue",
      warning: "yellow",
      error: "red",
      neutral: "slate",
    },
    pageHero: {
      slots: {
        container: "py-18 sm:py-24 lg:py-32",
        title: "mx-auto max-w-xl text-pretty text-3xl sm:text-4xl lg:text-5xl",
        description: "mt-2 text-md mx-auto max-w-2xl text-pretty sm:text-md text-muted",
      },
    },
  },
  footer: {
    credits: `© ${new Date().getFullYear()} Eli Fine`,
    colorMode: false,
    links: [
      {
        icon: "i-simple-icons-linkedin",
        to: "https://www.linkedin.com/in/elifine",
        target: "_blank",
        "aria-label": "Eli Fine on LinkedIn",
      },
      {
        icon: "i-simple-icons-github",
        to: "https://github.com/ejfine",
        target: "_blank",
        "aria-label": "Eli Fine on GitHub",
      },
      {
        icon: "i-simple-icons-googlescholar",
        to: "https://scholar.google.com/citations?user=eBFJX7QAAAAJ",
        target: "_blank",
        "aria-label": "Eli Fine on Google Scholar",
      },
      {
        icon: "i-lucide-file-text",
        to: "/resume-eli-fine.pdf",
        target: "_blank",
        "aria-label": "Eli Fine's resume (PDF)",
      },
    ],
  },
});
