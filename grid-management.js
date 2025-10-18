import { state, elements } from './state.js';

export function createGrid() {
    console.log("Creating grid!");
    const gridSize = state.gridSize;

    // Adjust display size based on grid density
    if (gridSize <= 16) {
        state.canvasDisplaySize = 500;
    } else if (gridSize <= 64) {
        state.canvasDisplaySize = 600;
    } else {
        state.canvasDisplaySize = 1600;
    }

    elements.canvas.width = state.canvasDisplaySize;
    elements.canvas.height = state.canvasDisplaySize;

    state.grid = [];
    for (let y = 0; y < gridSize; y++) {
        state.grid[y] = [];
        for (let x = 0; x < gridSize; x++) {
            state.grid[y][x] = "#FFFFFF";
        }
    }

    drawGrid();
    console.log("Grid created");
}

export function drawGrid() {
    console.log("Drawing grid!");
    const ctx = elements.canvas.getContext("2d");
    const gridSize = state.gridSize;
    const displaySize = state.canvasDisplaySize;
    const pixelSize = displaySize / gridSize;

    ctx.clearRect(0, 0, displaySize, displaySize);

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const pixelX = x * pixelSize;
            const pixelY = y * pixelSize;

            ctx.fillStyle = state.grid[y][x];
            ctx.fillRect(pixelX, pixelY, pixelSize, pixelSize);

            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 1;
            ctx.strokeRect(pixelX, pixelY, pixelSize, pixelSize);
        }
    }
    console.log("Grid drawn!");
}

export function getGridCoordinates(clientX, clientY) {
    const canvasRect = elements.canvas.getBoundingClientRect();
    const displaySize = state.canvasDisplaySize;
    const gridSize = state.gridSize;
    const pixelSize = displaySize / gridSize;

    const x = clientX - canvasRect.left;
    const y = clientY - canvasRect.top;

    const gridX = Math.floor(x / pixelSize);
    const gridY = Math.floor(y / pixelSize);

    if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
        return { x: gridX, y: gridY };
    }
    return null;
}

export function handleSizeChange() {
    state.gridSize = parseInt(elements.sizeSelect.value);
    state.history = [];
    state.historyIndex = -1;
    createGrid();
}