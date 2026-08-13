/* ==========================================================================
   PIAR Festeiro — Análise de Perfil Festivo (APF)
   Mesma lógica dos questionários de suitability: cada resposta vale pontos,
   a soma cai numa faixa e a faixa define o perfil.
   ========================================================================== */

const QUESTIONS = [
  {
    kicker: "Pergunta 1 · Apetite ao risco",
    title: "Sexta-feira, 19h. Chega no grupo: “rolê hoje, bora?”. Qual sua reação?",
    options: [
      { text: "Já estou de pijama. Rolê sem 5 dias úteis de antecedência é golpe.", points: 1 },
      { text: "Depende: quem vai, onde é, tem cadeira? Faço minha due diligence antes.", points: 2 },
      { text: "Topo, mas com horário de saída definido em contrato.", points: 3 },
      { text: "Já respondi “bora” antes de ler a mensagem inteira.", points: 4 },
    ],
  },
  {
    kicker: "Pergunta 2 · Horizonte de festejo",
    title: "Qual é o seu horizonte de festejo, ou seja, até que horas seu corpo opera no mercado?",
    options: [
      { text: "Fecho o pregão às 22h. Depois disso, só circuit breaker.", points: 1 },
      { text: "Meia-noite. Viro abóbora com juros compostos de sono.", points: 2 },
      { text: "3h da manhã, se o payout (a festa) estiver pagando bem.", points: 3 },
      { text: "Horizonte? Eu opero no mercado 24h, igual cripto.", points: 4 },
    ],
  },
  {
    kicker: "Pergunta 3 · Tolerância a volatilidade",
    title: "Te oferecem uma caipirinha de origem duvidosa numa barraca de praia. Você:",
    options: [
      { text: "Recuso. Só consumo bebida com selo de rating AAA e nota fiscal.", points: 1 },
      { text: "Peço pra ver o preparo. Transparência é tudo numa boa gestão.", points: 2 },
      { text: "Aceito uma. Diversificar fornecedores faz parte da estratégia.", points: 3 },
      { text: "Peço duas e ainda pergunto se tem versão alavancada com absinto.", points: 4 },
    ],
  },
  {
    kicker: "Pergunta 4 · Aporte mensal",
    title: "Quanto do seu orçamento mensal vira aporte em festas?",
    options: [
      { text: "Quase nada. Meu dinheiro rende parado, igual eu no sofá.", points: 1 },
      { text: "Uma fatia planejada, com teto de gastos e stop loss no cartão.", points: 2 },
      { text: "Uma fatia generosa. Rolê bom é ativo que valoriza memória.", points: 3 },
      { text: "Aporte? Eu faço all-in. O boleto que aprenda a esperar.", points: 4 },
    ],
  },
  {
    kicker: "Pergunta 5 · Liquidez",
    title: "Qual é a sua liquidez social? Em quanto tempo você fica pronto pra sair de casa?",
    options: [
      { text: "D+30. Preciso de aviso prévio, plano logístico e uma soneca.", points: 1 },
      { text: "D+2. Consigo, mas vou reclamar durante todo o processo.", points: 2 },
      { text: "D+0. Me ligou, tô pronto no mesmo dia útil.", points: 3 },
      { text: "Liquidez imediata. Eu JÁ estou pronto. Eu durmo pronto.", points: 4 },
    ],
  },
  {
    kicker: "Pergunta 6 · Diversificação",
    title: "Como está a diversificação da sua carteira de rolês hoje?",
    options: [
      { text: "100% concentrada em jantar na casa de alguém. Renda fixa raiz.", points: 1 },
      { text: "Barzinho, aniversário e um churrasco por trimestre. Portfólio clássico.", points: 2 },
      { text: "Bar, balada, show, festival... gosto de exposição a vários setores.", points: 3 },
      { text: "Tenho posição em rolês que nem sei como fui parar. Isso é diversificar.", points: 4 },
    ],
  },
  {
    kicker: "Pergunta 7 · Reação a perdas",
    title: "Dia seguinte de festa, você acorda com uma ressaca braba. O que faz?",
    options: [
      { text: "Resgato tudo e prometo nunca mais me expor a esse mercado.", points: 1 },
      { text: "Fico de repouso, reavalio minha estratégia e volto em 30 dias.", points: 2 },
      { text: "Aceito a perda como custo operacional. Faz parte do negócio.", points: 3 },
      { text: "Ressaca é sinal de compra. Marco o próximo rolê ainda da cama.", points: 4 },
    ],
  },
  {
    kicker: "Pergunta 8 · Ativos alternativos",
    title: "A festa acabou, as luzes acenderam... e surge o convite pro after. O after é a cripto dos rolês: pode multiplicar a noite ou zerar você. O que faz?",
    options: [
      { text: "After? Eu nem estava na festa. Recebi essa pergunta por engano.", points: 1 },
      { text: "Agradeço, mas meu regulamento interno proíbe ativos de alto risco.", points: 2 },
      { text: "Vou, mas com posição pequena: uma horinha só e tô de olho no Uber.", points: 3 },
      { text: "Eu SOU o after. As pessoas me consultam pra saber onde vai ser.", points: 4 },
    ],
  },
  {
    kicker: "Pergunta 9 · Perfil de pista",
    title: "Tocou aquele hit no meio da festa. Qual é a sua estratégia de pista?",
    options: [
      { text: "Sigo firme na minha posição: sentado, segurando os casacos de todo mundo.", points: 1 },
      { text: "Balanço a cabeça no ritmo. Exposição mínima, risco controlado.", points: 2 },
      { text: "Vou pra pista, mas mantenho uma reserva de energia pra emergências.", points: 3 },
      { text: "Abro roda, puxo coreografia e assumo a gestão ativa da pista inteira.", points: 4 },
    ],
  },
  {
    kicker: "Pergunta 10 · Planejamento de longo prazo",
    title: "Carnaval está chegando. Qual é o seu plano de alocação?",
    options: [
      { text: "Alugar filme, fechar a cortina e fingir que é um feriado normal.", points: 1 },
      { text: "Uma matinê ou um bloquinho leve, com protetor solar e saída estratégica.", points: 2 },
      { text: "Bloco sim, bloco não. Alternância saudável entre festa e soro caseiro.", points: 3 },
      { text: "Os 5 dias, 3 cidades, 2 fantasias e 1 promessa de nunca mais (mentira).", points: 4 },
    ],
  },
];

