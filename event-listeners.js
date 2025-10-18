import { state, elements } from './state.js';
import { handleSizeChange } from './grid-management.js';
import { setupToolEvents } from './ui-management.js';
import { startDrawing, draw, stopDrawing, handleTouchStart, handleTouchMove } from './drawing-tools.js';
import { undo, redo } from './history-management.js';
import { showDownloadOptions, setupDownloadModal } from './download.js';

export function setupEventListeners() {
    console.log("Setting up event listeners!");

    elements.sizeSelect.addEventListener("change", handleSizeChange);
    elements.downloadBtn.addEventListener("click", showDownloadOptions);

    setupDownloadModal();
    setupToolEvents();
    setupKeyboardShortcuts();

    elements.canvas.addEventListener("mousedown", startDrawing);
    elements.canvas.addEventListener("mousemove", draw);
    elements.canvas.addEventListener("mouseup", stopDrawing);
    elements.canvas.addEventListener("mouseleave", stopDrawing);

    elements.canvas.addEventListener("touchstart", handleTouchStart);
    elements.canvas.addEventListener("touchmove", handleTouchMove);
    elements.canvas.addEventListener("touchend", stopDrawing);

    console.log("Event listeners set!");
}

export function setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === "z") {
                e.preventDefault();
                if (e.shiftKey) {
                    redo();
                } else {
                    undo();
                }
            }
        }
    });
}