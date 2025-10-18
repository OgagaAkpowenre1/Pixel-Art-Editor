import { state, elements, DEFAULT_COLORS } from './state.js';
import { switchTool } from './tool-management.js';
import { undo, redo, clearCanvas } from './history-management.js';

export function setupColorPalette() {
    renderColorPalette();
    state.currentColor = DEFAULT_COLORS[0];
    updateSelectedColor();
}

export function renderColorPalette() {
    const colorWheel = document.querySelector('.color-wheel');
    
    // Clear existing color buttons (except the add button)
    const existingColors = colorWheel.querySelectorAll('.color:not(.add-color)');
    existingColors.forEach(color => color.remove());
    
    // Combine default and custom colors
    const allColors = [...DEFAULT_COLORS, ...state.customColors];
    
    // Create color buttons
    allColors.forEach((color, index) => {
        const button = document.createElement('button');
        button.className = 'color';
        if (index >= DEFAULT_COLORS.length) {
            button.classList.add('custom');
        }
        button.style.backgroundColor = color;
        button.title = color;
        
        button.addEventListener('click', () => {
            state.currentColor = color;
            updateSelectedColor();
        });
        
        colorWheel.insertBefore(button, elements.addColorBtn);
    });
    
    // Update elements reference
    elements.colorButtons = colorWheel.querySelectorAll('.color:not(.add-color)');
}

export function updateSelectedColor() {
    elements.colorButtons.forEach((button) => {
        button.classList.remove('selected');
    });
    
    elements.colorButtons.forEach((button) => {
        if (button.style.backgroundColor === state.currentColor || 
            rgbToHex(button.style.backgroundColor) === state.currentColor) {
            button.classList.add('selected');
        }
    });
}

// Helper function to convert RGB string to hex
function rgbToHex(rgb) {
    if (!rgb || rgb === '') return null;
    
    if (rgb.startsWith('#')) return rgb;
    
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) return null;
    
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function updateActiveToolUI() {
    elements.toolButtons.forEach((button) => {
        button.classList.remove('active');
    });

    const activeTool = document.querySelector(`[data-tool="${state.currentTool}"]`);
    if (activeTool) {
        activeTool.classList.add('active');
    }
}

export function setupToolEvents() {
    elements.toolButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            const tool = e.currentTarget.dataset.tool;

            if (tool === 'undo') {
                undo();
            } else if (tool === 'redo') {
                redo();
            } else if (tool === 'clear') {
                clearCanvas();
            } else {
                switchTool(tool);
            }
        });
    });
}