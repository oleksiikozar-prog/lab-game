const readline = require("node:readline/promises");

class Character {
  #health;

  constructor(name, health, attackPower) {
    this.name = name;
    this.#health = health;
    this.attackPower = attackPower;
  }

  getHealth() {
    return this.#health;
  }

  isAlive() {
    return this.#health > 0;
  }

  takeDamage(amount) {
    const safeDamage = Math.max(0, amount);
    this.#health = Math.max(0, this.#health - safeDamage);
    return safeDamage;
  }

  showInfo() {
    console.log("\n--- СТАТУС ПЕРСОНАЖА ---");
    console.log(`Ім'я: ${this.name}`);
    console.log(`Здоров'я: ${this.#health}`);
    console.log(`Сила атаки: ${this.attackPower}`);
    console.log("-------------------------\n");
  }

  attack(target) {
    console.log(`${this.name} атакує ${target.name} і завдає ${this.attackPower} шкоди.`);
    target.takeDamage(this.attackPower);
  }
}

class Player extends Character {
  constructor(name, health = 100, attackPower = 25, gold = 0) {
    super(name, health, attackPower);
    this.gold = gold;
  }

  addGold(amount) {
    if (amount > 0) {
      this.gold += amount;
    }
  }

  showInfo() {
    console.log("\n--- СТАТУС ПЕРСОНАЖА ---");
    console.log(`Ім'я: ${this.name}`);
    console.log(`Здоров'я: ${this.getHealth()}`);
    console.log(`Сила атаки: ${this.attackPower}`);
    console.log(`Золото: ${this.gold}`);
    console.log("-------------------------\n");
  }

  // Поліморфізм: перевизначення методу attack
  attack(target) {
    console.log(`Ви вдарили ${target.name} і завдали ${this.attackPower} шкоди.`);
    target.takeDamage(this.attackPower);
  }
}

class Monster extends Character {
  constructor(name, health = 60, attackPower = 10, goldReward = 30) {
    super(name, health, attackPower);
    this.goldReward = goldReward;
  }

  // Поліморфізм: перевизначення методу attack
  attack(target) {
    console.log(`Монстр (${this.name}) контратакує і завдає вам ${this.attackPower} шкоди.`);
    target.takeDamage(this.attackPower);
  }
}

class Game {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.rooms = ["Темний коридор", "Кімната монстра", "Скарбниця"];
    this.player = null;
    this.hasCompletedAllRooms = true;
  }

  async fightMonster(monster) {
    console.log("\n⚠️ Увага! Починається бій із монстром!");

    while (monster.isAlive() && this.player.isAlive()) {
      // 1. Гравець атакує монстра
      this.player.attack(monster);

      // 2. Перевіряємо, чи живий монстр
      if (monster.isAlive()) {
        // 3. Монстр атакує у відповідь
        monster.attack(this.player);
      } else {
        console.log("🎉 Ви перемогли монстра!");
        this.player.addGold(monster.goldReward);
      }

      // Виведення поточного стану після кожного раунду
      console.log(
        `[Здоров'я гравця: ${this.player.getHealth()}] | [Здоров'я монстра: ${monster.getHealth()}]\n`
      );
    }
  }

  async handleRoomEvent(roomNumber) {
    switch (roomNumber) {
      case 1:
        console.log("💥 Подія: Гравець знаходить приховану пастку!");
        this.player.takeDamage(15);
        console.log("Ви втратили 15 одиниць здоров'я.");
        break;

      case 2: {
        console.log("⚔️ Подія: Зустріч із лютим монстром!");
        const monster = new Monster("Монстр", 60, 10, 30);
        await this.fightMonster(monster);
        break;
      }

      case 3:
        console.log("💎 Подія: Ви знайшли стародавню скарбницю!");
        this.player.addGold(100);
        console.log("Ви отримали 100 золота!");
        break;

      default:
        console.log("Нічого особливого у цій кімнаті немає.");
        break;
    }
  }

  checkGameResult() {
    console.log("\n======================");
    console.log("   РЕЗУЛЬТАТИ ГРИ     ");
    console.log("======================");

    if (this.player.isAlive() && this.hasCompletedAllRooms) {
      console.log(
        `🏆 Вітаємо, ${this.player.name}! Ви успішно пройшли всі кімнати та перемогли!`
      );
    } else {
      console.log(
        `💀 На жаль, ${this.player.name}, ваш герой загинув у підземеллі...`
      );
    }

    console.log(`💰 Всього зібрано золота: ${this.player.gold}`);
    console.log("======================");
  }

  async start() {
    try {
      const playerName = await this.rl.question("Введіть ім'я героя: ");
      this.player = new Player(playerName, 100, 25, 0);

      console.log(`\nВітаємо, ${this.player.name}!`);
      console.log("Ваша пригода починається!\n");

      this.player.showInfo();

      for (let i = 0; i < this.rooms.length; i++) {
        const roomNumber = i + 1;
        const roomName = this.rooms[i];

        console.log(`\n🚪 Ви підходите до кімнати ${roomNumber}: "${roomName}"`);
        await this.rl.question("Натисніть Enter, щоб увійти...");

        await this.handleRoomEvent(roomNumber);
        this.player.showInfo();

        if (!this.player.isAlive()) {
          this.hasCompletedAllRooms = false;
          break;
        }
      }

      this.checkGameResult();
    } finally {
      this.rl.close();
    }
  }
}

const game = new Game();
game.start();