/* Faixas de pontuação — 10 perguntas × 1 a 4 pontos = mínimo 10, máximo 40 */
const PROFILES = [
  {
    id: "casa",
    min: 10,
    max: 19,
    name: "Fica em Casa",
    tagline: "Perfil Tesouro Sofá — liquidez diária no controle remoto",
    description:
      "Você preza pela segurança do rolê. Prefere retornos consistentes — rir com quem já conhece, voltar cedo, acordar bem — a promessas de noites lendárias com alto risco de ressaca. Seu lema: melhor um churrasco garantido na mão do que dois afters voando. O convite chega, você agradece, e assiste ao rolê de camarote pelos stories dos outros. E sabe o que é mais bonito? Você NUNCA perde o domingo.",
    indicators: [
      { label: "Tolerância a ressaca", value: 15 },
      { label: "Liquidez social", value: 30 },
      { label: "Apetite a after", value: 5 },
      { label: "Horizonte de festejo", value: 25 },
    ],
    portfolioSubtitle:
      "Alocação de baixo risco, alta previsibilidade e retorno garantido em boas risadas.",
    portfolio: [
      { pct: 35, name: "Churrasco de domingo", note: "Renda fixa raiz: rende amizade acima do CDI" },
      { pct: 25, name: "Jantar na casa de amigos", note: "CDB — Comida, Descontração e Boa conversa" },
      { pct: 15, name: "Aniversário de família", note: "Título público: obrigatório, mas sempre paga (tem bolo)" },
      { pct: 15, name: "Happy hour que acaba às 21h", note: "Liquidez diária: você resgata cedo e sem multa" },
      { pct: 10, name: "Reserva de emergência social", note: "Ficar em casa vendo série — o colchão de segurança" },
    ],
    quote: "“A rentabilidade do seu sofá é passada, mas o conforto é garantido.”",
  },
  {
    id: "asvezes",
    min: 20,
    max: 30,
    name: "Sai às Vezes",
    tagline: "Perfil Multimercado — dança, mas com uma mão no corrimão",
    description:
      "Você equilibra a carteira como poucos: topa o risco de uma balada, mas mantém uma reserva de sono pra segunda-feira. Sai quando o rolê vale a pena e declina sem culpa quando não vale. Sabe entrar no rolê, sabe sair do rolê e — habilidade raríssima no mercado — sabe A HORA de sair do rolê. Os que ficam em casa te admiram, os que vivem cada experiência te respeitam, e o motorista de app das 2h te conhece pelo nome.",
    indicators: [
      { label: "Tolerância a ressaca", value: 55 },
      { label: "Liquidez social", value: 60 },
      { label: "Apetite a after", value: 45 },
      { label: "Horizonte de festejo", value: 60 },
    ],
    portfolioSubtitle:
      "Alocação balanceada: risco na medida, retorno divertido e segunda-feira preservada.",
    portfolio: [
      { pct: 30, name: "Happy hour prolongável", note: "Multimercado: começa renda fixa, pode virar variável" },
      { pct: 25, name: "Barzinho com música ao vivo", note: "Fundo imobiliário: você praticamente mora nele" },
      { pct: 20, name: "Festa de aniversário", note: "Dividendos sociais recorrentes, com bônus de bolo" },
      { pct: 15, name: "Balada ocasional", note: "Renda variável: entra com stop loss no horário" },
      { pct: 10, name: "Festival anual planejado", note: "Previdência festiva: aporta o ano todo pra resgatar em 3 dias" },
    ],
    quote: "“Diversifique seus rolês, mas nunca em detrimento do brunch de sábado.”",
  },
  {
    id: "experiencia",
    min: 31,
    max: 40,
    name: "Vamos Viver Essa Experiência",
    tagline: "Perfil Day Trade de Pista — alavancado em glitter e disposição",
    description:
      "Volatilidade é seu combustível. Você não vai à festa: você É a festa. Nenhum convite é recusado, nenhuma cidade é longe demais e nenhum horário é tarde demais. Opera alavancado em energia, aceita quedas severas de sono e considera ressaca um mero custo de corretagem. Seu histórico tem noites lendárias, stories que precisaram ser apagados e um chinelo perdido em cidade que você não lembra de ter visitado. Retorno alto, risco altíssimo — do jeito que você gosta.",
    indicators: [
      { label: "Tolerância a ressaca", value: 95 },
      { label: "Liquidez social", value: 100 },
      { label: "Apetite a after", value: 100 },
      { label: "Horizonte de festejo", value: 90 },
    ],
    portfolioSubtitle:
      "Alocação agressiva, exposição máxima ao setor de pista e derivativos de after.",
    portfolio: [
      { pct: 30, name: "Balada até o sol nascer", note: "Small caps: potencial explosivo, liquidez só no dia seguinte" },
      { pct: 25, name: "Festivais e Carnaval", note: "IPO anual: fila enorme, preço absurdo, você vai mesmo assim" },
      { pct: 20, name: "After de local incerto", note: "Cripto: ninguém sabe onde é, pode zerar sua semana" },
      { pct: 15, name: "Rolê aleatório com desconhecidos", note: "Day trade: 90% se machuca, você jura que é os 10%" },
      { pct: 10, name: "Reserva de soro e isotônico", note: "Hedge de ressaca: o único ativo garantido da carteira" },
    ],
    quote: "“Quem nunca perdeu um chinelo, nunca operou alavancado na pista.”",
  },
];

