const prompt = require("prompt-sync")({ sigint: true });

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
  constructor(field) {
    if (!Array.isArray(field) || !field.every((row) => Array.isArray(row))) {
      throw new Error("Field must be a 2D array");
    }

    this.depth = field.length;
    this.width = field[0].length;

    if (field.some((row) => row.length !== this.width)) {
      throw new Error("All rows in the field must have the same length");
    }

    this.field = field;
  }

  print() {
    for (let row of this.field) {
      console.log(row.join(""));
    }
  }
}

const myField = new Field([
  ["*", "░", "O"],
  ["░", "O", "░"],
  ["░", "^", "░"],
]);

while (true) {
  myField.print();
  const input = prompt("Enter your move (w/a/s/d): ").toLowerCase();

  switch (input) {
    case "w":
      console.log("You moved up.");
      break;
    case "a":
      console.log("You moved left.");
      break;
    case "s":
      console.log("You moved down.");
      break;
    case "d":
      console.log("You moved right.");
      break;
    default:
      console.log("Invalid input. Please use w/a/s/d to move.");
      break;
  }
}
