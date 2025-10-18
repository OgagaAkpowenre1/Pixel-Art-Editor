import { state, elements } from './state.js';
import { updateActiveToolUI } from './ui-management.js';

export function switchTool(toolName) {
    if (["undo", "redo", "clear"].includes(toolName)) {
        return;
    }

    state.currentTool = toolName;
    updateActiveToolUI();

    const cursorMap = {
        pencil: "crosshair",
        eraser: "cell",
        fill: "crosshair",
    };
    elements.canvas.style.cursor = cursorMap[toolName] || "default";
}