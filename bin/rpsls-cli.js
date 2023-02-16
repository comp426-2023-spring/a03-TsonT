#!/usr/bin/env node

import minimist from "../node_modules/minimist/index.js";

let argv = minimist(process.argv.slice(2));

let helpText = `Usage: node-rpsls [SHOT]
Play the Lizard-Spock Expansion of Rock Paper Scissors (RPSLS)!

  -h, --help        display this help message and exit
  -r, --rules       display the rules and exit

Examples:
  node-rpsls        Return JSON with single player RPSLS result.
                    e.g. {"player":"rock"}
  node-rpsls rock   Return JSON with results for RPSLS played against a simulated opponent.
                    e.g {"player":"rock","opponent":"Spock","result":"lose"}`;

let rulesText = `Rules for the Lizard-Spock Espansion of Rock Paper Scissors:

- Scissors CUTS Paper
- Paper COVERS Rock
- Rock SMOOSHES Lizard
- Lizard POISONS Spock
- Spock SMASHES Scissors
- Scissors DECAPITATES Lizard
- Lizard EATS Paper
- Paper DISPROVES Spock
- Spock VAPORIZES Rock
- Rock CRUSHES Scissors`;

if (argv["h"] || argv["help"]) {
  console.log(helpText);
  process.exit(0);
}

if (argv["r"] || argv["rules"]) {
  console.log(rulesText);
  process.exit(0);
}

function rps(shot) {
  let result = new Object();

  try {
    let player1 = new Player(shot);
    let player2 = new AI();
    let gameResult = GameMaker.simulateGame(player1, player2);
    if (!gameResult) {
      console.log(helpText + "\n" + rulesText);
      process.exit();
    } else {
      result.player = player1.shot;
      result.opponent = player2.shot;
      result.result = gameResult;
    }
  } catch (e) {
    if (e instanceof RangeError) {
      result.player = AI.generateShot();
    } else {
      console.log(e);
    }
  }

  return JSON.stringify(result);
}

class GameMaker {
  static rockKey = {
    rock: "tie",
    paper: "lose",
    scissors: "win",
    lizard: "win",
    spock: "lose",
  };
  static paperKey = {
    rock: "win",
    paper: "tie",
    scissors: "lose",
    lizard: "lose",
    spock: "win",
  };
  static scissorsKey = {
    rock: "lose",
    paper: "win",
    scissors: "tie",
    lizard: "win",
    spock: "lose",
  };
  static lizardKey = {
    rock: "lose",
    paper: "win",
    scissors: "lose",
    lizard: "tie",
    spock: "win",
  };
  static spockKey = {
    rock: "win",
    paper: "lose",
    scissors: "win",
    lizard: "lose",
    spock: "tie",
  };
  static key = {
    rock: this.rockKey,
    paper: this.paperKey,
    scissors: this.scissorsKey,
    lizard: this.lizardKey,
    spock: this.spockKey,
  };

  static simulateGame(player1, player2) {
    if (this.validateShot(player1)) {
      return this.determineWinner(player1.shot, player2.shot);
    } else {
      return false;
    }
  }

  static determineWinner(shot1, shot2) {
    return this.key[shot1][shot2];
  }

  static validateShot(player) {
    if (!player.shot) {
      throw new RangeError("shot out of range");
    }

    player.shot = player.shot.toLowerCase();

    if (!(player.shot in this.key)) {
      return false;
    } else {
      return true;
    }
  }
}

class Player {
  constructor(shot) {
    this.shot = shot;
  }
}

class AI {
  constructor() {
    this.shot = AI.generateShot();
  }

  static generateShot() {
    let randNum = Math.floor(Math.random() * 5);

    switch (randNum) {
      case 0:
        return "rock";
      case 1:
        return "paper";
      case 2:
        return "scissors";
      case 3:
        return "lizard";
      case 4:
        return "spock";
    }
  }
}

console.log(rps(argv["_"][0]));

export { rps };
