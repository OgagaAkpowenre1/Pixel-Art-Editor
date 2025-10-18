import { state, elements } from './state.js';
import { drawGrid } from './grid-management.js';

export function saveState() {
    if (state.historyIndex < state.history.length - 1) {
        state.history = state.history.slice(0, state.historyIndex + 1);
    }

    const gridCopy = state.grid.map((row) => [...row]);
    state.history.push(gridCopy);
    state.historyIndex = state.history.length - 1;

    if (state.history.length > state.maxHistory) {
        state.history.shift();
        state.historyIndex--;
    }

    updateUndoRedoButtons();
}

export function undo() {
    if (state.historyIndex > 0) {
        state.historyIndex--;
        state.grid = state.history[state.historyIndex].map((row) => [...row]);
        drawGrid();
        updateUndoRedoButtons();
    }
}

export function redo() {
    if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        state.grid = state.history[state.historyIndex].map((row) => [...row]);
        drawGrid();
        updateUndoRedoButtons();
    }
}

export function updateUndoRedoButtons() {
    const undoBtn = document.querySelector('[data-tool="undo"]');
    const redoBtn = document.querySelector('[data-tool="redo"]');

    if (undoBtn) undoBtn.disabled = state.historyIndex <= 0;
    if (redoBtn) redoBtn.disabled = state.historyIndex >= state.history.length - 1;
}

export function clearCanvas(){
    saveState(); // Save current state before clearing
    const gridSize = state.gridSize;
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        state.grid[y][x] = "#FFFFFF";
      }
    }
    drawGrid();
}