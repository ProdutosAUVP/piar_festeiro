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
| 10–19 | **Ermitão** · Fica em Casa | Tesouro Sofá: liquidez diária no controle remoto |
| 20–30 | **Assombração** · Sai às Vezes | Multimercado: dança, mas com uma mão no corrimão |
| 31–40 | **Inimigo do Fim** · Vamos Viver Essa Experiência | Day trade de pista: alavancado em glitter |


A categoria e o título andam sempre juntos — na escala, no resultado, no painel
e no compartilhamento.

4. O resultado é revelado como uma landing page e fica guardado num **painel**
   permanente, acessível a qualquer momento.

## Telas

| Tela | O que faz |
| --- | --- |
| **Landing** | Rastro verde de luz que segue o cursor, sobre um fundo onde manchas coloridas surgem sozinhas. Cards com os números da análise. |
| **Questionário** | Uma pergunta por vez, trilha de progresso clicável, navegação por teclado. |
| **Processamento** | Um brinde: taça com bolhas subindo enquanto o comitê de churrasco é consultado. |
| **Resultado** | Diagnóstico, indicadores, estratégia ideal, sugestão de alocação (barras + gráfico de pizza) e recomendação do analista. |
| **Painel** | Visão geral, Perfil e Carteira — roteados por hash (`#/visao-geral`, `#/perfil`, `#/carteira`). |

### O painel

- **Visão geral** — posição na escala festiva, resumo da estratégia ideal,
  indicadores, sugestão de alocação resumida, um destaque positivo e um ponto
  de atenção.
- **Perfil** — diagnóstico ao lado de uma ilustração do perfil, três **pontos
  fortes**, três **pontos de atenção** e a recomendação do analista.
- **Carteira** — **estratégia ideal** (quanto do seu fim de semana é curadoria
  própria e quanto é o que o grupo já marcou) e a **sugestão de alocação** em
  duas colunas: barras por tipo de rolê à esquerda, gráfico de pizza à direita.

Cada área tem URL própria, então dá para recarregar ou favoritar direto numa
seção.

## Dados

O resultado e a preferência de tema ficam em `localStorage`, ou seja, **apenas
no navegador de quem respondeu**. Não existe backend, nenhuma informação sai do
dispositivo e nada é enviado para servidor algum. Limpar os dados do site apaga
o registro.

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

## Design

- **Dark mode como prioridade**, em estética minimalista: tipografia sobre
  neutros, cards no lugar de linhas divisórias. O tema claro usa a mesma
  estrutura, com sua própria paleta.
- **Cor reservada a dois usos**: o acento neon (`#b6ff3a` no escuro, um verde
  mais fechado no claro para garantir contraste) nos elementos de destaque —
  botões, números, links, progresso — e a paleta categórica do gráfico, onde a
  cor carrega dado. O clima de festa vem da luz do fundo.
- A paleta do gráfico tem um jogo por tema, cada um validado contra a sua
  superfície para faixa de luminosidade, piso de croma, separação sob
  daltonismo e contraste. Ela vive no CSS (`--series-1..5`), então trocar de
  tema repinta o gráfico sozinho. Cada fatia mantém seu slot de cor; a
  separação entre fatias é um vão de 2px na cor da superfície, nunca um
  contorno.
- Painéis levemente translúcidos com `backdrop-filter`, para as luzes
  atravessarem sem prejudicar a leitura.
- Cada perfil tem uma ilustração própria em SVG inline, desenhada com as
  variáveis de cor do tema — muda de paleta junto com o resto.
- `prefers-reduced-motion` congela o fundo, desliga o confete e entrega todas as
  seções já reveladas.
- Responsivo de 320px para cima.

## Rodando localmente

Aplicação 100% estática, sem build e sem dependências:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Estrutura

```
index.html   # landing, questionário, processamento, resultado e painel
data.js      # perguntas, perfis, análise e carteiras
app.js       # fundo de luz, questionário, gráfico, painel e roteamento
styles.css   # tokens de cor, tipografia e layout
```

---

*Este teste não constitui recomendação de rolê. Festa passada não é garantia de
ressaca futura.*
