# **LAPEC WARS — README**

## 🎮 Lapec Wars — Simulação de Concorrência em TypeScript

Este projeto foi desenvolvido como **atividade prática de programação concorrente**, com o objetivo de comparar duas abordagens:

- Uma versão que simula concorrência usando **setTimeout**  
- Uma versão que utiliza **Worker Threads**, executando cada batalha em paralelo real

Para tornar o aprendizado divertido, cada “processo” é representado por professores do Lapec lutando entre si.

---

## 🧵 Versão 1 — LapecWarsWTS (Worker Threads)

### **Descrição**
Nesta versão, cada professor é executado dentro de um **Worker Thread**, que funciona como uma thread real dentro do Node.js.

Cada worker:

- Possui seus próprios dados (HP, ataque mínimo e máximo)
- Ataca independentemente
- Envia mensagens ao processo principal com resultados
- Morre ou continua lutando sem afetar os outros workers

### **Como funciona**
O processo principal:

1. Cria um Worker para cada professor  
2. Recebe mensagens como:  
   - ataques  
   - morte de processo  
   - fim da luta  
3. Controla o jogo, mas **não processa a lógica de batalha**  
4. Encerramento ocorre quando sobra apenas um worker vivo  

As lutas acontecem **em paralelo real**, pois cada Worker é uma thread separada.

### **Como executar**
```bash
npx ts-node src/lapecWarsWTS/main.ts
```

---

## ⏱️ Versão 2 — LapecWarsSTO (setTimeout)

### **Descrição**
Nesta versão, não há threads.  
A “simulação de paralelismo” é feita com uso de `setTimeout`, que agenda ataques futuros dentro do **Event Loop**.

### **Como funciona**
- Cada professor é controlado pelo próprio processo principal.
- Cada ataque é agendado com um timer diferente.
- A execução **não é paralela**, mas assíncrona.
- Mesmo parecendo simultâneo, tudo roda no **mesmo thread**.

### **Para que serve?**
Ideal para demonstrar como criar sistemas reativos, mas sem uso de múltiplas threads.

### **Como executar**
```bash
npx ts-node src/lapecWarsSTO/battle.ts
```

---

## ⚔️ Diferenças entre as versões

| Característica | Version Worker Threads | Versão setTimeout |
|----------------|------------------------|--------------------|
| Paralelismo | **Real** | Simulado |
| Execução | Cada professor em um Worker | Todos no mesmo processo |
| Complexidade | Alta | Baixa |
| Desempenho | Ideal para cálculos pesados | Bom para simulações simples |
| Comunicação | `parentPort.postMessage()` | Variáveis e timers |
| Modelo | Threads reais | Event Loop |

---

## 📂 Estrutura do Projeto

```
src/
│
├── lapecWarsWTS/
│   ├── main.ts             # Controla os Workers
│   └── professorWorker.ts  # Código executado por cada Worker Thread
│
└── lapecWarsSTO/
    └── battle.ts             # Luta usando timers (setTimeout)
```

---

## 🛠️ Tecnologias Utilizadas

- **Node.js**
- **Worker Threads**
- **TypeScript**
- **ts-node**

---

## 🏁 Conclusão

O projeto **Lapec Wars** demonstra, de forma prática e divertida:

- Como funciona o paralelismo real com Worker Threads
 
- Como o Node simula concorrência com timers  
- As diferenças entre concorrência assíncrona e paralelismo de verdade  
