const state = {
    ctx: null,
    gridSize: 8, //default canvas grid
    currentTool: 'pencil',
    currentColor: '#000000',
    grid: [],
    isDrawing: false
};
const DEFAULT_COLORS = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
const elements = {
    canvas: document.querySelector('canvas'),
    colorButtons: document.querySelectorAll('.color'),
    toolButtons: document.querySelectorAll('.tool-icon'),
    sizeSelect: document.getElementById('canvas-size'),
    downloadBtn: document.getElementById('download-btn')
};

function init(){
    console.log("Setting up editor!");
        
        // Set initial size from dropdown
        state.gridSize = parseInt(elements.sizeSelect.value);
    
        // Set up event listeners
        setupEventListeners();
        
        // Initialize color palette
        setupColorPalette();
        
        // Create initial grid
        createGrid();
}

function setupEventListeners(){
    console.log("Setting up event listeners!")
    
    // Listen for size changes
    elements.sizeSelect.addEventListener('change', handleSizeChange);

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

function createGrid(){
    console.log("Creating grid!")
    const gridSize = state.gridSize;
    const canvasSize = 300; 
    const pixelSize = canvasSize / gridSize; // Size of each pixel in screen pixels
    
    // Set canvas drawing buffer size
    elements.canvas.width = 300;
    elements.canvas.height = 300;

    //Initialize grid state
    state.grid = [];
    for (let y = 0; y < gridSize; y++){
        state.grid[y] = []
        for (let x = 0; x < gridSize; x++){
            state.grid[y][x] = '#FFFFFF'
        }
    }

    //draw the grid
    drawGrid();
    
    // const ctx = elements.canvas.getContext('2d');
    
    // // Draw grid by creating individual pixel cells
    // for (let x = 0; x < gridSize; x++) {
    //     for (let y = 0; y < gridSize; y++) {
    //         // Draw pixel border
    //         ctx.strokeStyle = '#000000';
    //         ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            
    //         // Draw white fill
    //         ctx.fillStyle = '#FFFFFF';
    //         ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    //     }
    // }

    console.log("Grid created")
}


function drawGrid(){
    console.log("Drawing grid!")
    const ctx = elements.canvas.getContext('2d');
    const gridSize = state.gridSize;
    const canvasSize = 300;
    const pixelSize = canvasSize / gridSize;

    //clear the entire canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    //Draw each pixel
    for (let y = 0; y < gridSize; y++){
        for (let x = 0; x < gridSize; x++){
            const pixelX = x * pixelSize;
            const pixelY = y * pixelSize;

            //Draw pixel fill
            ctx.fillStyle = state.grid[y][x];
            ctx.fillRect(pixelX, pixelY, pixelSize, pixelSize);

            //Draw pixel border
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.strokeRect(pixelX, pixelY, pixelSize, pixelSize);
        }
    }
    console.log("Grid drawn")
}

function getGridCoordinates(clientX, clientY){
    const canvasRect = elements.canvas.getBoundingClientRect();
    const canvasSize = 300;
    const gridSize = state.gridSize;
    const pixelSize = canvasSize / gridSize;

    //Calculate relative position within the canvas - FIXED: use the parameters
    const x = clientX - canvasRect.left;  // ← ADDED: calculate x position
    const y = clientY - canvasRect.top;   // ← ADDED: calculate y position

    //Calculate relative position within the canvas
    const gridX = Math.floor(x / pixelSize);
    const gridY = Math.floor(y / pixelSize);

    //Ensure coordinates are within bounds
    if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize){
        return {x: gridX, y: gridY};
    }
    return null
}

// function drawGridLines(ctx, gridSize){
//     console.log("Drawing grid!")
//     ctx.strokeStyle = '#000000';
//     ctx.lineWidth = 0.1;

//     //Draw vertical lines
//     for(let x=0; x<=gridSize;x++){
//         ctx.beginPath();
//         ctx.moveTo(x, 0);
//         ctx.lineTo(x, gridSize);
//         ctx.stroke();
//     }

//     // Draw horizontal lines
//     for (let y = 0; y <= gridSize; y++) {
//         ctx.beginPath();
//         ctx.moveTo(0, y);
//         ctx.lineTo(gridSize, y);
//         ctx.stroke();
//     }
// }

function handleSizeChange(){
    state.gridSize = parseInt(elements.sizeSelect.value)
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

function drawPixel(x, y){
    //Update grid state
    state.grid[y][x] = state.currentColor;

    //Redraw the grid
    drawGrid();
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

// Initialize the application
init();