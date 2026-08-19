/* ==========================================================================
   PIAR Festeiro — aplicação
   Telas: landing, questionário, processamento, resultado e painel.
   O painel só existe depois da primeira análise e é roteado por hash.
   ========================================================================== */

const $ = (id) => document.getElementById(id);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* As cores do gráfico vivem no CSS (--series-N), então trocar de tema
   repinta tudo sozinho, sem redesenhar nada. */
const SERIES = [1, 2, 3, 4, 5].map((n) => `var(--series-${n})`);

/* ==========================================================================
   Tema — o do sistema é o padrão; o clique fixa uma escolha
   ========================================================================== */
const Theme = (() => {
  const KEY = "piar-festeiro:tema";
  const media = window.matchMedia("(prefers-color-scheme: light)");
  const listeners = [];
  let choice = "system";

  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") choice = saved;
  } catch (err) {
    /* sem storage: seguimos com o tema do sistema */
  }

  const resolved = () => (choice === "system" ? (media.matches ? "light" : "dark") : choice);

  function apply() {
    const theme = resolved();
    document.documentElement.dataset.theme = theme;
    const color = document.querySelector('meta[name="theme-color"]');
    if (color) color.setAttribute("content", theme === "light" ? "#ffffff" : "#000000");
    const scheme = document.querySelector('meta[name="color-scheme"]');
    if (scheme) scheme.setAttribute("content", theme);
    listeners.forEach((fn) => fn(theme));
  }

  media.addEventListener("change", () => {
    if (choice === "system") apply();
  });

  return {
    resolved,
    onChange(fn) {
      listeners.push(fn);
    },
    init: apply,
    toggle() {
      choice = resolved() === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(KEY, choice);
      } catch (err) {
        /* a escolha vale só para esta sessão */
      }
      apply();
    },
  };
})();

/* ==========================================================================
   Fundo de luz
   - "trail": manchas coloridas nascem no cursor e no rastro dele (landing)
   - "drift": luzes e confete à deriva (resultado e painel)
   ========================================================================== */