const LOADING_STEPS = [
  "Consultando o comitê de churrasco",
  "Calculando sua exposição a glitter",
  "Auditando seus stories das 3h da manhã",
  "Precificando seu risco de ressaca",
  "Rebalanceando sua carteira de rolês",
];

/* Paleta categórica do gráfico — ordem fixa, validada para a superfície escura.
   Slots nunca são reciclados: cada fatia mantém sua cor. */
const SERIES_COLORS = [
  "var(--series-1)",
  "var(--series-2)",
  "var(--series-3)",
  "var(--series-4)",
  "var(--series-5)",
];

/* ========================== Estado ========================== */
const state = {
  current: 0,
  answers: new Array(QUESTIONS.length).fill(null),
};

const $ = (id) => document.getElementById(id);

const screens = {
  intro: $("screen-intro"),
  quiz: $("screen-quiz"),
  loading: $("screen-loading"),
  result: $("screen-result"),
};

function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.remove("screen--active"));
  screens[name].classList.add("screen--active");
  window.scrollTo(0, 0);
}

/* ========================== Quiz ========================== */
function renderQuestion() {
  const q = QUESTIONS[state.current];
  $("question-kicker").textContent = q.kicker;
  $("question-title").textContent = q.title;
  $("progress-current").textContent = state.current + 1;
  $("progress-fill").style.width = `${(state.current / QUESTIONS.length) * 100}%`;
  $("btn-back").style.visibility = state.current === 0 ? "hidden" : "visible";

  const container = $("options");
  container.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option";
    if (state.answers[state.current] === i) btn.classList.add("option--selected");
    btn.innerHTML =
      `<span class="option__letter">${"ABCD"[i]}</span><span>${opt.text}</span>`;
    btn.addEventListener("click", () => selectOption(i, btn));
    container.appendChild(btn);
  });

  const body = $("quiz-body");
  body.classList.remove("quiz-body--enter");
  void body.offsetWidth; // reinicia a animação
  body.classList.add("quiz-body--enter");
}

