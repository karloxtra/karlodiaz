(() => {
  "use strict";

  const intro = document.getElementById("intro");
  const introVideo = document.getElementById("intro-video");

  function dismissIntro() {
    if (!intro) return;
    intro.classList.add("is-hidden");
    window.setTimeout(() => intro.remove(), 900);
  }

  if (intro && introVideo) {
    if (sessionStorage.getItem("introPlayed")) {
      intro.remove();
    } else {
      introVideo.src = window.matchMedia("(max-width: 768px)").matches
        ? "LOGOINTROPHONE.mp4"
        : "LOGOINTROMP4.mp4";

      introVideo.addEventListener("ended", dismissIntro, { once: true });
      introVideo.addEventListener("error", dismissIntro, { once: true });
      sessionStorage.setItem("introPlayed", "true");

      const playPromise = introVideo.play();
      if (playPromise) playPromise.catch(dismissIntro);
      window.setTimeout(dismissIntro, 7000);
    }
  }

  const list = document.getElementById("project-list");
  if (list && Array.isArray(PROJECTS)) {
    list.innerHTML = PROJECTS.map((project, index) => `
      <a class="project-card reveal" href="project.html?project=${project.slug}" data-title="${project.title}">
        <figure class="project-card-media">
          <img src="${project.images[0]}" alt="${project.artist} — ${project.title}" loading="${index < 2 ? "eager" : "lazy"}">
        </figure>
        <div class="project-card-info">
          <span class="project-number">${String(index + 1).padStart(2, "0")}</span>
          <div>
            <h2>${project.title}</h2>
            <p>${project.artist}</p>
          </div>
          <span class="project-year">${project.year}</span>
        </div>
      </a>
    `).join("");
  }

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
  document.querySelectorAll("a[href^='project.html']").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (transitionTitle) transitionTitle.textContent = link.dataset.title || "Selected Work";
      transition?.classList.add("is-covering");
      window.setTimeout(() => { window.location.href = link.href; }, 720);
    });
  });
})();
