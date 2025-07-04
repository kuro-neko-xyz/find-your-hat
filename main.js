const prompt = require("prompt-sync")({ sigint: true });

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
  #depth;
  #width;
  #field;
  #playerCoordinates;

  constructor(field, playerCoordinates = { row: 0, col: 0 }) {
    if (!Array.isArray(field) || !field.every((row) => Array.isArray(row))) {
      throw new Error("Field must be a 2D array");
    }

    this.#depth = field.length;
    this.#width = field[0].length;

    if (field.some((row) => row.length !== this.#width)) {
      throw new Error("All rows in the field must have the same length");
    }

    this.#field = field;
    this.#playerCoordinates = playerCoordinates;
  }

  static generateField(depth, width, holesCount) {
    if (holesCount > depth * width - 2) {
      throw new Error("Too many holes for the given field size");
    }

    const matrix = Array.from({ length: depth }, () =>
      Array(width).fill(fieldCharacter)
    );

    let addedHoles = 0;
    while (addedHoles < holesCount) {
      const row = Math.floor(Math.random() * depth);
      const col = Math.floor(Math.random() * width);

      if (matrix[row][col] === fieldCharacter) {
        matrix[row][col] = hole;
        addedHoles++;
      }
    }

    let isHatPlaced = false;
    while (!isHatPlaced) {
      const row = Math.floor(Math.random() * depth);
      const col = Math.floor(Math.random() * width);

      if (matrix[row][col] === fieldCharacter) {
        matrix[row][col] = hat;
        isHatPlaced = true;
      }
    }

    let isPlayerSpawned = false;
    let playerCoordinates = { row: 0, col: 0 };
    while (!isPlayerSpawned) {
      const row = Math.floor(Math.random() * depth);
      const col = Math.floor(Math.random() * width);

      if (matrix[row][col] === fieldCharacter) {
        matrix[row][col] = pathCharacter;
        isPlayerSpawned = true;
        playerCoordinates = { row, col };
      }
    }

    const field = new Field(matrix, playerCoordinates);

    return field;
  }

  #calculateNewPosition(playerCoordinates, key) {
    const newPosition = { ...playerCoordinates };

    switch (key) {
      case "w":
        newPosition.row = Math.max(0, playerCoordinates.row - 1);
        break;
      case "s":
        newPosition.row = Math.min(this.#depth - 1, playerCoordinates.row + 1);
        break;
      case "a":
        newPosition.col = Math.max(0, playerCoordinates.col - 1);
        break;
      case "d":
        newPosition.col = Math.min(this.#width - 1, playerCoordinates.col + 1);
        break;
      default:
        console.log("Invalid move. Use w/a/s/d to move.");
        return playerCoordinates;
    }

    return newPosition;
  }

  print() {
    for (let row of this.#field) {
      console.log(row.join(""));
    }
  }

  handleMove(key) {
    const newPosition = this.#calculateNewPosition(
      this.#playerCoordinates,
      key
    );

    switch (this.#field[newPosition.row][newPosition.col]) {
      case hole:
        console.log("You fell into a hole! Game over.");
        process.exit();
      case hat:
        console.log("Congratulations! You found the hat!");
        process.exit();
      default:
        this.#field[newPosition.row][newPosition.col] = pathCharacter;
        this.#playerCoordinates = newPosition;
    }
  }
}

const myField = Field.generateField(10, 10, 15);

while (true) {
  console.clear();
  myField.print();
  const input = prompt("Enter your move (w/a/s/d): ").toLowerCase();
  myField.handleMove(input);
}