function selectOption(index, btn) {
  state.answers[state.current] = index;
  document.querySelectorAll(".option").forEach((o) => o.classList.remove("option--selected"));
  btn.classList.add("option--selected");

  setTimeout(() => {
    if (state.current < QUESTIONS.length - 1) {
      state.current++;
      renderQuestion();
    } else {
      startLoading();
    }
  }, 320);
}

$("btn-back").addEventListener("click", () => {
  if (state.current > 0) {
    state.current--;
    renderQuestion();
  }
});

/* ========================== Processando ========================== */
function startLoading() {
  showScreen("loading");
  let step = 0;
  $("loading-step").textContent = LOADING_STEPS[0];
  $("loading-fill").style.width = "0%";

  const interval = setInterval(() => {
    step++;
    if (step >= LOADING_STEPS.length) {
      clearInterval(interval);
      showResult();
      return;
    }
    $("loading-step").textContent = LOADING_STEPS[step];
    $("loading-fill").style.width = `${(step / LOADING_STEPS.length) * 100}%`;
  }, 650);

  requestAnimationFrame(() => {
    $("loading-fill").style.width = `${(1 / LOADING_STEPS.length) * 100}%`;
  });
}

/* ========================== Resultado ========================== */
function computeScore() {
  return state.answers.reduce(
    (sum, answerIndex, qIndex) => sum + QUESTIONS[qIndex].options[answerIndex].points,
    0
  );
}

function getProfile(score) {
  return PROFILES.find((p) => score >= p.min && score <= p.max) || PROFILES[PROFILES.length - 1];
}

function renderIndicators(profile) {
  const host = $("indicators");
  host.innerHTML = "";
  profile.indicators.forEach((ind) => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.innerHTML = `
      <span class="tile__label">${ind.label}</span>
      <span class="tile__value">${ind.value}%</span>
      <div class="tile__track"><div class="tile__fill" data-width="${ind.value}"></div></div>
    `;
    host.appendChild(tile);
  });
}

/* --- Gráfico de pizza (donut) em SVG puro ---------------------------------
   Cada fatia é um arco do mesmo círculo desenhado com stroke-dasharray.
   O separador entre fatias é um vão de 2px na cor da superfície, e não um
   contorno — traço em volta da marca adicionaria tinta que não é dado.      */
const DONUT = { radius: 74, gap: 2 };