const Ambient = (() => {
  const canvas = $("ambient");
  const ctx = canvas.getContext("2d");

  let width = 0;
  let height = 0;
  let mode = "trail";
  let frame = null;

  let blobs = [];
  let lights = [];
  let bits = [];
  let palette = AMBIENT.dark;

  const pointer = { x: 0.5, y: 0.5 };
  const eased = { x: 0.5, y: 0.5 };
  const last = { x: null, y: null };

  const rand = (min, max) => min + Math.random() * (max - min);
  const rgba = (hex, alpha) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
  };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildDrift();
  }

  function buildDrift() {
    const small = width < 720;
    lights = Array.from({ length: small ? 6 : 9 }, (_, i) => ({
      x: rand(0, width),
      y: rand(0, height),
      r: rand(width * 0.2, width * 0.38),
      vx: rand(-0.09, 0.09),
      vy: rand(-0.07, 0.07),
      phase: rand(0, Math.PI * 2),
      pulse: rand(0.0006, 0.0014),
      depth: rand(0.4, 1),
    }));

    bits = Array.from({ length: small ? 18 : 34 }, () => ({
      x: rand(0, width),
      y: rand(0, height),
      w: rand(3, 6),
      h: rand(6, 12),
      vy: rand(0.15, 0.5),
      vx: rand(-0.18, 0.18),
      rot: rand(0, Math.PI * 2),
      spin: rand(-0.012, 0.012),
      alpha: rand(0.18, 0.45),
      depth: rand(0.3, 1),
    }));
  }

  /* Rastro do cursor: sempre verde. */
  function spawnTrail(x, y) {
    blobs.push({
      x,
      y,
      r: rand(110, 210),
      trail: true,
      life: 0,
      max: rand(1600, 2800),
    });
    if (blobs.length > 80) blobs.shift();
  }

  /* Manchas que surgem sozinhas no fundo: maiores e mais frequentes. */
  function drawTrail(dt) {
    ctx.globalCompositeOperation = palette === AMBIENT.light ? "source-over" : "lighter";
    blobs = blobs.filter((b) => {
      b.life += dt;
      const t = b.life / b.max;
      if (t >= 1) return false;

      // acende rápido, some devagar
      const fade = t < 0.16 ? t / 0.16 : 1 - (t - 0.16) / 0.84;
      const peak = palette.trailAlpha;
      const color = palette.trail;
      const radius = b.r * (0.78 + t * 0.42);

      const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, radius);
      gradient.addColorStop(0, rgba(color, peak * fade));
      gradient.addColorStop(0.45, rgba(color, peak * 0.36 * fade));
      gradient.addColorStop(1, rgba(color, 0));
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(b.x, b.y, radius, 0, Math.PI * 2);
      ctx.fill();
      return true;
    });
    ctx.globalCompositeOperation = "source-over";
  }

  function drawDrift(time) {
    eased.x += (pointer.x - eased.x) * 0.045;
    eased.y += (pointer.y - eased.y) * 0.045;
    const px = (eased.x - 0.5) * 60;
    const py = (eased.y - 0.5) * 60;

    ctx.globalCompositeOperation = palette === AMBIENT.light ? "source-over" : "lighter";
    lights.forEach((l) => {
      l.x += l.vx;
      l.y += l.vy;
      if (l.x < -l.r) l.x = width + l.r;
      if (l.x > width + l.r) l.x = -l.r;
      if (l.y < -l.r) l.y = height + l.r;
      if (l.y > height + l.r) l.y = -l.r;

      const pulse = 0.5 + 0.5 * Math.sin(time * l.pulse + l.phase);
      const x = l.x + px * l.depth;
      const y = l.y + py * l.depth;
      const color = palette.trail;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, l.r);
      gradient.addColorStop(0, rgba(color, palette.driftAlpha * (0.7 + pulse * 0.5)));
      gradient.addColorStop(1, rgba(color, 0));
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, l.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalCompositeOperation = "source-over";
    bits.forEach((b) => {
      b.y += b.vy;
      b.x += b.vx;
      b.rot += b.spin;
      if (b.y > height + 20) {
        b.y = -20;
        b.x = rand(0, width);
      }
      if (b.x < -20) b.x = width + 20;
      if (b.x > width + 20) b.x = -20;

      ctx.save();
      ctx.translate(b.x + px * b.depth * 0.6, b.y + py * b.depth * 0.6);
      ctx.rotate(b.rot);
      ctx.globalAlpha = b.alpha;
      ctx.fillStyle = palette.trail;
      ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h * (0.4 + 0.6 * Math.abs(Math.cos(b.rot))));
      ctx.restore();
    });
    ctx.globalAlpha = 1;
  }

  let previous = 0;
  function loop(time) {
    const dt = Math.min(time - previous, 64);
    previous = time;

    ctx.clearRect(0, 0, width, height);
    if (mode === "trail") drawTrail(dt);
    else drawDrift(time);

    frame = reduceMotion ? null : requestAnimationFrame(loop);
  }

  function track(x, y) {
    pointer.x = x / width;
    pointer.y = y / height;
    if (mode !== "trail") return;
    const moved = last.x === null ? Infinity : Math.hypot(x - last.x, y - last.y);
    if (moved > 24) {
      spawnTrail(x, y);
      last.x = x;
      last.y = y;
    }
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (e) => track(e.clientX, e.clientY));
  window.addEventListener(
    "touchmove",
    (e) => {
      const t = e.touches[0];
      if (t) track(t.clientX, t.clientY);
    },
    { passive: true }
  );

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = null;
    } else if (!reduceMotion && !frame) {
      previous = performance.now();
      frame = requestAnimationFrame(loop);
    }
  });

  return {
    start() {
      palette = AMBIENT[Theme.resolved()] || AMBIENT.dark;
      resize();
      Theme.onChange((theme) => {
        palette = AMBIENT[theme] || AMBIENT.dark;
        if (reduceMotion) {
          ctx.clearRect(0, 0, width, height);
          loop(0);
        }
      });

      if (reduceMotion) {
        loop(0);
        return;
      }
      previous = performance.now();
      if (!frame) frame = requestAnimationFrame(loop);
    },
    setMode(next) {
      if (mode === next) return;
      mode = next;
      if (next === "trail") blobs = [];
    },
  };
})();

