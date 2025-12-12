// src/lapecWarsWTS/professorWorker.ts
import { parentPort, workerData } from "worker_threads";

if (!parentPort) {
  throw new Error("Este arquivo deve ser executado como Worker Thread.");
}

// Dados recebidos do main
const { name, min, max } = workerData;

function randInt(a: number, b: number): number {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

// Loop de ataques
function startAttacking() {
  const delay = randInt(400, 1400);

  setTimeout(() => {
    const damage = randInt(min, max);

    parentPort!.postMessage({
      type: "attack",
      attacker: name,
      damage,
    });

    // Continua atacando se o main permitir
    startAttacking();
  }, delay);
}

// Inicia worker
startAttacking();