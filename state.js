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
};

export const DEFAULT_COLORS = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", 
    "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"
];

// Initialize DOM elements when document is ready
export const elements = {
    get canvas() { return document.querySelector("canvas"); },
    get colorButtons() { return document.querySelectorAll(".color"); },
    get toolButtons() { return document.querySelectorAll(".tool-icon"); },
    get sizeSelect() { return document.getElementById("canvas-size"); },
    get downloadBtn() { return document.querySelector("button"); }
};