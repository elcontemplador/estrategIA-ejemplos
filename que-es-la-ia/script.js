const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const completionData = {
  cielo: {
    fragment: "El cielo es...",
    options: [
      ["azul", 78, "#6aa1b8"],
      ["gris", 14, "#adaeb0"],
      ["inmenso", 8, "#c39a57"]
    ]
  },
  ayuntamiento: {
    fragment: "Un ayuntamiento puede usar IA para...",
    options: [
      ["resumir expedientes", 46, "#6aa1b8"],
      ["orientar consultas", 34, "#59614c"],
      ["decidir sanciones", 20, "#9d2235"]
    ]
  },
  campana: {
    fragment: "En una campaña electoral, la IA puede...",
    options: [
      ["analizar discursos", 42, "#6aa1b8"],
      ["probar mensajes", 37, "#c39a57"],
      ["fabricar certezas", 21, "#9d2235"]
    ]
  }
};

const completionSelect = document.querySelector("[data-completion-select]");
const completionFragment = document.querySelector("[data-completion-fragment]");
const probabilityList = document.querySelector("[data-probability-list]");

function renderCompletion(key) {
  const data = completionData[key];
  completionFragment.textContent = data.fragment;
  probabilityList.innerHTML = data.options
    .map(
      ([label, value, color]) => `
        <div class="prob-row">
          <strong>${label}</strong>
          <div class="prob-track"><span style="width: ${value}%; background: ${color}"></span></div>
          <span>${value}%</span>
        </div>
      `
    )
    .join("");
}

if (completionSelect) {
  renderCompletion(completionSelect.value);
  completionSelect.addEventListener("change", () => renderCompletion(completionSelect.value));
}

const flowData = {
  reactivo: {
    caption:
      "Un flujo reactivo transforma una pregunta en una respuesta. Es útil, pero deja al usuario casi todo el trabajo de verificación y ejecución.",
    steps: [
      ["entrada", "El usuario pregunta."],
      ["modelo", "El sistema genera una respuesta."],
      ["salida", "La persona revisa, corrige y decide qué hacer."]
    ]
  },
  agentico: {
    caption:
      "Un flujo agéntico supervisado divide el problema, usa herramientas y deja puntos de control. No elimina la responsabilidad humana: la hace más explícita.",
    steps: [
      ["objetivo", "Define la tarea y los límites."],
      ["plan", "Divide el trabajo en pasos."],
      ["herramientas", "Consulta documentos, datos o sistemas autorizados."],
      ["verificación", "Contrasta el resultado y detecta huecos."],
      ["entrega", "Propone una salida revisable por una persona."]
    ]
  }
};

const flowButtons = document.querySelectorAll("[data-flow]");
const flowVisual = document.querySelector("[data-flow-visual]");
const flowCaption = document.querySelector("[data-flow-caption]");

function renderFlow(key) {
  const data = flowData[key];
  flowVisual.innerHTML = data.steps
    .map(
      ([title, copy]) => `
        <article class="flow-step">
          <span>${title}</span>
          <p>${copy}</p>
        </article>
      `
    )
    .join("");
  flowCaption.textContent = data.caption;
}

if (flowVisual) {
  renderFlow("reactivo");
  flowButtons.forEach((button) => {
    button.addEventListener("click", () => {
      flowButtons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      renderFlow(button.dataset.flow);
    });
  });
}

const promptBlocks = {
  rol: "Actúa como asesor de políticas públicas.",
  tarea: "Resume el documento y extrae las decisiones pendientes.",
  contexto: "El texto se usará en una reunión de equipo municipal.",
  limites: "No inventes datos y marca cualquier punto no confirmado.",
  formato: "Entrega 5 viñetas y una tabla de riesgos.",
  criterio: "Prioriza claridad, trazabilidad y utilidad para decidir."
};

const blockButtons = document.querySelectorAll("[data-block]");
const assembledPrompt = document.querySelector("[data-assembled-prompt]");
const promptScore = document.querySelector("[data-prompt-score]");
const promptDiagnosis = document.querySelector("[data-prompt-diagnosis]");
const activeBlocks = new Set();

