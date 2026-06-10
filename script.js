/* ============================================================
   OSTEOMED — Centro de Kinesiología
   script.js
   ============================================================ */

/* ============================================================
   NÚMERO DE WHATSAPP DEL CENTRO
   Formato internacional, SIN el signo "+", sin espacios ni guiones.
   (Chile: 56 + 9 + número de 8 dígitos)
   Todos los botones de WhatsApp del sitio usan este número.
   ============================================================ */
const WHATSAPP_NUMBER = "56972647693";


/* ------------------------------------------------------------
   1. Utilidad: abrir WhatsApp con un mensaje
   ------------------------------------------------------------ */
function openWhatsApp(message) {
  const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  window.open(url, "_blank", "noopener");
}


/* ------------------------------------------------------------
   2. Construir el mensaje a partir del formulario
   ------------------------------------------------------------ */
function buildMessage(data) {
  // Limpia espacios y entrega un valor por defecto legible
  const v = (val, fallback) => {
    const t = (val || "").trim();
    return t !== "" ? t : fallback;
  };

  const nombre        = v(data.nombre, "—");
  const edad          = v(data.edad, "no indicada");
  const motivo        = v(data.motivo, "no indicado");
  const zona          = v(data.zona, "no indicada");
  const tiempo        = v(data.tiempo, "no indicado");
  const dolor         = v(data.dolor, "—");
  const diagnostico   = v(data.diagnostico, "no indicado");
  const examenes      = v(data.examenes, "no indicado");
  const disponibilidad= v(data.disponibilidad, "no indicada");
  const comentarios   = v(data.comentarios, "sin comentarios");

  // Mensaje ordenado y bien redactado
  const message =
`Hola 👋, soy ${nombre}. Quisiera consultar por atención kinesiológica.

• Edad: ${edad}
• Motivo de consulta: ${motivo}
• Zona afectada: ${zona}
• Desde cuándo: ${tiempo}
• Nivel de dolor: ${dolor}/10
• Diagnóstico médico: ${diagnostico}
• Cuento con exámenes: ${examenes}
• Disponibilidad horaria: ${disponibilidad}
• Comentarios adicionales: ${comentarios}

Quedo atento/a. ¡Gracias!`;

  return message;
}


