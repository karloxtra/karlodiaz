(() => {
  "use strict";

  const transition = document.querySelector(".page-transition");

  // Mobile Safari and desktop browsers can restore a page from back/forward cache.
  // Never leave a previous navigation wipe covering the restored page.
  window.addEventListener("pageshow", () => {
    if (!transition) return;
    transition.classList.remove("is-entering", "is-leaving");
    transition.style.transform = "translateY(100%)";
    requestAnimationFrame(() => { transition.style.transform = ""; });
  });

  function animateTo(url, label = "") {
    if (!transition) {
      window.location.href = url;
      return;
    }
    transition.querySelector("span").textContent = label;
    transition.classList.remove("is-leaving");
    transition.classList.add("is-entering");
    setTimeout(() => { window.location.href = url; }, 650);
  }

  function revealPage() {
    if (!transition) return;
    transition.classList.remove("is-entering");
    transition.classList.add("is-leaving");
    setTimeout(() => transition.classList.remove("is-leaving"), 800);
  }

  // Corner logo loops the original MP4 forward. A true forward/reverse loop
  // requires a separately exported ping-pong MP4 (see README).
  function setupBrandVideo() {
    document.querySelectorAll(".brand-video").forEach(video => {
      const fallback = video.parentElement.querySelector(".brand-fallback");
      video.addEventListener("error", () => { video.style.display = "none"; if (fallback) fallback.style.display = "block"; });
      video.play().catch(() => { video.style.display = "none"; if (fallback) fallback.style.display = "block"; });
    });
  }

  function setupHome() {
    const grid = document.getElementById("projects-grid");
    if (!grid || !window.PROJECTS) return;

    const shortWorks = [
      {
        id: "concert-promo-01",
        title: "CONCERT PROMO 01",
        year: "2026",
        description: "Concert promotional piece created to build anticipation for a live event.",
        tools: ["BLENDER", "PREMIERE PRO"],
        video: "short-form/short3.mp4",
        orientation: "horizontal"
      },
      {
        id: "concert-promo-02",
        title: "CONCERT PROMO 02",
        year: "2026",
        description: "Concert teaser built around motion graphics and fast-paced visual design.",
        tools: ["AFTER EFFECTS", "PREMIERE PRO"],
        video: "short-form/short4.mp4",
        orientation: "horizontal"
      },
      {
        id: "concert-recap",
        title: "CONCERT RECAP",
        year: "2026",
        description: "A short recap capturing the energy and atmosphere of the live performance.",
        tools: ["PREMIERE PRO", "AFTER EFFECTS"],
        video: "short-form/short5.mp4",
        orientation: "horizontal"
      },
      {
        id: "tattoo-shop-01",
        title: "TATTOO SHOP 01",
        year: "2025",
        description: "A vertical promotional short showcasing the tattoo shop, its space, and selected work.",
        tools: ["BLENDER", "AFTER EFFECTS", "PREMIERE PRO"],
        video: "short-form/short1.mp4",
        orientation: "vertical"
      },
      {
        id: "tattoo-shop-02",
        title: "TATTOO SHOP 02",
        year: "2025",
        description: "A vertical social piece highlighting the shop's atmosphere and tattoo work.",
        tools: ["BLENDER", "AFTER EFFECTS", "PREMIERE PRO"],
        video: "short-form/short2.mp4",
        orientation: "vertical"
      }
    ];

    const tabs = [...document.querySelectorAll("[data-work-view]")];
    const years = document.getElementById("work-years");
    const player = document.getElementById("short-player");
    const playerVideo = document.getElementById("short-player-video");
    const playerTitle = document.getElementById("short-player-title");
    const playerDescription = document.getElementById("short-player-description");
    const playerYear = document.getElementById("short-player-year");
    const playerTools = document.getElementById("short-player-tools");
    const playerClose = document.getElementById("short-player-close");

    function renderLongForm() {
      grid.className = "projects-grid";
      grid.innerHTML = window.PROJECTS.map(project => `
        <a class="project-card" href="project.html?id=${encodeURIComponent(project.id)}" data-project-link="${project.title}">
          <div class="project-thumb">
            <img src="${project.images[0]}" alt="${project.artist} — ${project.title}" loading="lazy">
          </div>
          <div class="project-card-info">
            <div>
              <h3>${project.title}</h3>
              <p>${project.artist}</p>
            </div>
            <span class="project-card-year">${project.year}</span>
          </div>
        </a>
      `).join("");

      grid.querySelectorAll("[data-project-link]").forEach(link => {
        link.addEventListener("click", event => {
          event.preventDefault();
          animateTo(link.href, link.dataset.projectLink);
        });
      });
    }

    function renderShortForm() {
      grid.className = "projects-grid short-form-grid";
      grid.innerHTML = shortWorks.map(item => `
        <button class="short-card is-${item.orientation}" type="button" data-short-id="${item.id}">
          <div class="short-thumb">
            <video muted playsinline preload="metadata" aria-label="${item.title} preview">
              <source src="${item.video}#t=0.1" type="video/mp4">
            </video>
            <span class="short-play">PLAY</span>
          </div>
          <div class="project-card-info">
            <div>
              <h3>${item.title}</h3>
              <p>${item.tools.join(" · ")}</p>
            </div>
            <span class="project-card-year">${item.year}</span>
          </div>
        </button>
      `).join("");

      grid.querySelectorAll(".short-card").forEach(card => {
        const preview = card.querySelector("video");
        card.addEventListener("mouseenter", () => preview.play().catch(() => {}));
        card.addEventListener("mouseleave", () => { preview.pause(); preview.currentTime = 0.1; });
        card.addEventListener("click", () => openShort(shortWorks.find(item => item.id === card.dataset.shortId)));
      });
    }

    function setWorkView(view) {
      const isShort = view === "short";
      tabs.forEach(tab => {
        const active = tab.dataset.workView === view;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
      });
      years.textContent = isShort ? "2025—2026" : "2023—2026";
      if (isShort) renderShortForm(); else renderLongForm();
    }

    function openShort(item) {
      if (!item || !player) return;
      playerTitle.textContent = item.title;
      playerDescription.textContent = item.description;
      playerYear.textContent = item.year;
      playerTools.textContent = item.tools.join(" · ");
      playerVideo.src = item.video;
      player.classList.add("is-open");
      player.setAttribute("aria-hidden", "false");
      document.body.classList.add("short-player-open");
      playerVideo.play().catch(() => {});
    }

    function closeShort() {
      if (!player || !player.classList.contains("is-open")) return;
      player.classList.remove("is-open");
      player.setAttribute("aria-hidden", "true");
      document.body.classList.remove("short-player-open");
      playerVideo.pause();
      playerVideo.removeAttribute("src");
      playerVideo.load();
    }

    tabs.forEach(tab => tab.addEventListener("click", () => setWorkView(tab.dataset.workView)));
    playerClose?.addEventListener("click", closeShort);
    player?.querySelector(".short-player-backdrop")?.addEventListener("click", closeShort);
    document.addEventListener("keydown", event => { if (event.key === "Escape") closeShort(); });

    renderLongForm();

    const sections = [...document.querySelectorAll(".page-section")];
    const navButtons = [...document.querySelectorAll("[data-section]")];

    function showSection(id, updateHash = true) {
      const section = document.getElementById(id);
      if (!section) return;
      section.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
      if (updateHash) history.replaceState(null, "", `#${id}`);
    }

    navButtons.forEach(button => {
      button.addEventListener("click", () => showSection(button.dataset.section));
    });

    // Update the active navigation item as the visitor scrolls.
    const updateActiveNav = () => {
      const position = window.scrollY + window.innerHeight * .38;
      let active = "about";
      for (const section of sections) if (section.offsetTop <= position) active = section.id;
      document.querySelectorAll(".nav-link").forEach(link => link.classList.toggle("is-active", link.dataset.section === active));
    };
    window.addEventListener("scroll", updateActiveNav, { passive: true });
    updateActiveNav();
    const start = location.hash.replace("#", "");
    if (["about", "works", "contact"].includes(start)) {
      requestAnimationFrame(() => document.getElementById(start)?.scrollIntoView({ behavior: "instant" }));
    }
    setupBrandVideo();
  }

  function setupProject() {
    const root = document.getElementById("project-root");
    if (!root || !window.PROJECTS) return;

    const id = new URLSearchParams(location.search).get("id");
    const index = Math.max(0, window.PROJECTS.findIndex(project => project.id === id));
    const project = window.PROJECTS[index];
    const previous = window.PROJECTS[index - 1];
    const next = window.PROJECTS[index + 1];

    document.title = `${project.title} — KARLO DIAZ`;

    const lines = values => (values || []).map(value => `<span class="spec-value">${value}</span>`).join("");
    const titleMeta = [project.artist, project.year].filter(Boolean).join(" · ");
    const heroAlt = project.artist ? `${project.artist} — ${project.title}` : project.title;
    const navButton = (item, direction) => item ? `
      <a class="project-nav-button ${direction}" href="project.html?id=${encodeURIComponent(item.id)}" data-project-nav="${item.title}">
        <small>${direction === "previous" ? "← PREVIOUS" : "NEXT →"}</small>
        <strong>${item.title}</strong>
      </a>` : `<div class="project-nav-button ${direction} is-empty"></div>`;

    root.innerHTML = `
      <section class="project-intro">
        <div class="project-title-group">
          <p class="project-category">${project.category || (project.artist ? "MUSIC VIDEO" : "PROJECT")}</p>
          <h1>${project.title}</h1>
          <p>${titleMeta}</p>
        </div>
        <div class="project-specs">
          <div><span class="spec-label">ROLE</span>${lines(project.roles)}</div>
          <div><span class="spec-label">CAMERA / GEAR</span>${lines(project.camera)}</div>
          <div><span class="spec-label">TOOLS</span>${lines(project.software)}</div>
          ${project.starring ? `<div><span class="spec-label">STARRING</span>${lines(project.starring)}</div>` : ""}
          ${project.format ? `<div><span class="spec-label">FORMAT</span>${lines(project.format)}</div>` : ""}
        </div>
      </section>
      ${project.description ? `
      <section class="project-description reveal">
        <span class="spec-label">SYNOPSIS</span>
        <p>${project.description}</p>
      </section>` : ""}
      <div class="project-hero"><img src="${project.images[0]}" alt="${heroAlt} still 1"></div>
      <section class="project-gallery" aria-label="Project stills">
        ${project.images.slice(1).map((image, i) => `<figure><img src="${image}" alt="${heroAlt} still ${i + 2}" loading="lazy"></figure>`).join("")}
      </section>
      <div class="watch-row">
        <a class="watch-button" href="${project.youtube}" target="_blank" rel="noopener"><span class="watch-icon"></span> WATCH ON YOUTUBE</a>
      </div>
      <nav class="project-pagination" aria-label="Previous and next projects">
        ${navButton(previous, "previous")}
        ${navButton(next, "next")}
      </nav>
    `;

    root.querySelectorAll("[data-project-nav]").forEach(link => {
      link.addEventListener("click", event => {
        event.preventDefault();
        animateTo(link.href, link.dataset.projectNav);
      });
    });

    revealPage();
  }

  if (document.body.classList.contains("project-page")) { setupBrandVideo(); setupProject(); }
  else setupHome();
})();