/* ==========================================================================
   Persistência — localStorage, só no navegador de quem respondeu
   ========================================================================== */
const Storage = (() => {
  const KEY = "piar-festeiro:v2";
  const LEGACY = "piar-festeiro:resultado";

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data.attempts)) return data;
      }
      // migra o formato antigo, de uma tentativa só
      const old = localStorage.getItem(LEGACY);
      if (old) {
        const parsed = JSON.parse(old);
        if (typeof parsed.score === "number") {
          const migrated = {
            attempts: [
              {
                score: parsed.score,
                answers: parsed.answers || [],
                savedAt: parsed.savedAt || new Date().toISOString(),
              },
            ],
          };
          write(migrated);
          localStorage.removeItem(LEGACY);
          return migrated;
        }
      }
    } catch (err) {
      /* modo privativo ou dado corrompido: seguimos sem histórico */
    }
    return null;
  }

  function write(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (err) {
      /* sem espaço ou sem permissão: a sessão continua funcionando */
    }
  }

  return {
    latest() {
      const data = read();
      return data && data.attempts.length ? data.attempts[data.attempts.length - 1] : null;
    },
    save(attempt) {
      const data = read() || { attempts: [] };
      data.attempts.push(attempt);
      if (data.attempts.length > 8) data.attempts = data.attempts.slice(-8);
      write(data);
    },
  };
})();

/* ==========================================================================
   Estado
   ========================================================================== */
const state = {
  current: 0,
  answers: new Array(QUESTIONS.length).fill(null),
  profile: null,
};

const screens = {
  intro: $("screen-intro"),
  quiz: $("screen-quiz"),
  loading: $("screen-loading"),
  result: $("screen-result"),
  dashboard: $("screen-dashboard"),
};

function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.remove("screen--active"));
  screens[name].classList.add("screen--active");
  document.body.dataset.screen = name;
  Ambient.setMode(name === "intro" ? "trail" : "drift");
  window.scrollTo(0, 0);
}

function getProfile(score) {
  return PROFILES.find((p) => score >= p.min && score <= p.max) || PROFILES[PROFILES.length - 1];
}

function computeScore() {
  return state.answers.reduce(
    (sum, answerIndex, qIndex) => sum + QUESTIONS[qIndex].options[answerIndex].points,
    0
  );
}

/* Categoria e título andam sempre juntos, em texto e em marcação. */
function profileText(profile) {
  return `${profile.category} · ${profile.name}`;
}

function shareLink(profile) {
  const text =
    `Fiz a Análise de Perfil Festivo e o resultado saiu: "${profileText(profile)}".\n` +
    `${profile.tagline}\n\nDescubra o seu perfil: ${location.origin}${location.pathname}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${hour}:${minute}`;
}

/* ==========================================================================
   Questionário
   ========================================================================== */
function renderDots() {
  const host = $("dots");
  host.innerHTML = "";
  const firstOpen = state.answers.indexOf(null);
  const limit = firstOpen === -1 ? QUESTIONS.length - 1 : firstOpen;

  QUESTIONS.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "dot";
    dot.type = "button";
    if (state.answers[i] !== null) dot.classList.add("dot--done");
    if (i === state.current) dot.classList.add("dot--current");
    dot.setAttribute("aria-label", `Pergunta ${i + 1}`);
    dot.disabled = i > limit;
    dot.addEventListener("click", () => {
      state.current = i;
      renderQuestion();
    });
    host.appendChild(dot);
  });
}

function renderQuestion() {
  const q = QUESTIONS[state.current];
  $("question-kicker").textContent = q.kicker;
  $("question-title").textContent = q.title;
  $("progress-current").textContent = state.current + 1;
  $("btn-back").style.visibility = state.current === 0 ? "hidden" : "visible";
  renderDots();

  const container = $("options");
  container.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.type = "button";
    if (state.answers[state.current] === i) btn.classList.add("option--selected");
    btn.innerHTML =
      `<span class="option__letter">${"ABCD"[i]}</span><span>${opt.text}</span>`;
    btn.addEventListener("click", () => selectOption(i, btn));
    container.appendChild(btn);
  });

  const body = $("quiz-body");
  body.classList.remove("quiz-body--enter");
  void body.offsetWidth;
  body.classList.add("quiz-body--enter");
}

