const arrContains = (arr, elt) => {
  for (let i of arr) {
    if (JSON.stringify(i) === JSON.stringify(elt)) {
      return true;
    }
  }
  return false;
};

const arrRemove = (arr, elt) => {
  for (let i = 0; i < arr.length; i++) {
    if (JSON.stringify(arr[i]) === JSON.stringify(elt)) {
      arr.splice(i, 1);
    }
  }
};

const arrAdd = (arr, elt) => {
  for (let i = 0; i < arr.length; i++) {
    if (JSON.stringify(arr[i]) === JSON.stringify(elt)) {
      return;
    }
  }
  arr.unshift(elt);
};

class Sentence {
  constructor(cells, count) {
    this.cells = cells;
    this.count = count;
  }

  known_mines() {
    if (this.cells.length === this.count) return this.cells;
    return [];
  }
  known_safes() {
    if (this.count === 0) return this.cells;
    return [];
  }
  mark_mine(cell) {
    if (arrContains(this.cells, cell)) {
      arrRemove(this.cells, cell);
      this.count--;
    }
  }
  mark_safe(cell) {
    if (arrContains(this.cells, cell)) {
      arrRemove(this.cells, cell);
    }
  }
}

class AI {
  constructor(height = 20, width = 20) {
    this.height = height;
    this.width = width;
    this.moves_made = new Array();
    this.mines = new Array();
    this.safes = new Array();
    this.knowledge = new Array();
  }

  mark_mine(cell) {
    arrAdd(this.mines, cell);
    for (let sentence of this.knowledge) {
      sentence.mark_mine(cell);
    }
  }
  mark_safe(cell) {
    arrAdd(this.safes, cell);
    for (let sentence of this.knowledge) {
      sentence.mark_safe(cell);
    }
  }
  isValidMove(cell) {
    let [y, x] = cell;
    return y >= 0 && y < this.height && x >= 0 && x < this.width;
  }

  addKnowledge(cell, count) {
    this.mark_safe(cell);
    arrAdd(this.moves_made, cell);

    let [y, x] = cell;
    let cells = new Array();
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        let [y1, x1] = [y + i, x + j];
        if (
          this.isValidMove([y1, x1]) &&
          arrContains(this.moves_made, [y1, x1])
        ) {
          cells.push([y1, x1]);
        }
      }
    }
    let sentence = new Sentence(cells, count);
    arrAdd(this.knowledge, sentence);

    for (let sentence of this.knowledge) {
      for (let mine of sentence.known_mines()) {
        arrAdd(this.mines, mine);
      }
      for (let safes of sentence.known_safes()) {
        arrAdd(this.safes, safes);
      }
    }
    for (let sentence of this.knowledge) {
      for (let another of this.knowledge) {
        if (deepCompare(sentence, another)) continue;
      }
    }
  }
}

//write a function to check if an array is a subset of another array
function isSubset(arr1, arr2) {
  for (let i of arr1) {
    if (!arrContains(arr2, i)) {
      return false;
    }
  }
  return true;
}

function deepCompare(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== "object" || typeof obj2 !== "object") return false;
  if (obj1 === null || obj2 === null) return false;
  if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
  for (var p in obj1) {
    if (!obj2.hasOwnProperty(p)) return false;
    if (obj2[p] === obj1[p]) continue;
    if (typeof obj2[p] !== "object") return false;
    if (!deepCompare(obj1[p], obj2[p])) return false;
  }
  return true;
}