function renderPrompt() {
  const parts = [...activeBlocks].map((key) => promptBlocks[key]);
  promptScore.textContent = `${parts.length}/6`;
  assembledPrompt.textContent = parts.length
    ? parts.join(" ")
    : "Pulsa bloques para construir una instrucción de trabajo.";
  if (parts.length < 3) {
    promptDiagnosis.textContent =
      "Todavía es un encargo débil: el modelo tendrá que adivinar contexto, límites o formato.";
  } else if (parts.length < 6) {
    promptDiagnosis.textContent =
      "Ya es una instrucción útil. Añadir límites y criterio mejora la revisión humana.";
  } else {
    promptDiagnosis.textContent =
      "Encargo completo: define rol, tarea, contexto, límites, formato y criterio de calidad.";
  }
}

blockButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.block;
    if (activeBlocks.has(key)) {
      activeBlocks.delete(key);
      button.classList.remove("is-active");
    } else {
      activeBlocks.add(key);
      button.classList.add("is-active");
    }
    renderPrompt();
  });
});

const hallucinationButtons = document.querySelectorAll("[data-claim]");
const hallucinationFeedback = document.querySelector("[data-hallucination-feedback]");

hallucinationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    hallucinationButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    if (button.dataset.claim === "hallucination") {
      hallucinationFeedback.textContent =
        "Bien detectado: el texto introduce una obligación semanal y una fecha concreta sin fuente. Es el tipo de detalle plausible que debe verificarse antes de publicarse o aplicarse.";
    } else {
      hallucinationFeedback.textContent =
        "Esa parte puede necesitar contexto, pero no es la señal más sospechosa. Busca cifras, fechas, obligaciones absolutas o afirmaciones legales formuladas con demasiada seguridad.";
    }
  });
});

const riskData = {
  bajo: {
    title: "Riesgo bajo",
    copy: "Buen caso para acelerar trabajo si no incluye datos sensibles y una persona revisa el resultado.",
    width: "28%",
    color: "#59614c",
    controls: ["Revisión humana", "No introducir información sensible", "Trazabilidad mínima"]
  },
  medio: {
    title: "Riesgo medio",
    copy: "Conviene definir tono, fuentes, registro de decisiones y límites claros antes de desplegarlo.",
    width: "62%",
    color: "#c39a57",
    controls: ["Base documental aprobada", "Registro de respuestas", "Circuito de escalado humano"]
  },
  alto: {
    title: "Riesgo alto",
    copy: "Debe tratarse como una decisión sensible: requiere garantías, auditoría y responsables identificables.",
    width: "94%",
    color: "#9d2235",
    controls: ["Evaluación previa", "Auditoría", "Explicación a personas afectadas", "Supervisión reforzada"]
  }
};

const riskButtons = document.querySelectorAll("[data-risk]");
const riskFill = document.querySelector("[data-risk-fill]");
const riskTitle = document.querySelector("[data-risk-title]");
const riskCopy = document.querySelector("[data-risk-copy]");
const riskControls = document.querySelector("[data-risk-controls]");

riskButtons.forEach((button) => {
  button.addEventListener("click", () => {
    riskButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    const data = riskData[button.dataset.risk];
    riskFill.style.width = data.width;
    riskFill.style.background = data.color;
    riskTitle.textContent = data.title;
    riskCopy.textContent = data.copy;
    riskControls.innerHTML = data.controls.map((item) => `<li>${item}</li>`).join("");
  });
});

document.querySelectorAll(".flashcard").forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("is-active");
  });
});

const checklist = document.querySelector("[data-checklist]");
const checklistProgress = document.querySelector("[data-checklist-progress]");

if (checklist) {
  const boxes = checklist.querySelectorAll("input[type='checkbox']");
  const updateChecklist = () => {
    const done = [...boxes].filter((box) => box.checked).length;
    checklistProgress.textContent = `${done} de ${boxes.length} preguntas marcadas`;
  };
  boxes.forEach((box) => box.addEventListener("change", updateChecklist));
  updateChecklist();
}
