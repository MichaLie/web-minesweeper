const GRID_SIZE = 10;
const MINE_COUNT = 10;

class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.mine = false;
        this.adjacentMines = 0;
        this.revealed = false;
        this.flagged = false;
    }
}

function generateMines(grid, mineCount) {
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
        const row = Math.floor(Math.random() * GRID_SIZE);
        const col = Math.floor(Math.random() * GRID_SIZE);
        const cell = grid[row][col];
        if (!cell.mine) {
            cell.mine = true;
            minesPlaced++;
        }
    }
}

function countAdjacentMines(grid, row, col) {
    let count = 0;
    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            const newRow = row + r;
            const newCol = col + c;
            if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
                const cell = grid[newRow][newCol];
                if (cell.mine) {
                    count++;
                }
            }
        }
    }
    return count;
}

function startGame() {
    const grid = createGrid();
    generateMines(grid, MINE_COUNT);

    for (const row of grid) {
        for (const cell of row) {
            cell.adjacentMines = countAdjacentMines(grid, cell.row, cell.col);
        }
    }

    renderGame(grid); // Add this line back
}

function renderGame(grid) {
    const container = document.getElementById("grid-container");
    container.innerHTML = "";

    for (const row of grid) {
        for (const cell of row) {
            const element = document.createElement("div");
            element.classList.add("cell");
            element.addEventListener("click", () => handleCellClick(grid, cell));
            element.addEventListener("contextmenu", (event) => {
                event.preventDefault();
                handleCellRightClick(cell);
            });
            container.appendChild(element);
            cell.element = element;
        }
    }
}

function floodFill(grid, row, col) {
    if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return;

    const cell = grid[row][col];
    if (cell.revealed || cell.mine) return;

    cell.revealed = true;
    cell.element.textContent = cell.adjacentMines || "";
    cell.element.style.backgroundColor = "#ddd";

    if (cell.adjacentMines === 0) {
        for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
                floodFill(grid, row + r, col + c);
            }
        }
    }
}
function createGrid() {
    const grid = [];
    for (let row = 0; row < GRID_SIZE; row++) {
        const newRow = [];
        for (let col = 0; col < GRID_SIZE; col++) {
            newRow.push(new Cell(row, col));
        }
        grid.push(newRow);
    }
    return grid;
}



function handleCellClick(grid, cell) {
    if (cell.revealed) return;

    if (cell.mine) {
        alert("Game Over!");
        return;
    }

    floodFill(grid, cell.row, cell.col);
}

function startGame() {
    const grid = createGrid();
    generateMines(grid, MINE_COUNT);

    for (const row of grid) {
        for (const cell of row) {
            cell.adjacentMines = countAdjacentMines(grid, cell.row, cell.col);
        }
    }

function handleCellRightClick(cell) {
    if (cell.revealed) return;

    cell.flagged = !cell.flagged;
    cell.element.textContent = cell.flagged ? "🚩" : "";
}

startGame();

