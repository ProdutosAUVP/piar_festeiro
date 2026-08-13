# PIAR Festeiro

**Descubra seu perfil de festeiro** — o questionário de suitability mais importante da sua vida.

Bancos aplicam um questionário para descobrir quanto risco cabe na sua carteira.
O PIAR Festeiro adapta o mesmo método para a variável que realmente define o seu
fim de semana: o quanto de rolê o seu corpo aguenta.

## Como funciona

1. **10 perguntas** de análise de perfil festivo — apetite ao risco, horizonte de
   festejo, liquidez social, tolerância a volatilidade, reação a perdas.
2. Cada resposta vale de **1 a 4 pontos**, como nos questionários de suitability.
3. A soma classifica você em um dos três perfis:

| Pontos | Perfil | Leitura |
| --- | --- | --- |
| 10–19 | **Fica em Casa** | Tesouro Sofá: liquidez diária no controle remoto |
| 20–30 | **Sai às Vezes** | Multimercado: dança, mas com uma mão no corrimão |
| 31–40 | **Vamos Viver Essa Experiência** | Day trade de pista: alavancado em glitter |

4. O resultado é apresentado como uma landing page dividida em seções —
   diagnóstico, indicadores do perfil, carteira de rolês (com gráfico de pizza) e
   recomendação do analista.

## Design

- **Dark mode como prioridade**, em estética minimalista: tipografia sobre
  neutros, hairlines de 1px no lugar de caixas pesadas, sem gradientes.
- **Cor reservada a dois usos**: um acento único (`#e0b252`) para detalhes de
  interface — progresso, seleção, numeração de seção — e a paleta categórica do
  gráfico, onde a cor carrega dado.
- A paleta do gráfico foi validada contra a superfície escura (`#121214`) para
  faixa de luminosidade, piso de croma, separação sob daltonismo e contraste.
  Cada fatia mantém seu slot de cor; a separação entre fatias é um vão de 2px na
  cor da superfície, nunca um contorno.
- Gráfico de pizza em **SVG puro**, com hover que destaca a fatia, escurece as
  demais, sincroniza a legenda e abre um tooltip. A lista de alocação abaixo do
  gráfico funciona como visão de tabela, então nenhum valor depende só da cor.
- `prefers-reduced-motion` desliga animações e confete.

## Rodando localmente

Aplicação 100% estática, sem build e sem dependências:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

Ou abra o `index.html` direto no navegador.

## Estrutura

```
index.html   # telas: intro, quiz, processamento e resultado (landing page)
app.js       # perguntas, pontuação, perfis, carteiras e o gráfico de pizza
styles.css   # tokens de cor, tipografia e layout
```

---

*Este teste não constitui recomendação de rolê. Festa passada não é garantia de
ressaca futura.*
