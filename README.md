# 🎉 PIAR Festeiro

**Descubra seu Perfil de Festeiro** — o teste de suitability mais importante da sua vida.

Inspirado nos testes de perfil de investidor dos bancos (aqueles que te classificam como
conservador, moderado ou arrojado antes de deixar você perder dinheiro), o PIAR Festeiro
faz a mesma coisa... só que pra festa.

## Como funciona

1. Você responde **10 perguntas** de "análise de perfil festivo" (apetite ao risco de rolê,
   horizonte de festejo, liquidez social, tolerância a ressaca...).
2. Cada resposta vale de **1 a 4 pontos** — exatamente como os questionários de suitability.
3. A soma dos pontos te classifica em um dos três perfis:

| Perfil | Pontuação | Resumo |
| --- | --- | --- |
| 🛋️ **Festeiro Conservador** | 10–19 | Tesouro Sofá: liquidez diária no controle remoto |
| ⚖️ **Festeiro Moderado** | 20–30 | Multimercado: dança, mas com uma mão no corrimão |
| 🚀 **Festeiro Arrojado** | 31–40 | Day Trade de Pista: alavancado em glitter |

4. Ao final, você recebe uma **carteira de rolês recomendada** com alocação percentual —
   de "churrasco de domingo (renda fixa raiz)" a "after de local incerto (a cripto dos rolês)".

## Rodando localmente

É uma aplicação 100% estática, sem build e sem dependências:

```bash
# qualquer servidor estático funciona, por exemplo:
python3 -m http.server 8000
# e abra http://localhost:8000
```

Ou simplesmente abra o `index.html` no navegador.

## Estrutura

```
index.html   # telas: intro, quiz, loading e resultado
app.js       # perguntas, pontuação, perfis, carteiras e navegação
styles.css   # visual festivo (gradientes, confete, barras animadas)
```

---

*Este teste não constitui recomendação de rolê. Festa passada não é garantia de ressaca futura.*
