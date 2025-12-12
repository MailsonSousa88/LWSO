// src/lapecWarsWTS/main.ts
import { Worker } from "worker_threads";
import path from "path";

type Professor = {
  name: string;
  hp: number;
  maxHp: number;
  min: number;
  max: number;
};

const professors: Professor[] = [
  { name: "Mayllon", hp: 100, maxHp: 100, min: 6, max: 12 },
  { name: "Maykol", hp: 95, maxHp: 95, min: 5, max: 13 },
  { name: "Jivago", hp: 110, maxHp: 110, min: 4, max: 15 },
  { name: "Sekeff", hp: 90, maxHp: 90, min: 3, max: 18 },
  { name: "Jeferson", hp: 105, maxHp: 105, min: 7, max: 11 },
  { name: "Wanderson", hp: 98, maxHp: 98, min: 2, max: 20 },
  { name: "Iallen", hp: 102, maxHp: 102, min: 4, max: 10 },
];

const workers = new Map<string, Worker>();
let running = true;

function aliveProfessors() {
  return professors.filter((p) => p.hp > 0);
}

function getProf(name: string) {
  return professors.find((p) => p.name === name)!;
}

function randEnemy(attacker: string) {
  const alive = aliveProfessors().filter((p) => p.name !== attacker);
  if (alive.length === 0) return null;
  return alive[Math.floor(Math.random() * alive.length)];
}

function showStatus() {
  console.log("\n===== STATUS =====");
  professors.forEach((p) => {
    console.log(
      `${p.name.padEnd(10)} | HP: ${String(p.hp).padStart(3)}/${p.maxHp}`
    );
  });
  console.log("==================\n");
}

function declareWinner(name: string) {
  console.log("\n=========================");
  console.log(`🏆 VENCEDOR: ${name} 🏆`);
  console.log("=========================\n");
  running = false;

  for (const w of workers.values()) w.terminate();
  process.exit(0);
}

// =====================
//      CREATE WORKERS
// =====================
console.log("🔥 Iniciando LapeCWars com Worker Threads!\n");

for (const prof of professors) {
  const worker = new Worker(
    path.resolve(__dirname, "professorWorker.ts"), // ts-node transpila on-the-fly
    {
      workerData: prof,
      execArgv: ["-r", "ts-node/register"]
    }
  );

  worker.on("message", (msg) => {
    if (!running) return;

    if (msg.type === "attack") {
      const attacker = msg.attacker;
      const damage = msg.damage;

      const target = randEnemy(attacker);
      if (!target) {
        declareWinner(attacker);
        return;
      }

      target.hp = Math.max(0, target.hp - damage);

      console.log(
        `> ${attacker} atacou ${target.name} causando ${damage} de dano!`
      );

      if (target.hp === 0) {
        console.log(`💥 ${target.name} foi derrotado por ${attacker}!`);
      }

      showStatus();

      const vivos = aliveProfessors();
      if (vivos.length === 1) {
        declareWinner(vivos[0].name);
      }
    }
  });

  workers.set(prof.name, worker);
}

process.on("SIGINT", () => {
  console.log("\nInterrompendo...");
  running = false;
  for (const w of workers.values()) w.terminate();
  process.exit(0);
});