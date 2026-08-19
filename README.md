# PIAR Festeiro

**Descubra seu perfil de festeiro** — o questionário de suitability mais importante da sua vida.

Bancos aplicam um questionário para descobrir quanto risco cabe na sua carteira.
O PIAR Festeiro adapta o mesmo método para a variável que realmente define o seu
fim de semana: o quanto de rolê o seu corpo aguenta.

## Como funciona

1. **10 perguntas** de análise de perfil festivo — apetite ao risco, horizonte de
   festejo, liquidez social, tolerância a volatilidade, reação a perdas.
2. Cada resposta vale de **1 a 4 pontos**, como nos questionários de suitability.
3. A soma classifica em um dos três perfis:

| Pontos | Perfil | Leitura |
| --- | --- | --- |
| 10–19 | **Ermitão** — Fica em casa | Tesouro sofá: liquidez diária no controle remoto |
| 20–30 | **Assombração** — Sai às vezes | Multimercado: dança, mas com uma mão no corrimão |
| 31–40 | **Inimigo do fim** — Vamos viver essa experiência | Day trade de pista: alavancado em glitter |

A categoria é o título e o descritor é o subtítulo logo abaixo. Os dois andam
sempre juntos — na escala, no resultado, no painel e no compartilhamento.

4. O resultado é revelado como uma landing page e fica guardado num **painel**
   permanente, acessível a qualquer momento.

## Telas

| Tela | O que faz |
| --- | --- |
| **Landing** | Rastro discreto de luz verde acompanhando o cursor. Cards com os números da análise. |
| **Questionário** | Uma pergunta por vez, trilha de progresso clicável, navegação por teclado. |
| **Processamento** | Um brinde: taça com bolhas subindo enquanto o comitê de churrasco é consultado. |
| **Resultado** | Retrato do perfil como marca d'água no hero, diagnóstico, indicadores, sugestão de alocação (barras + gráfico de pizza), eventos da AUVP, estratégia ideal e recomendação do analista. |
| **Painel** | Visão geral, Perfil e Carteira — roteados por hash (`#/visao-geral`, `#/perfil`, `#/carteira`). |

### O painel

- **Visão geral** — resumo em dois cards no topo (texto à esquerda, retrato do
  perfil à direita), o par escala festiva + indicadores, os cards horizontais de
  sugestão de alocação, o convite para os eventos da AUVP e a estratégia ideal, e
  o par destaque positivo + ponto de atenção.
- **Perfil** — diagnóstico ao lado do retrato do perfil, assinado no rodapé com
  a tagline, três **pontos fortes**, três **pontos de atenção** e a recomendação
  do analista.
- **Carteira** — **por que essa carteira** foi montada assim, a **sugestão de
  alocação** em duas colunas (barras por tipo de rolê à esquerda, gráfico de
  pizza à direita), os **ativos recomendados** — quatro do perfil mais o Giro da
  Bolsa Itinerante e o Private Day, marcados como Evento AUVP — e a **estratégia
  ideal**: quanto do seu fim de semana é rolê escolhido a dedo e quanto é rolê
  que o grupo marcou.

Cada área tem URL própria, então dá para recarregar ou favoritar direto numa
seção.

## Dados

O resultado e a preferência de tema ficam em `localStorage`, ou seja, **apenas
no navegador de quem respondeu**. Não existe backend e nenhuma resposta do
questionário é enviada para servidor algum. Limpar os dados do site apaga o
registro.

A página carrega o **Microsoft Clarity** (`y4xdvzodne`) para medir uso —
navegação, cliques e mapas de calor. É a única coisa que sai do dispositivo, e
ela não carrega o resultado do teste.

## Interação

- **Teclado**: `A`–`D` ou `1`–`4` respondem, `←` volta, `Enter` inicia.
- **Trilha de progresso clicável** — qualquer pergunta já respondida pode ser
  revisitada sem perder as respostas seguintes.
