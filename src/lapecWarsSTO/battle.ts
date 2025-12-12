
type Professor = {
  name: string;
  hp: number;
  maxHp: number;
  min: number;
  max: number;
};

function leftPad(str: string, length: number): string {
  while (str.length < length) str = " " + str;
  return str;
}

function rightPad(str: string, length: number): string {
  while (str.length < length) str = str + " ";
  return str;
}

const professors: Professor[] = [
  { name: "Mayllon", hp: 100, maxHp: 100, min: 6, max: 12 },
  { name: "Maykol", hp: 95, maxHp: 95, min: 5, max: 13 },
  { name: "Jivago", hp: 110, maxHp: 110, min: 4, max: 15 },
  { name: "Sekeff", hp: 90, maxHp: 90, min: 3, max: 18 },
  { name: "Jeferson", hp: 105, maxHp: 105, min: 7, max: 11 },
  { name: "Wanderson", hp: 98, maxHp: 98, min: 2, max: 20 },
  { name: "Iallen", hp: 102, maxHp: 102, min: 4, max: 10 },
];

const timers = new Map<string, NodeJS.Timeout>();
let running = true;

function randInt(a: number, b: number): number {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

function showStatus() {
  console.log("\n===== STATUS =====");
  for (const p of professors) {
    const alive = p.hp > 0;

    const barLen = 20;
    const filled = Math.round((Math.max(0, p.hp) / p.maxHp) * barLen);

    const bar =
      new Array(filled + 1).join("█") +
      new Array(barLen - filled + 1).join(" ");

    console.log(
      rightPad(p.name, 10) +
        " | HP: " +
        leftPad(String(p.hp), 3) +
        "/" +
        p.maxHp +
        " | [" +
        bar +
        "] " +
        (alive ? "" : "(DERROTADO)")
    );
  }
  console.log("==================\n");
}

function aliveProfessors(): Professor[] {
  return professors.filter((p) => p.hp > 0);
}

function getProf(name: string): Professor {
  return professors.find((p) => p.name === name)!;
}

function stopAllTimers() {
  for (const t of timers.values()) clearTimeout(t);
  timers.clear();
  running = false;
}

function scheduleAction(prof: Professor) {
  if (!running || prof.hp <= 0) return;

  const delay = randInt(400, 1400);

  const timer = setTimeout(() => {
    if (!running || prof.hp <= 0) return;
    handleAttack(prof.name);
    scheduleAction(prof);
  }, delay);

  timers.set(prof.name, timer);
}

function handleAttack(attackerName: string) {
  const attacker = getProf(attackerName);
  if (!attacker || attacker.hp <= 0) return;

  const enemies = aliveProfessors().filter((p) => p.name !== attackerName);

  if (enemies.length === 0) {
    declareWinner(attackerName);
    return;
  }

  const target =
    enemies[randInt(0, enemies.length - 1)];

  const damage = randInt(attacker.min, attacker.max);

  target.hp = Math.max(0, target.hp - damage);

  console.log(
    `> ${attacker.name} atacou ${target.name} causando ${damage} de dano!`
  );

  if (target.hp === 0) {
    console.log(`💥 ${target.name} foi derrotado por ${attacker.name}!`);
  }

  showStatus();

  const alive = aliveProfessors();

  if (alive.length === 1) {
    declareWinner(alive[0].name);
  }
}

function declareWinner(name: string) {
  console.log("\n=========================");
  console.log(`🏆 VENCEDOR: ${name} 🏆`);
  console.log("=========================\n");
  stopAllTimers();
  process.exit(0);
}

// ===== INICIAR =====
console.log("🔥 Iniciando luta com TS-NODE!");
showStatus();

for (const p of professors) scheduleAction(p);

process.on("SIGINT", () => {
  console.log("\nInterrompendo...");
  stopAllTimers();
  process.exit(0);
});