const COLS = 17;
const ROWS = 10;
const TIME_LIMIT = 120; // 2 minutes

const board = document.getElementById('board');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const gameOverModal = document.getElementById('game-over-modal');
const finalScoreEl = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

let cells = [];
let score = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let isPlaying = false;
let selectedCells = [];

function initBoard() {
    board.innerHTML = '';
    cells = [];
    
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cellDiv = createCell(r, c);
            board.appendChild(cellDiv);
            cells.push(cellDiv);
        }
    }
}

function createCell(row, col) {
    const cellVal = Math.floor(Math.random() * 9) + 1;
    const cellDiv = document.createElement('div');
    cellDiv.className = 'cell';
    cellDiv.innerHTML = `🍎<span class="number">${cellVal}</span>`;
    cellDiv.dataset.row = row;
    cellDiv.dataset.col = col;
    cellDiv.dataset.val = cellVal;
    
    // Add click event for the cell
    cellDiv.addEventListener('click', () => handleCellClick(cellDiv));
    
    return cellDiv;
}

function handleCellClick(cell) {
    if (!isPlaying) return;
    if (cell.classList.contains('popped')) return; // Ignore if it's currently popping/refilling

    // Toggle selection
    if (cell.classList.contains('highlight')) {
        cell.classList.remove('highlight');
        selectedCells = selectedCells.filter(c => c !== cell);
    } else {
        cell.classList.add('highlight');
        selectedCells.push(cell);
    }

    checkSum();
}

function checkSum() {
    let sum = 0;
    selectedCells.forEach(cell => {
        sum += parseInt(cell.dataset.val);
    });

    if (sum === 10) {
        removeAndRefillCells();
    } else if (sum > 10) {
        // If sum exceeds 10, clear selection to give immediate feedback
        selectedCells.forEach(cell => cell.classList.remove('highlight'));
        selectedCells = [];
    }
}

function removeAndRefillCells() {
    let cellsRemoved = selectedCells.length;
    score += cellsRemoved * 10;
    scoreEl.textContent = score;
    
    if (cellsRemoved > 0) {
        // Find center of first cell for floating text
        const firstCell = selectedCells[0];
        const floatText = document.createElement('div');
        floatText.className = 'floating-score';
        floatText.textContent = `+${cellsRemoved * 10}`;
        floatText.style.left = firstCell.offsetLeft + 'px';
        floatText.style.top = firstCell.offsetTop + 'px';
        board.appendChild(floatText);
        setTimeout(() => floatText.remove(), 1000);
    }
    
    const cellsToRefill = [...selectedCells]; // Copy the array
    selectedCells = []; // Reset selected state

    // Trigger pop (disappear) animation
    cellsToRefill.forEach(cell => {
        cell.classList.remove('highlight');
        cell.classList.add('popped');
    });

    // Wait for the disappear animation (0.3s in CSS), then refill
    setTimeout(() => {
        cellsToRefill.forEach(cell => {
            const newVal = Math.floor(Math.random() * 9) + 1;
            cell.dataset.val = newVal;
            cell.querySelector('.number').textContent = newVal;
            // Removing 'popped' triggers the appear animation
            cell.classList.remove('popped');
        });
    }, 300);
}

function updateTimerDisplay() {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    timerEl.textContent = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function startGame() {
    initBoard();
    score = 0;
    scoreEl.textContent = '0';
    timeLeft = TIME_LIMIT;
    selectedCells = [];
    updateTimerDisplay();
    isPlaying = true;
    
    board.classList.remove('blur');
    startBtn.style.display = 'none';
    gameOverModal.classList.add('hidden');
    
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    isPlaying = false;
    clearInterval(timerInterval);
    board.classList.add('blur');
    finalScoreEl.textContent = score;
    gameOverModal.classList.remove('hidden');
    startBtn.style.display = 'block';
    startBtn.textContent = 'Restart';
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// Initialize initial layout without starting the timer
initBoard();
