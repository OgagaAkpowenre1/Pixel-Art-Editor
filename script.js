import { state, elements } from './state.js';
import { setupEventListeners } from './event-listeners.js';
import { setupColorPalette } from './ui-management.js';
import { createGrid } from './grid-management.js';
import { saveState, updateUndoRedoButtons } from './history-management.js';

function init() {
    console.log("Setting up editor!");

    state.gridSize = parseInt(elements.sizeSelect.value);
    setupEventListeners();
    setupColorPalette();
    createGrid();

    saveState();
    updateUndoRedoButtons();

    console.log("Setup complete!");
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);