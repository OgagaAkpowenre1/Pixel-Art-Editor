const state = {
    ctx: null,
    gridSize: 8, //default canvas grid
    currentTool: 'pencil',
    currentColor: '#000000',
    grid: [],
    isDrawing: false,
    canvasDisplaySize: 500,
    history: [],
    historyIndex: -1,
    redoHistory: [],
    maxHistory: 50
};
const DEFAULT_COLORS = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
const elements = {
    canvas: document.querySelector('canvas'),
    colorButtons: document.querySelectorAll('.color'),
    toolButtons: document.querySelectorAll('.tool-icon'),
    sizeSelect: document.getElementById('canvas-size'),
    downloadBtn: document.querySelector('button') // Fixed: removed 'download-btn' ID since your HTML doesn't have it
};

function init(){
    console.log("Setting up editor!");
    
    state.gridSize = parseInt(elements.sizeSelect.value);
    setupEventListeners();
    setupColorPalette();
    createGrid();
    
    // Save initial empty state
    saveState();
    updateUndoRedoButtons();
    
    console.log("Setup complete!");
}

// Add to setupEventListeners()
function setupToolEvents() {
    elements.toolButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const tool = e.currentTarget.dataset.tool;
            
            // Handle undo/redo separately from tool switching
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

function switchTool(toolName) {
    // Don't switch tool for undo/redo/clear - they're actions, not tools
    if (['undo', 'redo', 'clear'].includes(toolName)) {
        return;
    }
    
    state.currentTool = toolName;
    updateActiveToolUI();
    
    // Change cursor based on tool
    const cursorMap = {
        pencil: 'crosshair',
        eraser: 'cell',
        fill: 'crosshair'
    };
    elements.canvas.style.cursor = cursorMap[toolName] || 'default';
}

function setupEventListeners(){
    console.log("Setting up event listeners!")
    
    // Listen for size changes
    elements.sizeSelect.addEventListener('change', handleSizeChange);

    setupToolEvents();
    setupKeyboardShortcuts();
    //Canvas drawing events
    elements.canvas.addEventListener('mousedown', startDrawing);
    elements.canvas.addEventListener('mousemove', draw);
    elements.canvas.addEventListener('mouseup', stopDrawing);
    elements.canvas.addEventListener('mouseleave', stopDrawing);

    //Touch events for mobile
    elements.canvas.addEventListener('touchstart', handleTouchStart);
    elements.canvas.addEventListener('touchmove', handleTouchMove);
    elements.canvas.addEventListener('touchend', stopDrawing);

    console.log("Event listeners set!")
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'z') {
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

function createGrid(){
    console.log("Creating grid!")
    const gridSize = state.gridSize;

    // Adjust display size based on grid density
    if (gridSize <= 16) {
        state.canvasDisplaySize = 500;      // Large cells
    } else if (gridSize <= 64) {
        state.canvasDisplaySize = 600;      // Medium cells  
    } else {
        state.canvasDisplaySize = 1600;      // Smaller cells but more space
    }

    // Set canvas drawing buffer size
    elements.canvas.width = state.canvasDisplaySize;
    elements.canvas.height = state.canvasDisplaySize;

    //Initialize grid state - FIXED THE INFINITE LOOP
    state.grid = [];
    for (let y = 0; y < gridSize; y++){
        state.grid[y] = []
        for (let x = 0; x < gridSize; x++){  // ← FIXED: changed 'y' to 'x'
            state.grid[y][x] = '#FFFFFF'
        }
    }

    //draw the grid
    drawGrid();
    console.log("Grid created")
}

function drawGrid(){
    console.log("Drawing grid!")
    const ctx = elements.canvas.getContext('2d');
    const gridSize = state.gridSize;
    const displaySize = state.canvasDisplaySize;
    const pixelSize = displaySize / gridSize;

    //clear the entire canvas
    ctx.clearRect(0, 0, displaySize, displaySize);

    //Draw each pixel
    for (let y = 0; y < gridSize; y++){
        for (let x = 0; x < gridSize; x++){
            const pixelX = x * pixelSize;
            const pixelY = y * pixelSize;

            //Draw pixel fill - FIXED: consistent indexing
            ctx.fillStyle = state.grid[y][x];  // ← FIXED: changed [x][y] to [y][x]
            ctx.fillRect(pixelX, pixelY, pixelSize, pixelSize);

            //Draw pixel border
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.strokeRect(pixelX, pixelY, pixelSize, pixelSize);
        }
    }
    console.log("Grid drawn!")
}

function getGridCoordinates(clientX, clientY){
    const canvasRect = elements.canvas.getBoundingClientRect();
    const displaySize = state.canvasDisplaySize;
    const gridSize = state.gridSize;
    const pixelSize = displaySize / gridSize;

    //Calculate relative position within the canvas - FIXED: use the parameters
    const x = clientX - canvasRect.left;  // ← ADDED: calculate x position
    const y = clientY - canvasRect.top;   // ← ADDED: calculate y position
    
    const gridX = Math.floor(x / pixelSize);
    const gridY = Math.floor(y / pixelSize);

    //Ensure coordinates are within bounds
    if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize){
        return {x: gridX, y: gridY};
    }
    return null
}

function handleSizeChange(){
    state.gridSize = parseInt(elements.sizeSelect.value);
    state.history = [];
    state.historyIndex = -1;
    state.redoHistory = [];
    createGrid(); 
}

function setupColorPalette(){
    elements.colorButtons.forEach((button, index) => {
        if(DEFAULT_COLORS[index]) {
            button.style.backgroundColor = DEFAULT_COLORS[index];
            button.addEventListener('click', () => {
                state.currentColor = DEFAULT_COLORS[index];
                updateSelectedColor();
            })
        }
    })

    //Set initial selected color
    state.currentColor = DEFAULT_COLORS[0];
    updateSelectedColor();
}

function updateSelectedColor(){
    //Remove selected class from all colors
    elements.colorButtons.forEach(button => {
        button.classList.remove('selected');
    })

    //Add selected class to current color
    elements.colorButtons.forEach((button, index) => {
        if (DEFAULT_COLORS[index] === state.currentColor){
            button.classList.add('selected');
        }
    })
}

function startDrawing(e){
    e.preventDefault();
    state.isDrawing = true;
    const coords = getGridCoordinates(e.clientX, e.clientY);
    if (coords){
        drawPixel(coords.x, coords.y);
    }
}

function draw(e){
    e.preventDefault();
    if(!state.isDrawing) return;

    const coords = getGridCoordinates(e.clientX, e.clientY);
    if (coords){
        drawPixel(coords.x, coords.y);
    }
}

function stopDrawing(){
    state.isDrawing = false;
}

function drawPixel(x, y) {
    let colorToUse;
    
    switch(state.currentTool) {
        case 'pencil':
            colorToUse = state.currentColor;
            break;
        case 'eraser':
            colorToUse = '#FFFFFF'; // White
            break;
        case 'fill':
            // We'll implement this later
            return; // Don't draw single pixels for fill
        default:
            colorToUse = state.currentColor;
    }
    
    // Only save state if pixel actually changes
    if (state.grid[y][x] !== colorToUse) {
        saveState(); // For undo - save BEFORE changing
        state.grid[y][x] = colorToUse;
        drawGrid();
    }
}

// Touch event handlers for mobile
function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    state.isDrawing = true;
    const coords = getGridCoordinates(touch.clientX, touch.clientY);
    if (coords) {
        drawPixel(coords.x, coords.y);
    }
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!state.isDrawing) return;
    
    const touch = e.touches[0];
    const coords = getGridCoordinates(touch.clientX, touch.clientY);
    if (coords) {
        drawPixel(coords.x, coords.y);
    }
}