- **Gráfico**: o hover destaca a fatia e sincroniza legenda, barra de alocação e
  o miolo do donut, que passa a mostrar o percentual daquele item; clicar fixa o
  destaque; as fatias são focáveis pelo teclado.
- **Fundo animado** com rastro verde de luz na landing e luzes à deriva no
  resultado e no painel. Pausa quando a aba perde o foco.
- **Tema claro e escuro**, com o do sistema como padrão e um botão que fixa a
  escolha. O tema é aplicado antes da primeira pintura, sem piscar.
- Seções do resultado revelam no scroll e os indicadores contam até o valor.

## Eventos

No fim do resultado e na visão geral do painel entra a sugestão de eventos da
AUVP — **Giro da Bolsa Itinerante** e **Private Day** —, e os dois também
aparecem entre os ativos recomendados da carteira, com a tag Evento AUVP. A descrição de cada evento é sempre a
mesma; o que muda por perfil é a leitura: o Ermitão é orientado a ir pelo
conteúdo e pular a festa, a Assombração a aparecer e sair antes do bis, e o
Inimigo do fim a ficar até o fim e perguntar onde é o after.

No Giro da Bolsa Itinerante a ordem do evento é explícita em todos os textos:
primeiro acontece a gravação do programa e só depois que ela é encerrada é que
começa a parte de comer, beber e confraternizar.

## Design

Segue o **design system da AUVP Capital**
(https://produtosauvp.github.io/central/design-system):

- **Cor.** Verde `#023620` no tema claro e `#5a8770` no escuro, reservado a
  acentos pontuais. Base preto/branco/cinza no escuro (`#000` de fundo, `#0f0f0f`
  de card, `#292929` de borda) e branco/cinza no claro, com contraste baixo entre
  card e fundo.
- **Proibições da marca respeitadas**: sem vidro/`backdrop-filter`, sem gradiente
  colorido, sem neon, sem transparência em card.
- **Tipografia.** Anek Latin nos títulos, Roboto no corpo e Sora exclusivamente
  nos botões.
- **Forma.** Raio de 12px em cards, 5px em botões e 4px em tags e badges, que
  usam fundo sólido. Pílula só em barra de dados.
- **Motion.** 150ms em micro-interações, 240ms como padrão, com o easing
  `cubic-bezier(0.22, 1, 0.36, 1)`. Hover de card é `0 8px 24px rgba(0,0,0,0.06)`.
- **Data viz.** O gráfico usa a paleta categórica documentada (`chart-1..5`), com
  um jogo por tema. Ela vive no CSS (`--series-1..5`), então trocar de tema
  repinta o gráfico sozinho. Cada fatia mantém seu slot de cor; a separação entre
  fatias é um vão de 2px na cor da superfície, nunca um contorno.
- Cada perfil tem um retrato próprio (`perfil festeiro_*.png`), usado no card de
  resumo, na análise de perfil e como marca d'água discreta no hero do resultado.
- `prefers-reduced-motion` congela o fundo e entrega todas as seções reveladas.
- Ritmo vertical único no painel: um espaçamento entre blocos de topo, e o
  espaço entre cards de uma mesma linha vem sempre do `gap` do grid.
- Dentro de card, quem define a quebra de linha é o padding do container.
- **Capitalização** em sentence case no site inteiro, inclusive nos botões e
  tags. É uma divergência deliberada do design system, que pede caixa alta em
  botões: aqui vale o padrão do produto.
- Responsivo de 320px para cima; os grids de duas colunas quebram em 900px.

## Rodando localmente

Aplicação 100% estática, sem build e sem dependências:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Estrutura

```
index.html              # landing, questionário, processamento, resultado e painel
data.js                 # perguntas, perfis, análise, carteiras e ativos
app.js                  # fundo de luz, questionário, gráfico, painel e roteamento
styles.css              # tokens de cor, tipografia e layout
perfil festeiro_*.png   # retratos dos três perfis
```

---

*Este teste não constitui recomendação de rolê. Festa passada não é garantia de
ressaca futura.*