/* ------------------------------------------------------------
   3. Manejo del formulario
   ------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("waForm");

  if (form) {
    // Actualizar etiqueta del slider de dolor en vivo
    const dolorInput = document.getElementById("dolor");
    const dolorVal = document.getElementById("dolorVal");
    if (dolorInput && dolorVal) {
      dolorInput.addEventListener("input", function () {
        dolorVal.textContent = this.value;
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Validación mínima de campos obligatorios
      const requiredFields = ["nombre", "motivo"];
      let valid = true;

      requiredFields.forEach(function (id) {
        const field = document.getElementById(id);
        if (!field.value.trim()) {
          field.classList.add("invalid");
          valid = false;
        } else {
          field.classList.remove("invalid");
        }
      });

      if (!valid) {
        const firstInvalid = form.querySelector(".invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Recoger datos
      const data = {
        nombre:         document.getElementById("nombre").value,
        edad:           document.getElementById("edad").value,
        motivo:         document.getElementById("motivo").value,
        zona:           document.getElementById("zona").value,
        tiempo:         document.getElementById("tiempo").value,
        dolor:          document.getElementById("dolor").value,
        diagnostico:    document.getElementById("diagnostico").value,
        examenes:       document.getElementById("examenes").value,
        disponibilidad: document.getElementById("disponibilidad").value,
        comentarios:    document.getElementById("comentarios").value
      };

      const message = buildMessage(data);
      openWhatsApp(message);
    });

    // Quitar estado "invalid" al escribir
    form.querySelectorAll("input, textarea").forEach(function (el) {
      el.addEventListener("input", function () {
        this.classList.remove("invalid");
      });
    });
  }


  /* ----------------------------------------------------------
     4. Botones de WhatsApp con mensaje genérico
        (hero, secciones, flotante, footer, "escríbenos")
     ---------------------------------------------------------- */
  const genericMessage =
    "Hola 👋, vi su sitio web y quisiera consultar por atención kinesiológica. ¿Me pueden orientar?";

  // Todos los enlaces que apuntan a #agendar abren la sección del formulario
  // (comportamiento por defecto de ancla). Los siguientes abren WhatsApp directo:
  const directWaIds = ["directWa", "waFloat", "footerWa"];
  directWaIds.forEach(function (id) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        openWhatsApp(genericMessage);
      });
    }
  });


  /* ----------------------------------------------------------
     4b. Test de telerehabilitación (modal)
     ---------------------------------------------------------- */
  const teleModal = document.getElementById("teleModal");
  const teleBtn = document.getElementById("teleTestBtn");
  const teleForm = document.getElementById("teleForm");
  let lastFocused = null;

  function openTeleModal() {
    if (!teleModal) return;
    lastFocused = document.activeElement;
    teleModal.hidden = false;
    document.body.classList.add("modal-open");
    const firstField = teleModal.querySelector("input, select, textarea");
    if (firstField) firstField.focus();
  }

  function closeTeleModal() {
    if (!teleModal) return;
    teleModal.hidden = true;
    document.body.classList.remove("modal-open");
    if (lastFocused) lastFocused.focus();
  }

  if (teleBtn) teleBtn.addEventListener("click", openTeleModal);

  if (teleModal) {
    teleModal.querySelectorAll("[data-close-modal]").forEach(function (el) {
      el.addEventListener("click", closeTeleModal);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !teleModal.hidden) closeTeleModal();
    });
  }

  if (teleForm) {
    teleForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const required = ["teleNombre", "teleMotivo"];
      let valid = true;
      required.forEach(function (id) {
        const field = document.getElementById(id);
        if (!field.value.trim()) {
          field.classList.add("invalid");
          valid = false;
        } else {
          field.classList.remove("invalid");
        }
      });
      if (!valid) {
        const firstInvalid = teleForm.querySelector(".invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const v = function (id, fallback) {
        const t = (document.getElementById(id).value || "").trim();
        return t !== "" ? t : fallback;
      };

      const message =
`Hola 👋, hice el test de telerehabilitación en la web de Osteomed.

• Nombre: ${v("teleNombre", "—")}
• Quiero tratar: ${v("teleMotivo", "no indicado")}
• ¿Kinesiología antes?: ${v("teleAntes", "no indicado")}
• Espacio y conexión para videollamada: ${v("teleEspacio", "no indicado")}
• Disponibilidad: ${v("teleDispo", "no indicada")}

Me gustaría saber si mi caso es apto para atención online. ¡Gracias!`;

      openWhatsApp(message);
      closeTeleModal();
    });

    teleForm.querySelectorAll("input, select").forEach(function (el) {
      el.addEventListener("input", function () {
        this.classList.remove("invalid");
      });
    });
  }


  /* ----------------------------------------------------------
     5. Menú móvil
     ---------------------------------------------------------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  /* Logo del navbar: subir de verdad al inicio de la página */
  const brandLink = document.querySelector(".brand");
  if (brandLink) {
    brandLink.addEventListener("click", function (e) {
      e.preventDefault();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });

    // Cerrar al hacer clic en un enlace
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }


  /* ----------------------------------------------------------
     6. Animaciones de entrada al hacer scroll
     ---------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    ".section, .card, .svc, .team-card, .tech-card, .step, .when-list li, .hero-copy, .hero-visual"
  );

  if ("IntersectionObserver" in window) {
    revealTargets.forEach(function (el) { el.classList.add("reveal"); });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach(function (el) { observer.observe(el); });
  }


  /* ----------------------------------------------------------
     7. Año dinámico en el footer
     ---------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
