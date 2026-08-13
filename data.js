/* ==========================================================================
   PIAR Festeiro — conteúdo da aplicação
   Perguntas, perfis, análise e carteiras. Separado da lógica para que ajustar
   texto não exija mexer em comportamento.
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
    short: "Fica em Casa",
    tagline: "Perfil Tesouro Sofá — liquidez diária no controle remoto",
    scaleNote:
      "Você está na ponta conservadora da escala: baixa exposição a rolê e altíssima previsibilidade de domingo.",
    description:
      "Você preza pela segurança do rolê. Prefere retornos consistentes — rir com quem já conhece, voltar cedo, acordar bem — a promessas de noites lendárias com alto risco de ressaca. Seu lema: melhor um churrasco garantido na mão do que dois afters voando. O convite chega, você agradece, e assiste ao rolê de camarote pelos stories dos outros. E sabe o que é mais bonito? Você NUNCA perde o domingo.",
    indicators: [
      { label: "Tolerância a ressaca", value: 15 },
      { label: "Liquidez social", value: 30 },
      { label: "Apetite a after", value: 5 },
      { label: "Horizonte de festejo", value: 25 },
    ],
    strengths: [
      {
        title: "Custo operacional baixíssimo",
        text: "Sua diversão cabe no orçamento sem esforço e ainda sobra para o aporte de verdade.",
      },
      {
        title: "Domingo sempre no azul",
        text: "Enquanto o mercado inteiro se recupera da noite, você já tomou café e resolveu a semana.",
      },
      {
        title: "Relacionamentos de longo prazo",
        text: "Poucos ativos na carteira, mas todos com histórico de mais de dez anos.",
      },
    ],
    weaknesses: [
      {
        title: "Concentração excessiva",
        text: "Se o seu grupo de sempre viaja no mesmo fim de semana, sua carteira zera.",
      },
      {
        title: "Você vai ouvir falar daquela noite",
        text: "Toda turma tem um rolê que virou lenda. Você conhece o seu pelo relato dos outros.",
      },
      {
        title: "Liquidez travada",
        text: "Convite de última hora quase nunca encontra você disponível.",
      },
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
    short: "Sai às Vezes",
    tagline: "Perfil Multimercado — dança, mas com uma mão no corrimão",
    scaleNote:
      "Você está no meio da escala: exposição equilibrada, com reserva de sono preservada para a segunda-feira.",
    description:
      "Você equilibra a carteira como poucos: topa o risco de uma balada, mas mantém uma reserva de sono pra segunda-feira. Sai quando o rolê vale a pena e declina sem culpa quando não vale. Sabe entrar no rolê, sabe sair do rolê e — habilidade raríssima no mercado — sabe A HORA de sair do rolê. Os que ficam em casa te admiram, os que vivem cada experiência te respeitam, e o motorista de app das 2h te conhece pelo nome.",
    indicators: [
      { label: "Tolerância a ressaca", value: 55 },
      { label: "Liquidez social", value: 60 },
      { label: "Apetite a after", value: 45 },
      { label: "Horizonte de festejo", value: 60 },
    ],
    strengths: [
      {
        title: "Rebalanceamento natural",
        text: "Uma noite fora, uma noite em casa: você ajusta a carteira sem nem perceber que está ajustando.",
      },
      {
        title: "Sabe a hora de sair",
        text: "A habilidade mais rara do mercado, e você exerce sem sofrer nem avisar ninguém.",
      },
      {
        title: "Boa relação risco-retorno",
        text: "Colhe as histórias boas sem pagar o preço integral da ressaca no dia seguinte.",
      },
    ],
    weaknesses: [
      {
        title: "Excesso de análise",
        text: "Às vezes o rolê termina enquanto você ainda avalia se valia a pena ter ido.",
      },
      {
        title: "Meio-termo pode virar ausência",
        text: "Responder “essa aqui eu passo” com frequência é como não aportar: parece neutro, mas custa.",
      },
      {
        title: "Dependência do combinado",
        text: "Se ninguém do grupo organiza, sua carteira fica parada esperando iniciativa alheia.",
      },
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
    short: "Vamos Viver",
    tagline: "Perfil Day Trade de Pista — alavancado em glitter e disposição",
    scaleNote:
      "Você está na ponta agressiva da escala: exposição máxima a rolê e liquidez social imediata, a qualquer hora.",
    description:
      "Volatilidade é seu combustível. Você não vai à festa: você É a festa. Nenhum convite é recusado, nenhuma cidade é longe demais e nenhum horário é tarde demais. Opera alavancado em energia, aceita quedas severas de sono e considera ressaca um mero custo de corretagem. Seu histórico tem noites lendárias, stories que precisaram ser apagados e um chinelo perdido em cidade que você não lembra de ter visitado. Retorno alto, risco altíssimo — do jeito que você gosta.",
    indicators: [
      { label: "Tolerância a ressaca", value: 95 },
      { label: "Liquidez social", value: 100 },
      { label: "Apetite a after", value: 100 },
      { label: "Horizonte de festejo", value: 90 },
    ],
    strengths: [
      {
        title: "Você nunca fica de fora",
        text: "Toda noite histórica do grupo tem você em alguma foto, geralmente no centro dela.",
      },
      {
        title: "Rede de contatos ampla",
        text: "Sua carteira tem mais ativos do que a maioria das pessoas consegue acompanhar.",
      },
      {
        title: "Liquidez imediata",
        text: "Chamou, você já está pronto. Disponibilidade é o seu maior patrimônio.",
      },
    ],
    weaknesses: [
      {
        title: "Segunda-feira no vermelho",
        text: "O retorno é alto, mas o prejuízo de sono aparece pontualmente todo começo de semana.",
      },
      {
        title: "Custo de corretagem alto",
        text: "Transporte, entrada e rodada: a conta do rolê raramente chega sozinha.",
      },
      {
        title: "Sem reserva de emergência",
        text: "Com tudo alocado em pista, sobra pouca energia para o imprevisto de terça-feira.",
      },
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
const SERIES = ["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181"];

/* Cores das manchas de luz do fundo */
const NEON = "#b6ff3a";
const LIGHTS = ["#b6ff3a", "#3987e5", "#d55181", "#00e5ff", "#d95926", "#a06bff"];
