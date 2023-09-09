const BOARD_ROW = 10;
const BOARD_COL = 10;
const MINE_COUNT = 20;
const $boardUl = document.querySelector("#mineBoard");
const mineBoard = getBoardArray(BOARD_ROW, BOARD_COL);
const SAFE_COUNT = BOARD_COL * BOARD_ROW - MINE_COUNT;
let gameState = 0;

let openedCount = 0;
window.oncontextmenu = function () {
  return false;
};

let IndexList = getIndexList(BOARD_ROW * BOARD_COL);

let randomIndexList = new Array();
for (let i = 0; i < MINE_COUNT; i++) {
  randomIndexList.push(getRandomIndex(IndexList));
}

setMineToBoard(randomIndexList, mineBoard, BOARD_COL);

for (let i = 0; i < mineBoard.length; i++) {
  for (let j = 0; j < mineBoard[0].length; j++) {
    checkMineForMakeBoard(i, j, mineBoard);
  }
}

insertLiToBoard(mineBoard);
$boardUl.style.width = BOARD_COL * 50 + "px";
$boardUl.style.height = BOARD_ROW * 50 + "px";
console.log();
document.documentElement.style.setProperty("--square-flex-width", 50 + "px");

const $$boardA = $boardUl.querySelectorAll("a");

$$boardA.forEach(($a, i) => {
  $a.addEventListener("click", (e) => {
    if ($a.classList.contains("guessMine")) return;
    $target = e.target;
    if ($target.querySelector("span").classList.contains("clicked")) return;
    let row = 0;
    let col = i;
    if (i > BOARD_COL) {
      row = Math.floor(i / BOARD_COL);
      col = i % BOARD_COL;
    }
    $span = $target.querySelector("span");
    if ($span.value === -1) {
      $span.textContent = $span.value;
      $span.classList.add("clicked");
      openedCount++;
      gameEnd();
    } else {
      OpenEmpty($$boardA, row, col);
      $span.textContent = $span.value === 0 ? "" : $span.value;
      $span.classList.add("clicked");
    }

    if (openedCount === SAFE_COUNT) {
      win();
    }
  });
});

$$boardA.forEach(($a) => {
  $a.addEventListener("contextmenu", (e) => {
    if (e.target.classList.contains("guessMine")) {
      e.target.classList.remove("guessMine");
    } else {
      e.target.classList.add("guessMine");
    }
  });
});





// function
function gameEnd() {
  if (gameState === 0) {
    $boardUl.style.pointerEvents = "none";
    console.log("you failed.");
    gameState = 2;
  }
}

function win() {
  if (gameState === 0) {
    $boardUl.style.pointerEvents = "none";
    console.log("you win.");
    gameState = 1;
  }
}

function OpenEmpty($$boardA, row, col) {
  let $tag = $$boardA[row * BOARD_COL + col].querySelector("span");
  if ($tag.classList.contains("clicked")) return;

  if ($tag.value === -1) {
    return;
  } else {
    let rowFirst = row - 1 < 0 ? 0 : row - 1;
    let rowLast = row + 1 > BOARD_ROW - 1 ? BOARD_ROW - 1 : row + 1;
    let colFirst = col - 1 < 0 ? 0 : col - 1;
    let colLast = col + 1 > BOARD_COL - 1 ? BOARD_COL - 1 : col + 1;

    if ($tag.value !== 0) {
      $tag.textContent = $tag.value;
      $tag.classList.add("clicked");
      openedCount++;
    } else {
      $tag.classList.add("clicked");
      openedCount++;
      OpenEmpty($$boardA, rowFirst, col);
      OpenEmpty($$boardA, rowFirst, colFirst);
      OpenEmpty($$boardA, rowLast, colLast);

      OpenEmpty($$boardA, row, colFirst);
      OpenEmpty($$boardA, row, colLast);

      OpenEmpty($$boardA, rowLast, colFirst);
      OpenEmpty($$boardA, rowLast, col);
      OpenEmpty($$boardA, rowLast, colLast);
    }
  }

  return;
}

function getBoardArray(row, col) {
  let arrays = new Array();
  for (let i = 0; i < row; i++) {
    arrays.push(new Array());
    for (let j = 0; j < col; j++) {
      arrays[i][j] = 0;
    }
  }
  return arrays;
}

function getIndexList(boardTotalCount) {
  const array = new Array(boardTotalCount);
  for (let i = 0; i < boardTotalCount; i++) {
    array[i] = i;
  }
  return array;
}

function getRandomIndex(array) {
  let randomNumber = getRandomNumber(0, array.length - 1);
  let randomIndex = array[randomNumber];

  array.splice(randomNumber, 1);
  return randomIndex;
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setMineToBoard(randomIndexArray, board, colCount) {
  for (randomIdx of randomIndexArray) {
    let row = 0;
    let col = randomIdx;
    if (randomIdx > colCount) {
      row = Math.floor(randomIdx / colCount);
      col = randomIdx % colCount;
    }
    board[row][col] = -1;
  }
}

function checkMineForMakeBoard(row, col, board) {
  if (board[row][col] === -1) return;
  let rowFirst = row - 1 < 0 ? 0 : row - 1;
  let rowLast = row + 1 > BOARD_ROW - 1 ? BOARD_ROW - 1 : row + 1;
  let colFirst = col - 1 < 0 ? 0 : col - 1;
  let colLast = col + 1 > BOARD_COL - 1 ? BOARD_COL - 1 : col + 1;

  let mineCount = 0;
  for (let i = rowFirst; i <= rowLast; i++) {
    for (let j = colFirst; j <= colLast; j++) {
      if (board[i][j] !== 0 && board[i][j] === -1) {
        mineCount++;
      }
    }
  }

  board[row][col] = mineCount;
}

function insertLiToBoard(board) {
  for (let i = 0; i < BOARD_ROW; i++) {
    for (let j = 0; j < BOARD_COL; j++) {
      let $li = createTag("li", null);
      let $a = createTag("a", null);
      let $span = createTag("span", null);
      $span.value = board[i][j];
      $a.setAttribute("href", "#");
      $a.appendChild($span);
      $li.appendChild($a);
      $boardUl.appendChild($li);
    }
  }
}

function createTag(tagName, content) {
  $tag = document.createElement(tagName);
  $tag.textContent = content;
  return $tag;
}