function selectOption(index, btn) {
  state.answers[state.current] = index;
  document.querySelectorAll(".option").forEach((o) => o.classList.remove("option--selected"));
  btn.classList.add("option--selected");
  renderDots();

  setTimeout(() => {
    if (state.current < QUESTIONS.length - 1) {
      state.current++;
      renderQuestion();
    } else {
      finishQuiz();
    }
  }, 320);
}

function goBack() {
  if (state.current > 0) {
    state.current--;
    renderQuestion();
  }
}

document.addEventListener("keydown", (e) => {
  const screen = document.body.dataset.screen;

  /* Combinação com modificador é do sistema, não do questionário: Ctrl+C para
     copiar uma resposta não pode marcar a alternativa C e avançar a pergunta. */
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  if (screen === "intro" && e.key === "Enter" && document.activeElement === document.body) {
    startQuiz();
    return;
  }
  if (screen !== "quiz") return;

  if (e.key === "ArrowLeft" || e.key === "Backspace") {
    e.preventDefault();
    goBack();
    return;
  }

  const letters = ["a", "b", "c", "d"];
  const key = e.key.toLowerCase();
  const index = letters.includes(key) ? letters.indexOf(key) : ["1", "2", "3", "4"].indexOf(e.key);
  if (index >= 0) {
    const btn = document.querySelectorAll(".option")[index];
    if (btn) {
      e.preventDefault();
      selectOption(index, btn);
    }
  }
});

/* ==========================================================================
   Processamento
   ========================================================================== */
function finishQuiz() {
  const score = computeScore();
  Storage.save({ score, answers: state.answers.slice(), savedAt: new Date().toISOString() });
  showScreen("loading");

  let step = 0;
  $("loading-step").textContent = LOADING_STEPS[0];
  $("loading-fill").style.width = "0%";

  const interval = setInterval(() => {
    step++;
    if (step >= LOADING_STEPS.length) {
      clearInterval(interval);
      renderResult(getProfile(score));
      showScreen("result");
      return;
    }
    $("loading-step").textContent = LOADING_STEPS[step];
    $("loading-fill").style.width = `${(step / LOADING_STEPS.length) * 100}%`;
  }, 650);

  requestAnimationFrame(() => {
    $("loading-fill").style.width = `${(1 / LOADING_STEPS.length) * 100}%`;
  });
}

/* ==========================================================================
   Gráfico de pizza reutilizável
   Cada fatia é um arco do mesmo círculo desenhado com stroke-dasharray. A
   separação é um vão de 2px na cor da superfície, e não um contorno — traço
   em volta da marca adicionaria tinta que não é dado.
   ========================================================================== */
const DONUT = { radius: 74, gap: 2 };

