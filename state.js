export const state = {
    ctx: null,
    gridSize: 8,
    currentTool: "pencil",
    currentColor: "#000000",
    grid: [],
    isDrawing: false,
    canvasDisplaySize: 500,
    history: [],
    historyIndex: -1,
    maxHistory: 50,
    customColors: []
};

export const DEFAULT_COLORS = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", 
    "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"
];

// Initialize DOM elements when document is ready
export const elements = {
    // Regular properties instead of getters
    canvas: null,
    colorButtons: null,
    toolButtons: null,
    sizeSelect: null,
    downloadBtn: null,
    addColorBtn: null
};

// Function to initialize elements (call this in your init)
export function initializeElements() {
    elements.canvas = document.querySelector("canvas");
    elements.colorButtons = document.querySelectorAll(".color");
    elements.toolButtons = document.querySelectorAll(".tool-icon");
    elements.sizeSelect = document.getElementById("canvas-size");
    elements.downloadBtn = document.querySelector("button");
    elements.addColorBtn = document.getElementById('add-color-btn');
}