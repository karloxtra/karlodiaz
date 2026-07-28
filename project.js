(() => {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("project");
  const index = PROJECTS.findIndex((project) => project.slug === slug);
  const project = PROJECTS[index >= 0 ? index : 0];
  const previous = index > 0 ? PROJECTS[index - 1] : null;
  const next = index < PROJECTS.length - 1 ? PROJECTS[index + 1] : null;
  const root = document.getElementById("project-root");

  document.title = `${project.artist} — ${project.title} | Karlo Diaz`;

  const spec = (label, values) => `
    <div class="spec-group reveal">
      <p>${label}</p>
      <div>${values.map((value) => `<span>${value}</span>`).join("")}</div>
    </div>`;

  const navLink = (item, direction) => item ? `
    <a class="project-nav-link ${direction}" href="project.html?project=${item.slug}" data-title="${item.title}">
      <span class="project-nav-direction">${direction === "previous" ? "← Previous" : "Next →"}</span>
      <strong>${item.title}</strong>
      <img src="${item.images[0]}" alt="" aria-hidden="true">
    </a>` : `<div class="project-nav-spacer"></div>`;

  root.innerHTML = `
    <article class="project-detail">
      <section class="project-hero">
        <img src="${project.images[0]}" alt="${project.artist} — ${project.title}">
        <div class="project-hero-shade"></div>
        <div class="project-hero-copy">
          <p>${project.artist} · ${project.year}</p>
          <h1>${project.title}</h1>
        </div>
      </section>

      <section class="project-info section">
        <div class="project-intro reveal">
          <p class="eyebrow">Music video</p>
          <h2>${project.artist}<br>${project.title}</h2>
        </div>
        <div class="project-specs">
          ${spec("Role", project.roles)}
          ${spec("Shot on", project.shotOn)}
          ${spec("Post-production", project.software)}
          <a class="watch-link reveal" href="${project.youtube}" target="_blank" rel="noopener" aria-label="Watch ${project.title} on YouTube">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.2 7.1a2.8 2.8 0 0 0-2-2C17.4 4.6 12 4.6 12 4.6s-5.4 0-7.2.5a2.8 2.8 0 0 0-2 2A29.5 29.5 0 0 0 2.3 12a29.5 29.5 0 0 0 .5 4.9 2.8 2.8 0 0 0 2 2c1.8.5 7.2.5 7.2.5s5.4 0 7.2-.5a2.8 2.8 0 0 0 2-2 29.5 29.5 0 0 0 .5-4.9 29.5 29.5 0 0 0-.5-4.9ZM10 15.4V8.6l6 3.4-6 3.4Z"/></svg>
            Watch on YouTube
          </a>
        </div>
      </section>

      <section class="project-gallery section">
        ${project.images.map((image, imageIndex) => `
          <figure class="gallery-image reveal gallery-image-${imageIndex + 1}">
            <img src="${image}" alt="Still ${imageIndex + 1} from ${project.artist} — ${project.title}" loading="${imageIndex === 0 ? "eager" : "lazy"}">
          </figure>`).join("")}
      </section>

      <nav class="project-navigation" aria-label="Project navigation">
        ${navLink(previous, "previous")}
        ${navLink(next, "next")}
      </nav>
    </article>`;

  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach((el) => observer.observe(el));

  const transition = document.querySelector(".page-transition");
  const transitionTitle = document.querySelector(".page-transition-title");
  requestAnimationFrame(() => {
    if (transitionTitle) transitionTitle.textContent = project.title;
    window.setTimeout(() => transition?.classList.remove("is-covering"), 220);
  });

  document.querySelectorAll(".project-nav-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const isPrevious = link.classList.contains("previous");
      document.body.classList.add(isPrevious ? "leaving-previous" : "leaving-next");
      if (transitionTitle) transitionTitle.textContent = link.dataset.title;
      window.setTimeout(() => transition?.classList.add("is-covering"), 130);
      window.setTimeout(() => { window.location.href = link.href; }, 820);
    });
  });
})();