function mountDonut(wrap, legend, portfolio, barsHost) {
  const svg = wrap.querySelector(".donut");
  const group = wrap.querySelector(".donut__segments");
  const tooltip = wrap.querySelector(".tooltip");
  const centerValue = wrap.querySelector(".donut-center__value");
  const circumference = 2 * Math.PI * DONUT.radius;

  group.innerHTML = "";
  legend.innerHTML = "";
  legend.classList.remove("legend--dim");
  svg.classList.remove("donut--dim");
  centerValue.textContent = "100%";
  centerValue.style.color = "";

  let offset = 0;
  let pinned = null;
  const entries = [];

  portfolio.forEach((item, i) => {
    const length = (item.pct / 100) * circumference;
    const visible = Math.max(length - DONUT.gap, 0);
    const color = SERIES[i];

    const seg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    seg.setAttribute("class", "donut__seg");
    seg.setAttribute("cx", "100");
    seg.setAttribute("cy", "100");
    seg.setAttribute("r", String(DONUT.radius));
    seg.style.stroke = color; // via style: atributo de apresentação não resolve var()
    seg.setAttribute("stroke-dasharray", `0 ${circumference}`);
    seg.setAttribute("stroke-dashoffset", String(-offset));
    seg.setAttribute("tabindex", "0");
    seg.setAttribute("role", "button");
    seg.setAttribute("aria-label", `${item.name}: ${item.pct}%`);
    seg.dataset.target = `${visible} ${circumference - visible}`;
    group.appendChild(seg);

    const row = document.createElement("div");
    row.className = "legend__row";
    row.innerHTML =
      `<span class="legend__swatch" style="background:${color}"></span>` +
      `<span class="legend__name">${item.name}</span>` +
      `<span class="legend__value">${item.pct}%</span>`;
    legend.appendChild(row);

    entries.push({ seg, row, item, color, index: i });
    offset += length;
  });

  const placeTooltip = (x, y) => {
    const w = tooltip.offsetWidth;
    tooltip.style.left = `${Math.min(Math.max(x, w / 2), wrap.offsetWidth - w / 2)}px`;
    tooltip.style.top = `${Math.max(y, tooltip.offsetHeight + 8)}px`;
  };

  const highlight = (entry) => {
    const bars = barsHost ? barsHost.querySelectorAll(".bar") : [];
    entries.forEach((e) => {
      const on = entry !== null && e === entry;
      e.seg.classList.toggle("donut__seg--active", on);
      e.row.classList.toggle("legend__row--active", on);
      if (bars[e.index]) bars[e.index].classList.toggle("bar--active", on);
    });
    svg.classList.toggle("donut--dim", entry !== null);
    legend.classList.toggle("legend--dim", entry !== null);

    if (entry) {
      centerValue.textContent = `${entry.item.pct}%`;
      centerValue.style.color = entry.color;
      tooltip.innerHTML = `
        <span class="tooltip__name">${entry.item.name}</span>
        <span class="tooltip__value">${entry.item.pct}% da carteira</span>
      `;
    } else {
      centerValue.textContent = "100%";
      centerValue.style.color = "";
    }
    tooltip.classList.toggle("tooltip--visible", entry !== null);
  };

  const enter = (entry) => {
    if (!pinned) highlight(entry);
  };
  const leave = () => {
    if (!pinned) highlight(null);
  };

  entries.forEach((entry) => {
    const toggle = () => {
      pinned = pinned === entry ? null : entry;
      highlight(pinned);
      placeTooltip(wrap.offsetWidth / 2, wrap.offsetHeight / 2);
    };

    entry.seg.addEventListener("mouseenter", () => enter(entry));
    entry.seg.addEventListener("mouseleave", leave);
    entry.seg.addEventListener("mousemove", (e) => {
      const box = wrap.getBoundingClientRect();
      placeTooltip(e.clientX - box.left, e.clientY - box.top);
    });
    entry.seg.addEventListener("click", toggle);
    entry.seg.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
    entry.seg.addEventListener("focus", () => {
      enter(entry);
      placeTooltip(wrap.offsetWidth / 2, wrap.offsetHeight / 2);
    });
    entry.seg.addEventListener("blur", leave);

    entry.row.addEventListener("mouseenter", () => {
      enter(entry);
      placeTooltip(wrap.offsetWidth / 2, wrap.offsetHeight / 2);
    });
    entry.row.addEventListener("mouseleave", leave);
    entry.row.addEventListener("click", toggle);
  });

  return function animate() {
    entries.forEach((entry, i) => {
      entry.seg.style.transition =
        `stroke-dasharray 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.08}s,` +
        " stroke-width 0.16s ease, opacity 0.16s ease";
      entry.seg.setAttribute("stroke-dasharray", entry.seg.dataset.target);
    });
  };
}

/* ==========================================================================
   Blocos reaproveitados
   ========================================================================== */
function countUp(el, target) {
  if (reduceMotion) {
    el.textContent = `${target}%`;
    return;
  }
  const duration = 800;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = `${Math.round(target * (1 - Math.pow(1 - t, 3)))}%`;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function renderIndicators(host, profile) {
  host.innerHTML = "";
  profile.indicators.forEach((ind) => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.innerHTML = `
      <span class="tile__label">${ind.label}</span>
      <span class="tile__value" data-count="${ind.value}">0%</span>
      <div class="tile__track"><div class="tile__fill" data-width="${ind.value}"></div></div>
    `;
    host.appendChild(tile);
  });
}

