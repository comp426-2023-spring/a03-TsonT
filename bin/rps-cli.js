#!/usr/bin/env node
import minimist from "../node_modules/minimist/index.js";

let argv = minimist(process.argv.slice(2));

let helpText = `Usage: node-rps [SHOT]
Play Rock Paper Scissors (RPS)

  -h, --help      display this help message and exit
  -r, --rules     display the rules and exit

Examples:
  node-rps        Return JSON with single player RPS result.
                  e.g. {"player":"rock"}
  node-rps rock   Return JSON with results for RPS played against a simulated opponent.
                  e.g {"player":"rock","opponent":"scissors","result":"win"}`;

let rulesText = `Rules for Rock Paper Scissors:

- Scissors CUTS Paper
- Paper COVERS Rock
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
      result.gameResult = gameResult;
      result.player = player1.shot;
      result.opponent = player2.shot;
    }
  } catch (e) {
    if (e instanceof RangeError) {
      result.player = AI.generateShot();
    } else {
      console.log(e);
    }
  }

  return result;
}

class GameMaker {
  static rockKey = {
    rock: "tie",
    paper: "lose",
    scissors: "win",
  };
  static paperKey = {
    rock: "win",
    paper: "tie",
    scissors: "lose",
  };
  static scissorsKey = {
    rock: "lose",
    paper: "win",
    scissors: "tie",
  };
  static key = {
    rock: this.rockKey,
    paper: this.paperKey,
    scissors: this.scissorsKey,
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
    } else if (!(player.shot in this.key)) {
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
    let randNum = Math.floor(Math.random() * 3);

    switch (randNum) {
      case 0:
        return "rock";
      case 1:
        return "paper";
      case 2:
        return "scissors";
    }
  }
}

console.log(rps(argv["_"][0]));

export { rps };
