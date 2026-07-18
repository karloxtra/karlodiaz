/* ==========================================================================
   Karlo Diaz — Portfolio
   Vanilla JS: view switching, project modal, reveal-on-scroll, cursor
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Project data — replace with your real projects.
     `hue` / `hue2` only drive the placeholder gradient; delete once you
     swap in real <img> elements inside index.html and modal templates.
  ------------------------------------------------------------------ */
  const PROJECTS = {
    "nordic-studio": {
      title: "Nordic Studio",
      category: "Brand Identity",
      year: "2025",
      role: "Art Direction",
      description:
        "A full identity system built around a restrained mark and a flexible grid, designed to hold up across print, signage and digital touchpoints. Replace this paragraph with a short description of the project, the brief, and your role.",
      hues: ["214,250", "230,260", "200,230"]
    },
    continuum: {
      title: "Continuum",
      category: "Editorial Design",
      year: "2025",
      role: "Layout & Typography",
      description:
        "An editorial layout system for a quarterly print publication, balancing dense text columns with generous margins. Replace this paragraph with your own project description.",
      hues: ["18,40", "10,30", "25,50"]
    },
    aperture: {
      title: "Aperture",
      category: "Photography",
      year: "2024",
      role: "Photography & Curation",
      description:
        "A curated photo series exploring light and negative space. Replace this paragraph with details about the shoot, location, and creative direction.",
      hues: ["0,20", "0,15", "0,25"]
    },
    monograph: {
      title: "Monograph",
      category: "Type System",
      year: "2024",
      role: "Type Design",
      description:
        "A custom display typeface and accompanying specimen, designed for a client who needed a distinctive voice across headlines. Replace with your own copy.",
      hues: ["265,300", "250,280", "270,310"]
    },
    fieldnotes: {
      title: "Fieldnotes",
      category: "Web Experience",
      year: "2024",
      role: "Design & Front-End",
      description:
        "A minimal, content-first website built for speed and clarity. Replace this paragraph with a summary of the goals and outcome.",
      hues: ["90,130", "80,110", "100,140"]
    },
    halcyon: {
      title: "Halcyon",
      category: "Packaging",
      year: "2023",
      role: "Packaging Design",
      description:
        "Packaging system for a small-batch product line, designed to feel handmade and premium at once. Replace this paragraph with your own description.",
      hues: ["330,10", "320,350", "340,20"]
    },
    structure: {
      title: "Structure",
      category: "Architecture Visuals",
      year: "2023",
      role: "3D Visualization",
      description:
        "A set of architectural renders exploring material, light and proportion. Replace this paragraph with details about the brief and the tools used.",
      hues: ["40,70", "30,60", "50,80"]
    },
    tidemark: {
      title: "Tidemark",
      category: "Motion",
      year: "2023",
      role: "Motion Design",
      description:
        "A short motion study exploring rhythm and typography in movement. Replace this paragraph with a summary of the piece and where it was shown.",
      hues: ["190,220", "180,210", "200,230"]
    }
  };

  /* ------------------------------------------------------------------
     View switching (Work / Contact)
  ------------------------------------------------------------------ */
  const views = document.querySelectorAll(".view");
  const navLinks = document.querySelectorAll(".nav-link, [data-view]");

  function showView(name) {
    views.forEach((v) => v.classList.toggle("is-active", v.id === `${name}-view`));
    document
      .querySelectorAll(".nav-link")
      .forEach((l) => l.classList.toggle("is-active", l.dataset.view === name));
    if (name === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  navLinks.forEach((el) => {
    el.addEventListener("click", (e) => {
      const view = el.dataset.view;
      if (!view) return;
      e.preventDefault();
      showView(view);
    });
  });

  /* ------------------------------------------------------------------
     Reveal gallery items on scroll
  ------------------------------------------------------------------ */
  const items = document.querySelectorAll(".project-item");

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = (i % 4) * 90;
            setTimeout(() => el.classList.add("is-revealed"), delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("is-revealed"));
  }

  /* ------------------------------------------------------------------
     Project modal
  ------------------------------------------------------------------ */
  const modal = document.getElementById("project-modal");
  const modalContent = document.getElementById("modal-content");
  const modalClose = document.getElementById("modal-close");
  const modalScrim = document.getElementById("modal-scrim");

  function renderProject(id) {
    const p = PROJECTS[id];
    if (!p) return;

    const mediaBlocks = p.hues
      .map(
        (h) => `
        <div class="project-media">
          <div class="placeholder-img" style="--h:${h.split(",")[0]};--h2:${h.split(",")[1]}"></div>
        </div>`
      )
      .join("");

    modalContent.innerHTML = `
      <p class="modal-eyebrow">${p.category}</p>
      <h1 class="modal-title">${p.title}</h1>
      <div class="modal-meta-row">
        <div><span>Category</span><span>${p.category}</span></div>
        <div><span>Year</span><span>${p.year}</span></div>
        <div><span>Role</span><span>${p.role}</span></div>
      </div>
      <p class="modal-desc">${p.description}</p>
      <div class="modal-media">${mediaBlocks}</div>
    `;
  }

  function openModal(id) {
    renderProject(id);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  items.forEach((el) => {
    el.addEventListener("click", () => openModal(el.dataset.project));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(el.dataset.project);
      }
    });
  });

  modalClose.addEventListener("click", closeModal);
  modalScrim.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  /* ------------------------------------------------------------------
     Custom cursor
  ------------------------------------------------------------------ */
  const cursor = document.getElementById("cursor");
  const hoverTargets = document.querySelectorAll(".project-item");
  const canHover = window.matchMedia("(hover: hover)").matches;

  if (canHover) {
    window.addEventListener("mousemove", (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });
    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
    });
  }

  /* ------------------------------------------------------------------
     Misc: footer year, initial fade-in
  ------------------------------------------------------------------ */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  window.addEventListener("load", () => {
    document.body.classList.add("is-ready");
  });
})();
