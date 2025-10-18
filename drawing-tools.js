import { state, elements } from './state.js';
import { drawGrid, getGridCoordinates } from './grid-management.js';
import { saveState } from './history-management.js';

export function drawPixel(x, y) {
    let colorToUse;

    switch (state.currentTool) {
        case "pencil":
            colorToUse = state.currentColor;
            break;
        case "eraser":
            colorToUse = "#FFFFFF";
            break;
        case "fill":
            saveState();
            floodFill(x, y, state.currentColor);
            drawGrid();
            return;
        default:
            colorToUse = state.currentColor;
    }

    if (state.grid[y][x] !== colorToUse) {
        saveState();
        state.grid[y][x] = colorToUse;
        drawGrid();
    }
}

export function floodFill(startX, startY, replacementColor) {
    const grid = state.grid;
    const gridSize = state.gridSize;
    const targetColor = grid[startY][startX];
    
    if (targetColor === replacementColor) return;
    
    const queue = [[startX, startY]];
    const visited = new Set();
    
    while (queue.length > 0) {
        const [x, y] = queue.shift();
        const key = `${x},${y}`;
        
        if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) continue;
        if (grid[y][x] !== targetColor) continue;
        if (visited.has(key)) continue;
        
        visited.add(key);
        grid[y][x] = replacementColor;
        
        queue.push([x + 1, y]);
        queue.push([x - 1, y]);  
        queue.push([x, y + 1]);
        queue.push([x, y - 1]);
    }
}

export function startDrawing(e) {
    e.preventDefault();
    state.isDrawing = true;
    const coords = getGridCoordinates(e.clientX, e.clientY);
    if (coords) {
        drawPixel(coords.x, coords.y);
    }
}

export function draw(e) {
    e.preventDefault();
    if (!state.isDrawing) return;

    const coords = getGridCoordinates(e.clientX, e.clientY);
    if (coords) {
        drawPixel(coords.x, coords.y);
    }
}

export function stopDrawing() {
    state.isDrawing = false;
}

export function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    state.isDrawing = true;
    const coords = getGridCoordinates(touch.clientX, touch.clientY);
    if (coords) {
        drawPixel(coords.x, coords.y);
    }
}

export function handleTouchMove(e) {
    e.preventDefault();
    if (!state.isDrawing) return;

    const touch = e.touches[0];
    const coords = getGridCoordinates(touch.clientX, touch.clientY);
    if (coords) {
        drawPixel(coords.x, coords.y);
    }
}

export function clearCanvas() {
    saveState();
    const gridSize = state.gridSize;
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            state.grid[y][x] = "#FFFFFF";
        }
    }
    drawGrid();
}