function renderDonut(profile) {
  const group = $("donut-segments");
  const tooltip = $("tooltip");
  const svg = $("donut");
  const legend = $("legend");
  const circumference = 2 * Math.PI * DONUT.radius;

  group.innerHTML = "";
  legend.innerHTML = "";

  let offset = 0;
  const segments = [];

  profile.portfolio.forEach((item, i) => {
    const length = (item.pct / 100) * circumference;
    const color = SERIES_COLORS[i];

    const seg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    seg.setAttribute("class", "donut__seg");
    seg.setAttribute("cx", "100");
    seg.setAttribute("cy", "100");
    seg.setAttribute("r", String(DONUT.radius));
    // via style (e não atributo) porque atributo de apresentação não resolve var()
    seg.style.stroke = color;
    seg.setAttribute("stroke-dasharray", `0 ${circumference}`);
    seg.setAttribute("stroke-dashoffset", String(-offset));
    seg.dataset.target = `${Math.max(length - DONUT.gap, 0)} ${circumference - Math.max(length - DONUT.gap, 0)}`;
    group.appendChild(seg);

    const row = document.createElement("div");
    row.className = "legend__row";
    row.innerHTML = `
      <span class="legend__swatch" style="background:${color}"></span>
      <span class="legend__name">${item.name}</span>
      <span class="legend__value">${item.pct}%</span>
    `;
    legend.appendChild(row);

    segments.push({ seg, row, item });
    offset += length;
  });

  /* Mantém o tooltip dentro do painel: acima do cursor, mas nunca estourando
     a borda superior do gráfico. */
  const placeTooltip = (x, y) => {
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${Math.max(y, tooltip.offsetHeight + 8)}px`;
  };

  /* Camada de hover: destaca a fatia, escurece as demais e abre o tooltip. */
  const highlight = (entry, on) => {
    svg.classList.toggle("donut--dim", on);
    legend.classList.toggle("legend--dim", on);
    entry.seg.classList.toggle("donut__seg--active", on);
    entry.row.classList.toggle("legend__row--active", on);
    if (on) {
      tooltip.innerHTML = `
        <span class="tooltip__name">${entry.item.name}</span>
        <span class="tooltip__value">${entry.item.pct}% da carteira</span>
      `;
    }
    tooltip.classList.toggle("tooltip--visible", on);
  };

  segments.forEach((entry) => {
    const enter = () => highlight(entry, true);
    const leave = () => highlight(entry, false);

    entry.seg.addEventListener("mouseenter", enter);
    entry.seg.addEventListener("mouseleave", leave);

    entry.seg.addEventListener("mousemove", (e) => {
      const box = svg.parentElement.getBoundingClientRect();
      placeTooltip(e.clientX - box.left, e.clientY - box.top);
    });

    // Pela legenda o cursor está fora do gráfico: ancora o tooltip no centro.
    entry.row.addEventListener("mouseenter", () => {
      enter();
      placeTooltip(svg.parentElement.offsetWidth / 2, svg.parentElement.offsetHeight / 2);
    });
    entry.row.addEventListener("mouseleave", leave);
  });
}

function renderPortfolio(profile) {
  const host = $("portfolio-items");
  host.innerHTML = "";
  profile.portfolio.forEach((item, i) => {
    const row = document.createElement("div");
    row.className = "alloc__row";
    row.innerHTML = `
      <span class="alloc__bar" style="background:${SERIES_COLORS[i]}"></span>
      <span>
        <span class="alloc__name">${item.name}</span>
        <span class="alloc__note">${item.note}</span>
      </span>
      <span class="alloc__pct">${item.pct}%</span>
    `;
    host.appendChild(row);
  });
}

function showResult() {
  const score = computeScore();
  const profile = getProfile(score);

  $("result-title").textContent = profile.name;
  $("topbar-name").textContent = profile.name;
  $("result-tagline").textContent = profile.tagline;
  $("result-score").textContent = score;
  $("result-description").textContent = profile.description;
  $("portfolio-subtitle").textContent = profile.portfolioSubtitle;
  $("result-quote").textContent = profile.quote;

  renderIndicators(profile);
  renderDonut(profile);
  renderPortfolio(profile);

  const shareText =
    `Fiz a Análise de Perfil Festivo e o resultado saiu: "${profile.name}".\n` +
    `${profile.tagline}\n\nDescubra o seu perfil: ${window.location.href}`;
  $("btn-share").href = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  showScreen("result");
  launchConfetti();

  // Anima as barras e as fatias depois que a tela entra
  setTimeout(() => {
    document.querySelectorAll("[data-width]").forEach((el) => {
      el.style.width = `${el.dataset.width}%`;
    });
    document.querySelectorAll(".donut__seg").forEach((seg, i) => {
      // o atraso vale só para o desenho da fatia; hover continua respondendo na hora
      seg.style.transition =
        `stroke-dasharray 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.09}s,` +
        " stroke-width 0.16s ease, opacity 0.16s ease";
      seg.setAttribute("stroke-dasharray", seg.dataset.target);
    });
  }, 250);
}

/* ========================== Barra fixa ========================== */
const topbar = $("topbar");
window.addEventListener("scroll", () => {
  if (!screens.result.classList.contains("screen--active")) return;
  topbar.classList.toggle("topbar--visible", window.scrollY > 260);
});

/* ========================== Confete ========================== */
function launchConfetti() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const container = $("confetti");
  container.innerHTML = "";
  for (let i = 0; i < 26; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti__piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.animationDelay = `${Math.random() * 1.2}s`;
    piece.style.animationDuration = `${1.8 + Math.random() * 1.4}s`;
    container.appendChild(piece);
  }
  setTimeout(() => (container.innerHTML = ""), 4200);
}

/* ========================== Navegação ========================== */
function restart() {
  state.current = 0;
  state.answers.fill(null);
  topbar.classList.remove("topbar--visible");
  renderQuestion();
  showScreen("intro");
}

$("btn-start").addEventListener("click", () => {
  state.current = 0;
  state.answers.fill(null);
  renderQuestion();
  showScreen("quiz");
});

$("btn-restart").addEventListener("click", restart);
$("btn-restart-top").addEventListener("click", restart);
