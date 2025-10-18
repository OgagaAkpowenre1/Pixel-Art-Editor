import { state, elements, DEFAULT_COLORS } from './state.js';
import { switchTool } from './tool-management.js';
import { undo, redo, clearCanvas } from './history-management.js';

export function setupColorPalette() {
    elements.colorButtons.forEach((button, index) => {
        if (DEFAULT_COLORS[index]) {
            button.style.backgroundColor = DEFAULT_COLORS[index];
            button.addEventListener("click", () => {
                state.currentColor = DEFAULT_COLORS[index];
                updateSelectedColor();
            });
        }
    });

    state.currentColor = DEFAULT_COLORS[0];
    updateSelectedColor();
}

export function updateSelectedColor() {
    elements.colorButtons.forEach((button) => {
        button.classList.remove("selected");
    });

    elements.colorButtons.forEach((button, index) => {
        if (DEFAULT_COLORS[index] === state.currentColor) {
            button.classList.add("selected");
        }
    });
}

export function updateActiveToolUI() {
    elements.toolButtons.forEach((button) => {
        button.classList.remove("active");
    });

    const activeTool = document.querySelector(`[data-tool="${state.currentTool}"]`);
    if (activeTool) {
        activeTool.classList.add("active");
    }
}

export function setupToolEvents() {
    elements.toolButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const tool = e.currentTarget.dataset.tool;

            if (tool === "undo") {
                undo();
            } else if (tool === "redo") {
                redo();
            } else if (tool === "clear") {
                clearCanvas();
            } else {
                switchTool(tool);
            }
        });
    });
}