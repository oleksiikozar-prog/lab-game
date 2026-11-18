const readline = require("node:readline/promises");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Завдання 1: Створення персонажа (змінні та типи даних)
let playerName = "";
let playerHealth = 100;
let playerAttack = 25;
let playerGold = 0;
let isAlive = true;

// Завдання 2: Функція інформації про персонажа
function showPlayerInfo() {
  console.log("\n--- СТАТУС ПЕРСОНАЖА ---");
  console.log(`Ім'я: ${playerName}`);
  console.log(`Здоров'я: ${playerHealth}`);
  console.log(`Сила атаки: ${playerAttack}`);
  console.log(`Золото: ${playerGold}`);
  console.log("-------------------------\n");
}

// Завдання 5: Бій із монстром (функція, цикл while, розгалуження)
async function fightMonster() {
  console.log("\n⚠️ Увага! Починається бій із монстром!");
  let monsterHealth = 60;
  const monsterDamage = 10;

  // Цикл while триває, доки живі і гравець, і монстр
  while (monsterHealth > 0 && playerHealth > 0) {
    // 1. Гравець атакує монстра
    monsterHealth -= playerAttack;
    console.log(`Ви вдарили монстра і завдали ${playerAttack} шкоди.`);

    // 2. Перевіряємо, чи живий монстр
    if (monsterHealth > 0) {
      // 3. Монстр атакує у відповідь
      playerHealth -= monsterDamage;
      console.log(`Монстр контратакує і завдає вам ${monsterDamage} шкоди.`);
    } else {
      console.log("🎉 Ви перемогли монстра!");
      playerGold += 30;
    }

    // Виведення поточного стану після кожного раунду
    console.log(
      `[Здоров'я гравця: ${playerHealth}] | [Здоров'я монстра: ${Math.max(0, monsterHealth)}]\n`,
    );
  }
}

// Завдання 6: Перевірка результату гри
function checkGameResult(hasCompletedRooms) {
  console.log("\n======================");
  console.log("   РЕЗУЛЬТАТИ ГРИ     ");
  console.log("======================");

  if (playerHealth > 0 && hasCompletedRooms) {
    console.log(
      `🏆 Вітаємо, ${playerName}! Ви успішно пройшли всі кімнати та перемогли!`,
    );
  } else {
    console.log(
      `💀 На жаль, ${playerName}, ваш герой загинув у підземеллі...`,
    );
  }

  console.log(`💰 Всього зібрано золота: ${playerGold}`);
  console.log("======================");
}

async function main() {
  // Введення імені через консоль
  playerName = await rl.question("Введіть ім'я героя: ");

  console.log(`\nВітаємо, ${playerName}!`);
  console.log("Ваша пригода починається!\n");

  showPlayerInfo();

  // Завдання 3: Масив із трьох кімнат
  const rooms = ["Темний коридор", "Кімната монстра", "Скарбниця"];
  let hasCompletedAllRooms = true;

  // Проходження кімнат за допомогою циклу for
  for (let i = 0; i < rooms.length; i++) {
    const roomNumber = i + 1;
    const roomName = rooms[i];

    console.log(`\n🚪 Ви підходите до кімнати ${roomNumber}: "${roomName}"`);
    await rl.question("Натисніть Enter, щоб увійти...");

    // Завдання 4: Події в кімнатах залежно від номера (switch або if-else)
    switch (roomNumber) {
      case 1:
        console.log("💥 Подія: Гравець знаходить приховану пастку!");
        playerHealth -= 15;
        console.log("Ви втратили 15 одиниць здоров'я.");
        break;

      case 2:
        console.log("⚔️ Подія: Зустріч із лютим монстром!");
        await fightMonster();
        break;

      case 3:
        console.log("💎 Подія: Ви знайшли стародавню скарбницю!");
        playerGold += 100;
        console.log("Ви отримали 100 золота!");
        break;

      default:
        console.log("Нічого особливого у цій кімнаті немає.");
        break;
    }

    showPlayerInfo();

    // Логічний оператор: перевірка чи живий гравець після події
    if (playerHealth <= 0) {
      isAlive = false;
      hasCompletedAllRooms = false;
      break;
    }
  }

  // Фінальна перевірка результатів гри
  checkGameResult(hasCompletedAllRooms);
}

main().finally(() => rl.close());
