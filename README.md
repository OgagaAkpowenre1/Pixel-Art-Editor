# Pixel-Art-Editor
A simple pixel art editor built with HTML, CSS and Javascript

To-do
Core System Architecture
1. State Management
javascript

const state = {
    currentTool: 'pencil',
    currentColor: '#000000',
    canvasSize: 16,
    grid: [], // 2D array representing pixels
    history: [], // For undo/redo
    historyIndex: -1,
    isDrawing: false
}

2. Initialization & Setup Functions

init() - Main initialization

    Set up event listeners
    Create initial grid
    Set default colors/tools
    Render initial canvas

setupCanvas() - Canvas preparation

    Get canvas context
    Set up grid data structure
    Draw initial grid lines

3. Canvas Grid Management

createGrid(size) - Grid creation

    Generate 2D array for pixel data
    Initialize all pixels as transparent/white
    Store color data for each cell

drawGrid() - Visual grid rendering

    Draw grid lines between pixels
    Render colored pixels from state

resizeCanvas(newSize) - Canvas resizing

    Update state.canvasSize
    Recreate grid with new dimensions
    Clear and redraw canvas

4. Drawing Tools Implementation

handlePixelClick(x, y) - Core drawing logic

    Convert mouse coordinates to grid coordinates
    Apply current tool to targeted pixel

Tool-specific functions:

    drawWithPencil(x, y) - Set single pixel color
    useEraser(x, y) - Set pixel to background color
    fillArea(x, y) - Flood fill algorithm
    clearCanvas() - Reset all pixels

5. Color Management

setupColorPalette() - Initialize colors

    Create default color set
    Allow color selection
    Update currentColor state

selectColor(color) - Color selection handler

    Update state.currentColor
    Visual feedback for selected color

6. History Management (Undo/Redo)

saveState() - Save current state to history

    Push grid snapshot to history array
    Update history index

undo() - Revert to previous state

    Decrement history index
    Restore grid from history

redo() - Restore undone changes

    Increment history index
    Restore grid from history

7. Event Handlers

Mouse/Touch events:

    onMouseDown - Start drawing, set isDrawing = true
    onMouseMove - Draw while dragging (if isDrawing)
    onMouseUp - Stop drawing, save state
    onClick - Single click actions

UI event handlers:

    Tool selection buttons
    Color selection buttons
    Canvas size dropdown
    Download button

8. Export Functionality

downloadImage() - Export canvas

    Convert canvas to data URL
    Create download link
    Trigger file download

9. Utility Functions

getGridCoordinates(clientX, clientY) - Coordinate conversion

    Convert screen coordinates to grid coordinates

hexToRgba(hex) - Color conversion

    Convert hex colors for canvas operations