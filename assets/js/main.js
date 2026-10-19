/* Portfólio Giovana Campos — interações (JS puro, sem dependências) */
(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ---------- Header ao rolar + botão voltar ao topo ---------- */
  const header = $("#header");
  const backToTop = $("#backToTop");
  const onScroll = () => {
    const y = window.scrollY;
    header && header.classList.toggle("scrolled", y > 20);
    backToTop && backToTop.classList.toggle("show", y > 500);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  const nav = $("#nav");
  const toggle = $("#navToggle");
  const setMenu = (open) => {
    if (!nav || !toggle) return;
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    toggle.innerHTML = open ? '<i class="bx bx-x"></i>' : '<i class="bx bx-menu"></i>';
  };
  toggle && toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  nav && $$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  /* ---------- Link ativo conforme a seção visível ---------- */
  const navLinks = nav ? $$('a[href^="#"]', nav) : [];
  const sections = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((a) =>
            a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Animações de entrada ---------- */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- Brilho dos cards seguindo o mouse ---------- */
  $$(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  /* ---------- Lightbox (ampliar imagens) ---------- */
  const lightbox = $("#lightbox");
  if (lightbox && typeof lightbox.showModal === "function") {
    const lbImg = $("img", lightbox);
    $$("[data-lightbox]").forEach((el) =>
      el.addEventListener("click", () => {
        lbImg.src = el.dataset.lightbox;
        lbImg.alt = ($("img", el) || {}).alt || "";
        lightbox.showModal();
      })
    );
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.closest(".lightbox-close")) lightbox.close();
    });
  }

  /* ---------- Carrosséis (página de detalhes) ---------- */
  $$(".carousel").forEach((carousel) => {
    const track = $(".carousel-track", carousel);
    const slides = $$(".carousel-slide", carousel);
    const prev = $(".prev", carousel);
    const next = $(".next", carousel);
    const dotsWrap = $(".carousel-dots", carousel);
    if (!track || slides.length === 0) return;

    if (slides.length < 2) {
      prev && prev.remove();
      next && next.remove();
      dotsWrap && dotsWrap.remove();
      return;
    }

    const dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", `Imagem ${i + 1} de ${slides.length}`);
      b.addEventListener("click", () => go(i));
      dotsWrap.appendChild(b);
      return b;
    });

    const index = () => Math.round(track.scrollLeft / track.clientWidth);
    const go = (i) => track.scrollTo({ left: i * track.clientWidth });
    const update = () => {
      const i = index();
      dots.forEach((d, n) => d.classList.toggle("active", n === i));
      prev.disabled = i === 0;
      next.disabled = i === slides.length - 1;
    };

    prev.addEventListener("click", () => go(index() - 1));
    next.addEventListener("click", () => go(index() + 1));
    track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
    window.addEventListener("resize", update);
    update();
  });

  /* ---------- Formulário de contato (abre o e-mail) ---------- */
  const form = $("#contactForm");
  form &&
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const subject = encodeURIComponent(data.get("subject"));
      const body = encodeURIComponent(
        `${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`
      );
      window.location.href = `mailto:giovanacampos3103@gmail.com?subject=${subject}&body=${body}`;
    });

  /* ---------- Ano no rodapé ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
