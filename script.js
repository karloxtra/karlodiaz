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
  "dogs-n-da-dark": {
    title: "Dogs n da dark - Killcrawdad",
    category: "Music Video",
    year: "2026",
    role: "Director & Editor",
    description:
      "Official music video for Killcrawdad. Directed and edited by Karlo Diaz.",
    youtube: "https://www.youtube.com/watch?v=DJWonNOyXIo",
    hues: ["214,250", "230,260", "200,230"]
  },

  "mirame": {
    title: "NBR Jay - Mirame",
    category: "Music Video",
    year: "2025",
    role: "Director & Editor",
    description:
      "Official music video for NBR Jay. Directed and edited by Karlo Diaz.",
    youtube: "https://www.youtube.com/watch?v=4OJuUxjGiz8",
    hues: ["18,40", "10,30", "25,50"]
  },

  "en-cuatro": {
    title: "NBR Jay - En Cuatro",
    category: "Music Video",
    year: "2024",
    role: "Director, Editor & Producer",
    description:
      "Official music video for NBR Jay. Directed, edited and produced by Karlo Diaz.",
    youtube: "https://www.youtube.com/watch?v=d_1qusjhRV4",
    hues: ["0,20", "0,15", "0,25"]
  },

  "forever": {
    title: "NBR Jay - Forever",
    category: "Music Video",
    year: "2023",
    role: "Director, Editor & Producer",
    description:
      "Official music video for NBR Jay. Directed, edited and produced by Karlo Diaz.",
    youtube: "https://www.youtube.com/watch?v=9PEszrjHp9M",
    hues: ["265,300", "250,280", "270,310"]
  },

  "g33k3d": {
    title: "NBR Jay - G33K3D",
    category: "Music Video",
    year: "2023",
    role: "Director & Editor",
    description:
      "Official music video for NBR Jay. Directed and edited by Karlo Diaz.",
    youtube: "https://www.youtube.com/watch?v=-p-pYviFdD0",
    hues: ["90,130", "80,110", "100,140"]
  },

  "n3w-jurr": {
    title: "NBR Jay - N3W JÜRR",
    category: "Music Video",
    year: "2023",
    role: "Director & Editor",
    description:
      "Official music video for NBR Jay. Directed and edited by Karlo Diaz.",
    youtube: "https://www.youtube.com/watch?v=s_fuOBWAAmQ",
    hues: ["330,10", "320,350", "340,20"]
  },

  "nauseous": {
    title: "NBR Jay - NAUSEOUS",
    category: "Music Video",
    year: "2023",
    role: "Director & Editor",
    description:
      "Official music video for NBR Jay. Directed and edited by Karlo Diaz.",
    youtube: "https://www.youtube.com/watch?v=7FOKe1UMYBk",
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
  function openProject() {
    const project = PROJECTS[el.dataset.project];

    if (project && project.youtube) {
      window.open(project.youtube, "_blank");
    }
  }

  el.addEventListener("click", openProject);

  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openProject();
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