function renderBars(host, profile) {
  host.innerHTML = "";
  profile.portfolio.forEach((item, i) => {
    const color = SERIES[i];
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.innerHTML = `
      <div class="bar__head">
        <span class="bar__name">${item.name}</span>
        <span class="bar__pct" style="color:${color};background:color-mix(in srgb, ${color} 16%, transparent)">${item.pct}%</span>
      </div>
      <div class="bar__track">
        <div class="bar__fill" data-width="${item.pct}" style="background:${color}"></div>
      </div>
      <span class="bar__note">${item.note}</span>
    `;
    host.appendChild(bar);
  });
}

function renderStrategy(host, profile, withNote = true) {
  const rows = [
    { key: "picking", pct: profile.strategy.picking, color: "var(--series-5)" },
    { key: "passive", pct: profile.strategy.passive, color: "var(--series-1)" },
  ];

  host.innerHTML = rows
    .map(
      (row) => `
      <div class="strategy__row">
        <span class="strategy__label">${STRATEGY_LABELS[row.key]}</span>
        <div class="strategy__track">
          <div class="strategy__fill" data-width="${row.pct}" style="background:${row.color}">${row.pct}%</div>
        </div>
      </div>`
    )
    .join("");

  if (withNote) {
    const note = document.createElement("p");
    note.className = "strategy__note";
    note.textContent = profile.strategy.note;
    host.appendChild(note);
  }
}


/* ==========================================================================
   Retrato do perfil
   ========================================================================== */
const ART = {
  ermitao: {
    src: "perfil%20festeiro_pessoa.png",
    alt: "Rosto sorridente e descansado",
    caption: "Sofá ocupado, cobertor no lugar, domingo garantido.",
  },
  assombracao: {
    src: "perfil%20festeiro_fantasma.png",
    alt: "Um fantasma",
    caption: "Aparece, assombra por uma hora e some sem se despedir.",
  },
  inimigo: {
    src: "perfil%20festeiro_zumbi.png",
    alt: "Rosto de zumbi com olheiras",
    caption: "Ainda na pista quando o sol resolve aparecer.",
  },
};

/* Os dois eventos da AUVP abrem a lista de ativos, com a mesma moldura dos
   picks do perfil: a data entra abaixo do nome e o corpo é a leitura do perfil,
   o mesmo conteúdo do card "Onde a AUVP te espera" em outro formato. */
function renderPicks(host, profile) {
  const eventPicks = ["giro", "private"].map((key) => ({
    name: EVENTS[key].name,
    tag: "Evento AUVP",
    when: EVENTS[key].when,
    text: profile.events[key],
    event: true,
  }));

  host.innerHTML = "";
  [...eventPicks, ...profile.picks].forEach((pick) => {
    const el = document.createElement("article");
    el.className = `pick${pick.event ? " pick--event" : ""}`;
    el.innerHTML = `
      <div class="pick__head">
        <h4 class="pick__name">${pick.name}</h4>
        <span class="pick__tag">${pick.tag}</span>
      </div>
      ${pick.when ? `<span class="pick__when">${pick.when}</span>` : ""}
      <p class="pick__text">${pick.text}</p>
    `;
    host.appendChild(el);
  });
}

function renderEvents(host, leadEl, profile) {
  leadEl.textContent = profile.events.lead;
  host.innerHTML = "";
  ["giro", "private"].forEach((key) => {
    const event = EVENTS[key];
    const el = document.createElement("article");
    el.className = "event";
    el.innerHTML = `
      <div class="event__head">
        <h4 class="event__name">${event.name}</h4>
        <span class="event__when">${event.when}</span>
      </div>
      <p class="event__pitch">${profile.events[key]}</p>
      <p class="event__about">${event.about}</p>
    `;
    host.appendChild(el);
  });
}

function renderPoint(item, warn) {
  const el = document.createElement("article");
  el.className = `point${warn ? " point--warn" : ""}`;
  el.innerHTML = `
    <span class="point__badge">${warn ? "Atenção" : "Ponto forte"}</span>
    <h4 class="point__title">${item.title}</h4>
    <p class="point__text">${item.text}</p>
  `;
  return el;
}

