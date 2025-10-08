const state = {
    ctx: null,
    gridSize: 8 //default canvas grid
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
        
    // Create initial grid
    createGrid();
    
    // Listen for size changes
    elements.sizeSelect.addEventListener('change', handleSizeChange);
}

// function createGrid(){
//     // const canvasSize = parseInt(elements.sizeSelect.value)
//     const gridSize = state.gridSize;

//     //Set canvas drawing buffer (actual pixel size)
//     elements.canvas.width = gridSize;
//     elements.canvas.height = gridSize;

//     //CSS Size remains 300
//     elements.canvas.style.width = '300px';
//     elements.canvas.style.height = '300px';

//     //Get drawing context
//     const ctx = elements.canvas.getContext('2d');

//     //Clear canvas
//     ctx.fillStyle = '#FFFFFF';
//     ctx.fillRect(0, 0, gridSize, gridSize);
//     drawGridLines(ctx, gridSize);
// }

function createGrid(){
    console.log("Creating grid!")
    const gridSize = state.gridSize;
    console.log("Grid size", gridSize)
    const pixelSize = 300 / gridSize; // Size of each pixel in screen pixels
    
    // Larger drawing buffer for better quality
    elements.canvas.width = 300;
    elements.canvas.height = 300;
    
    const ctx = elements.canvas.getContext('2d');
    
    // Draw grid by creating individual pixel cells
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            // Draw pixel border
            ctx.strokeStyle = '#000000';
            ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            
            // Draw white fill
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
    }

    console.log("Grid created")
}

function drawGridLines(ctx, gridSize){
    console.log("Drawing grid!")
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 0.1;

    //Draw vertical lines
    for(let x=0; x<=gridSize;x++){
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, gridSize);
        ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= gridSize; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(gridSize, y);
        ctx.stroke();
    }
}

function handleSizeChange(){
    state.gridSize = parseInt(elements.sizeSelect.value)
    createGrid(); 
}

init()