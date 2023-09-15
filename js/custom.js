// ----------- Main -------------
const BOARD_ROW = 10;
const BOARD_COL = 10;
const MINE_COUNT = 20;
const $boardUl = document.querySelector("#mineBoard");
const mineBoard = getBoardArray(BOARD_ROW, BOARD_COL);
const SAFE_COUNT = BOARD_COL * BOARD_ROW - MINE_COUNT;

// setMineToBoard만 해놨다가, 게임시작클릭 시에만 mine인지 검사하고,
// mine이면 옆으로 옮기고, mineBoard, mineIndexList도 옮기고,
// 그 후 value 계산 checkMineForMakeBoard(); 이걸 나중에 씀.

let gameState = 0;
let openedCount = 0;
let isStartgameClick = true;

let sec = 40;

let IndexList = getIndexList(BOARD_ROW * BOARD_COL);
let mineIndexList = new Array();
window.oncontextmenu = function () {
  return false;
};


initGame();


const $$boardA = $boardUl.querySelectorAll("a");
const $$boardSpan = $boardUl.querySelectorAll("span");


$$boardA.forEach(($a, i) => {
  $a.addEventListener("click", (e) => {
    if ($a.classList.contains("guessMine")) return;

    if(isStartgameClick){
      $span = e.target.querySelector("span");
      console.log($span);
      if($span.value === -1){
        let row = getRowFromIndex(i);
        let col = getColFromIndex(i);
        
        $span.value = 0;
        mineBoard[row][col] = 0;

        let clickedMineIndex = mineIndexList.indexOf(i);
        mineIndexList.splice(clickedMineIndex, 1);
    
        let newMineIndex = getRandomIndex(IndexList);
        mineIndexList.push(newMineIndex);
        let newMineRow = getRowFromIndex(newMineIndex);
        let newMineCol = getColFromIndex(newMineIndex);
        mineBoard[newMineRow][newMineCol] = -1;

        console.log(mineIndexList.sort());
      }
      for (let i = 0; i < mineBoard.length; i++) {
        for (let j = 0; j < mineBoard[0].length; j++) {
          checkMineForMakeBoard(i, j, mineBoard);
        }
      }

      boardToView();

      isStartgameClick = false;
    }

    
    $target = e.target;
    if ($target.querySelector("span").classList.contains("clicked")) return;
    let row = 0;
    let col = i;

    row = getRowFromIndex(i);
    col = getColFromIndex(i);
    
    $span = $target.querySelector("span");
    if ($span.value === -1) {
      $span.textContent = "😅";
      $span.classList.add("clicked");
      openedCount++;
      lose();
    } else {
      OpenEmpty($$boardSpan, row, col, true);
      $span.textContent = $span.value === 0 ? "" : $span.value;
      $span.classList.add("clicked");
      $span.style.color = getNumberColor($span.value);
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

// -------------- function -------------
function lose() {
  if (gameState === 0) {
    gameState = 2;
    $boardUl.style.pointerEvents = "none";
    console.log("you failed.");

    for (let i of mineIndexList) {
      $$boardSpan[i].textContent = "😅";
      $$boardSpan[i].classList.add('clicked');
    }
  }
}

function win() {
  if (gameState === 0) {
    $boardUl.style.pointerEvents = "none";
    console.log("you win.");
    gameState = 1;
  }
}

function OpenEmpty($$spans, row, col, firstClick) { //firstClick만 OpenEmpty 재귀하게.
  let $tag = $$spans[row * BOARD_COL + col];
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
      $tag.style.color = getNumberColor($tag.value);
      openedCount++;
      if(firstClick){
        firstClick = false;
        OpenEmpty($$spans, rowFirst, colFirst, firstClick);
        OpenEmpty($$spans, rowFirst, col, firstClick);
        OpenEmpty($$spans, rowFirst, colLast, firstClick);
  
        OpenEmpty($$spans, row, colFirst, firstClick);
        OpenEmpty($$spans, row, colLast, firstClick);
  
        OpenEmpty($$spans, rowLast, colFirst, firstClick);
        OpenEmpty($$spans, rowLast, col, firstClick);
        OpenEmpty($$spans, rowLast, colLast, firstClick);
      }
    } else {
      firstClick = false;
      $tag.classList.add("clicked");
      $tag.style.color = getNumberColor($tag.value);
      openedCount++;

      OpenEmpty($$spans, rowFirst, colFirst, firstClick);
      OpenEmpty($$spans, rowFirst, col, firstClick);
      OpenEmpty($$spans, rowFirst, colLast, firstClick);

      OpenEmpty($$spans, row, colFirst, firstClick);
      OpenEmpty($$spans, row, colLast, firstClick);

      OpenEmpty($$spans, rowLast, colFirst, firstClick);
      OpenEmpty($$spans, rowLast, col, firstClick);
      OpenEmpty($$spans, rowLast, colLast, firstClick);
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

function boardToView(){
  let spanIdx = 0;
  for(let i = 0; i < BOARD_ROW; i++){
    for(let j = 0; j < BOARD_COL; j++){
      // (i*BOARD_ROW) + j 이게 문제. 홀수 row를 건너뜀
      $$boardSpan[spanIdx++].value = mineBoard[i][j];
    }
  }
}

function insertLiToBoard(board) {
  for (let i = 0; i < BOARD_ROW; i++) {
    for (let j = 0; j < BOARD_COL; j++) {
      let $li = createTag("li", null);
      let $a = createTag("a", null);
      let $span = createTag("span", null);
      if(board[i][j] === -1){
        $span.value = board[i][j];
      }
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

function getNumberColor(num) {
  let color;
  switch (num) {
    case 1:
      color = "blue";
      break;
    case 2:
      color = "green";
      break;
    case 3:
      color = "red";
      break;
    case 4:
      color = "purple";
      break;
    case 5:
      color = "brown";
      break;
    case 6:
      color = "yellow";
      break;
    case 7:
      color = "black";
      break;
    case 8:
      color = "gray";
      break;

    default:
      color = "";
      break;
  }
  return color;
}


function getRowFromIndex(idx) {
  return Math.floor(idx / BOARD_COL);
}
function getColFromIndex(idx) {
  return idx % BOARD_COL;
}

function getValueFromRC(row, col) {
  return mineBoard[row][col];
}


function initGame(){
  for (let i = 0; i < MINE_COUNT; i++) {
    mineIndexList.push(getRandomIndex(IndexList));
  }
  setMineToBoard(mineIndexList, mineBoard, BOARD_COL);
  
  
  insertLiToBoard(mineBoard);
  $boardUl.style.width = BOARD_COL * 50 + "px";
  $boardUl.style.height = BOARD_ROW * 50 + "px";
  console.log();
  document.documentElement.style.setProperty("--square-flex-width", 50 + "px");
}


function initFirstClick(){
  $span = e.target.querySelector("span");
  if($span.value === -1){
    let row = getRowFromIndex(i);
    let col = getColFromIndex(i);
    
    $span.value = 0;
    mineBoard[row][col] = 0;
    // mineIndexList에서 클릭한 것의 i, 값을 찾아서 지우기.
    let clickedMineIndex = mineIndexList.findIndex(i);
    mineIndexList.splice(clickedMineIndex, 1);

    let newMineIndex = getRandomIndex(IndexList);
    mineIndexList.push(newMineIndex);
    let newMineRow = getRowFromIndex(newMineIndex);
    let newMineCol = getColFromIndex(newMineIndex);
    mineBoard[newMineRow][newMineCol] = -1;

    $$boardSpan[newMineIndex].value = -1;
  }
  isStartgameClick = false;
}


function setAllvalueToBoard(){
  for (let i = 0; i < mineBoard.length; i++) {
    for (let j = 0; j < mineBoard[0].length; j++) {
      checkMineForMakeBoard(i, j, mineBoard);
    }
  }
}