function clearCanvas() {
    saveState(); // Save current state before clearing
    const gridSize = state.gridSize;
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            state.grid[y][x] = '#FFFFFF';
        }
    }
    drawGrid();
}

// History functions
function saveState() {
    // Don't save if we're in the middle of undo/redo
    if (state.historyIndex < state.history.length - 1) {
        // We've done some undos, so remove future states
        state.history = state.history.slice(0, state.historyIndex + 1);
    }
    
    // Create a deep copy of the grid
    const gridCopy = state.grid.map(row => [...row]);
    state.history.push(gridCopy);
    state.historyIndex = state.history.length - 1;
    
    // Limit history size
    if (state.history.length > state.maxHistory) {
        state.history.shift();
        state.historyIndex--;
    }

    updateUndoRedoButtons();
}

function undo() {
    if (state.historyIndex > 0) {
        state.historyIndex--;
        state.grid = state.history[state.historyIndex].map(row => [...row]);
        drawGrid();
        updateUndoRedoButtons();
    }
}

function redo() {
    if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        state.grid = state.history[state.historyIndex].map(row => [...row]);
        drawGrid();
        updateUndoRedoButtons();
    }
}

function updateUndoRedoButtons() {
    // Visual feedback for undo/redo availability
    const undoBtn = document.querySelector('[data-tool="undo"]');
    const redoBtn = document.querySelector('[data-tool="redo"]');
    
    if (undoBtn) undoBtn.disabled = state.historyIndex <= 0;
    if (redoBtn) redoBtn.disabled = state.historyIndex >= state.history.length - 1;
}

function updateActiveToolUI() {
    // Remove active class from all tools
    elements.toolButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Add active class to current tool
    const activeTool = document.querySelector(`[data-tool="${state.currentTool}"]`);
    if (activeTool) {
        activeTool.classList.add('active');
    }
}

// Initialize the application
init();