function animateMetrics(root) {
  root.querySelectorAll("[data-width]").forEach((el) => {
    el.style.width = `${el.dataset.width}%`;
  });
  root.querySelectorAll("[data-count]").forEach((el) => {
    countUp(el, Number(el.dataset.count));
  });
}

/* ==========================================================================
   Resultado
   ========================================================================== */
function renderResult(profile) {
  state.profile = profile;

  const art = ART[profile.id];
  $("result-watermark").src = art.src;

  $("result-title").textContent = profile.category;
  $("result-subtitle").textContent = profile.name;
  $("topbar-name").textContent = profileText(profile);
  $("result-tagline").textContent = profile.tagline;
  $("result-description").textContent = profile.description;
  $("result-portfolio-subtitle").textContent = profile.portfolioSubtitle;
  $("result-quote").textContent = profile.quote;
  $("btn-share").href = shareLink(profile);

  $("result-portfolio-why").textContent = profile.portfolioWhy;

  renderIndicators($("result-indicators"), profile);
  renderStrategy($("result-strategy"), profile);
  renderBars($("result-bars"), profile);
  renderPicks($("result-picks"), profile);
  renderEvents($("result-events"), $("result-events-lead"), profile);

  const wrap = $("result-donut-wrap");
  const animate = mountDonut(
    wrap,
    wrap.parentElement.querySelector(".legend"),
    profile.portfolio,
    $("result-bars")
  );

  setupReveal();
  setTimeout(() => {
    animateMetrics($("screen-result"));
    animate();
  }, 250);
}

