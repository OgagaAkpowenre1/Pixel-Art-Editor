import { state, elements } from './state.js';
import { updateSelectedColor, renderColorPalette } from './ui-management.js';

let currentColor = '#ff0000'; // Default color for picker

export function setupColorPicker() {
    const addColorBtn = document.getElementById('add-color-btn');
    const colorPickerModal = document.getElementById('color-picker-modal');
    const cancelBtn = document.getElementById('cancel-color-picker');
    const addColorBtnConfirm = document.getElementById('add-custom-color');
    
    const colorWheelInput = document.getElementById('color-wheel-input');
    const hexInput = document.getElementById('hex-input');
    const rInput = document.getElementById('r-input');
    const gInput = document.getElementById('g-input');
    const bInput = document.getElementById('b-input');
    const colorPreview = document.getElementById('color-preview');
    
    // Show color picker modal
    addColorBtn.addEventListener('click', showColorPicker);
    
    // Cancel button
    cancelBtn.addEventListener('click', hideColorPicker);
    
    // Add color button
    addColorBtnConfirm.addEventListener('click', addCustomColor);
    
    // Close modal when clicking outside
    colorPickerModal.addEventListener('click', (e) => {
        if (e.target === colorPickerModal) {
            hideColorPicker();
        }
    });
    
    // Sync all color inputs
    colorWheelInput.addEventListener('input', (e) => {
        currentColor = e.target.value;
        syncColorInputs();
    });
    
    hexInput.addEventListener('input', (e) => {
        const color = e.target.value;
        if (isValidHex(color)) {
            currentColor = color.length === 6 ? `#${color}` : color;
            syncColorInputs();
        }
    });
    
    // RGB inputs
    [rInput, gInput, bInput].forEach(input => {
        input.addEventListener('input', updateColorFromRGB);
    });
    
    // Initialize
    syncColorInputs();
}

function showColorPicker() {
    const modal = document.getElementById('color-picker-modal');
    modal.style.display = 'flex';
    
    // Reset to default color each time
    currentColor = '#ff0000';
    syncColorInputs();
}

function hideColorPicker() {
    const modal = document.getElementById('color-picker-modal');
    modal.style.display = 'none';
}

function syncColorInputs() {
    const colorWheelInput = document.getElementById('color-wheel-input');
    const hexInput = document.getElementById('hex-input');
    const rInput = document.getElementById('r-input');
    const gInput = document.getElementById('g-input');
    const bInput = document.getElementById('b-input');
    const colorPreview = document.getElementById('color-preview');
    
    // Update all inputs
    colorWheelInput.value = currentColor;
    hexInput.value = currentColor.toUpperCase();
    colorPreview.style.backgroundColor = currentColor;
    
    // Update RGB inputs
    const rgb = hexToRgb(currentColor);
    if (rgb) {
        rInput.value = rgb.r;
        gInput.value = rgb.g;
        bInput.value = rgb.b;
    }
}

function updateColorFromRGB() {
    const r = parseInt(document.getElementById('r-input').value) || 0;
    const g = parseInt(document.getElementById('g-input').value) || 0;
    const b = parseInt(document.getElementById('b-input').value) || 0;
    
    // Clamp values
    const clampedR = Math.min(Math.max(r, 0), 255);
    const clampedG = Math.min(Math.max(g, 0), 255);
    const clampedB = Math.min(Math.max(b, 0), 255);
    
    currentColor = rgbToHex(clampedR, clampedG, clampedB);
    syncColorInputs();
}

function addCustomColor() {
    // Check if we have space for more colors
    if (state.customColors.length >= state.maxCustomColors) {
        alert(`Maximum ${state.maxCustomColors} custom colors allowed!`);
        return;
    }
    
    // Check if color already exists
    if (state.customColors.includes(currentColor) || isDefaultColor(currentColor)) {
        alert('This color already exists in your palette!');
        return;
    }
    
    // Add to custom colors
    state.customColors.push(currentColor);
    
    // Update UI
    renderColorPalette();
    
    // Select the new color
    state.currentColor = currentColor;
    updateSelectedColor();
    
    // Close modal
    hideColorPicker();
    
    console.log(`Added custom color: ${currentColor}`);
}

// Utility functions
function isValidHex(color) {
    return /^#?[0-9A-F]{6}$/i.test(color) || /^#?[0-9A-F]{3}$/i.test(color);
}

function hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse hex
    let r, g, b;
    if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
    } else {
        return null;
    }
    
    return { r, g, b };
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function isDefaultColor(color) {
    // Compare with DEFAULT_COLORS (you'll need to import it or pass it)
    const DEFAULT_COLORS = [
        "#000000", "#FFFFFF", "#FF0000", "#00FF00", 
        "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"
    ];
    return DEFAULT_COLORS.includes(color.toUpperCase());
}