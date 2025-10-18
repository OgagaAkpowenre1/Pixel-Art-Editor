import { state, elements, initializeElements } from './state.js';
import { setupEventListeners } from './event-listeners.js';
import { setupColorPalette } from './ui-management.js';
import { createGrid } from './grid-management.js';
import { saveState, updateUndoRedoButtons } from './history-management.js';
import { setupColorPicker } from './color-picker.js';

function init() {
    console.log("Setting up editor!");

    // Initialize DOM elements first
    initializeElements();

    state.gridSize = parseInt(elements.sizeSelect.value);
    setupEventListeners();
    setupColorPalette();
    setupColorPicker();
    createGrid();

    saveState();
    updateUndoRedoButtons();

    console.log("Setup complete!");
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);