function setupReveal() {
  const els = document.querySelectorAll("#screen-result .reveal");
  els.forEach((el) => el.classList.remove("in-view"));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const io = new IntersectionObserver(
    (items) => {
      items.forEach((item) => {
        if (item.isIntersecting) {
          item.target.classList.add("in-view");
          io.unobserve(item.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.04 }
  );
  els.forEach((el) => io.observe(el));
  requestAnimationFrame(() => $("lp-hero").classList.add("in-view"));
}

/* ==========================================================================
   Painel
   ========================================================================== */
const VIEWS = ["visao-geral", "perfil", "carteira"];

function renderDashboard(attempt) {
  const profile = getProfile(attempt.score);
  state.profile = profile;

  $("dash-profile").textContent = profile.category;
  $("dash-subtitle").textContent = profile.name;
  $("dash-tagline").textContent = profile.tagline;
  $("dash-description").textContent = profile.description;
  $("dash-signature").textContent = profile.tagline;
  $("dash-quote").textContent = profile.quote;
  $("dash-portfolio-subtitle").textContent = profile.portfolioSubtitle;
  $("btn-share-dash").href = shareLink(profile);

  // Escala de perfil
  const position = PROFILES.findIndex((p) => p.id === profile.id);
  $("scale-marker").style.left = `${[16, 50, 84][position]}%`;
  $("scale-note").textContent = profile.scaleNote;

  // Indicadores e estratégia
  renderIndicators($("dash-indicators"), profile);
  renderStrategy($("dash-strategy"), profile);
  renderStrategy($("dash-strategy-summary"), profile);

  // Retrato do perfil
  const art = ART[profile.id];
  $("dash-art").src = art.src;
  $("dash-art").alt = art.alt;
  $("dash-art-caption").textContent = art.caption;

  // Cartão de resumo
  $("summary-portrait").src = art.src;
  $("summary-portrait").alt = art.alt;
  $("summary-caption").textContent = art.caption;
  $("summary-badge").textContent = `${profile.category} · ${profile.name}`;
  $("summary-date").textContent = formatDate(attempt.savedAt);
  $("summary-text").textContent = profile.description;

  // Destaques
  $("dash-top-strength").replaceChildren(renderPoint(profile.strengths[0], false));
  $("dash-top-weakness").replaceChildren(renderPoint(profile.weaknesses[0], true));

  const strengths = $("dash-strengths");
  const weaknesses = $("dash-weaknesses");
  strengths.innerHTML = "";
  weaknesses.innerHTML = "";
  profile.strengths.forEach((s) => strengths.appendChild(renderPoint(s, false)));
  profile.weaknesses.forEach((w) => weaknesses.appendChild(renderPoint(w, true)));

  // Carteira
  $("dash-portfolio-why").textContent = profile.portfolioWhy;
  renderBars($("dash-bars"), profile);
  renderPicks($("dash-picks"), profile);
  renderEvents($("dash-events"), $("dash-events-lead"), profile);
  const miniWrap = $("dash-donut-wrap");
  const fullWrap = $("carteira-donut-wrap");
  const animateMini = mountDonut(
    miniWrap,
    miniWrap.parentElement.querySelector(".legend"),
    profile.portfolio
  );
  const animateFull = mountDonut(
    fullWrap,
    fullWrap.parentElement.querySelector(".legend"),
    profile.portfolio,
    $("dash-bars")
  );

  setTimeout(() => {
    animateMetrics($("screen-dashboard"));
    animateMini();
    animateFull();
  }, 250);
}

function setView(view) {
  const active = VIEWS.includes(view) ? view : VIEWS[0];
  VIEWS.forEach((v) => {
    $(`view-${v}`).hidden = v !== active;
  });
  document.querySelectorAll(".nav__link").forEach((link) => {
    link.classList.toggle("nav__link--active", link.dataset.view === active);
  });
  $("dash-kicker").textContent =
    active === "carteira"
      ? "Estratégia e alocação"
      : active === "perfil"
        ? "Análise de perfil"
        : "Seu perfil festivo";
}

function openDashboard(view) {
  const attempt = Storage.latest();
  if (!attempt) {
    showScreen("intro");
    return;
  }
  const target = view || currentRoute() || VIEWS[0];
  renderDashboard(attempt);
  setView(target);
  history.replaceState(null, "", `#/${VIEWS.includes(target) ? target : VIEWS[0]}`);
  showScreen("dashboard");
}

function currentRoute() {
  const match = location.hash.match(/^#\/([a-z-]+)/);
  return match ? match[1] : null;
}

window.addEventListener("hashchange", () => {
  const route = currentRoute();
  if (!route) return;
  if (!VIEWS.includes(route)) return;
  if (document.body.dataset.screen !== "dashboard") {
    openDashboard(route);
  } else {
    setView(route);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

/* ==========================================================================
   Barra fixa do resultado
   ========================================================================== */
const topbar = $("topbar");
window.addEventListener(
  "scroll",
  () => {
    if (document.body.dataset.screen !== "result") return;
    topbar.classList.toggle("topbar--visible", window.scrollY > 240);
  },
  { passive: true }
);

/* ==========================================================================
   Navegação
   ========================================================================== */
function startQuiz() {
  state.current = 0;
  state.answers.fill(null);
  renderQuestion();
  showScreen("quiz");
}

function goHome() {
  history.replaceState(null, "", location.pathname);
  topbar.classList.remove("topbar--visible");
  showScreen("intro");
  refreshIntro();
}

function refreshIntro() {
  $("btn-dashboard").classList.toggle("is-hidden", !Storage.latest());
}

document.querySelectorAll(".theme-toggle").forEach((btn) => {
  btn.addEventListener("click", () => Theme.toggle());
});

$("btn-start").addEventListener("click", startQuiz);
$("btn-dashboard").addEventListener("click", () => openDashboard(VIEWS[0]));
$("btn-to-dashboard").addEventListener("click", () => openDashboard(VIEWS[0]));
$("btn-to-dashboard-top").addEventListener("click", () => openDashboard(VIEWS[0]));
$("btn-redo").addEventListener("click", startQuiz);
$("btn-redo-2").addEventListener("click", startQuiz);
$("brand-home").addEventListener("click", goHome);

document.querySelectorAll(".nav__link, .card__link").forEach((link) => {
  link.addEventListener("click", (e) => {
    const view = (link.dataset.view || link.getAttribute("href").replace("#/", "")).trim();
    if (!VIEWS.includes(view)) return;
    e.preventDefault();
    history.replaceState(null, "", `#/${view}`);
    setView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

/* ==========================================================================
   Início
   ========================================================================== */
Theme.init();
Ambient.start();
renderQuestion();
refreshIntro();

if (VIEWS.includes(currentRoute()) && Storage.latest()) {
  openDashboard(currentRoute());
}
