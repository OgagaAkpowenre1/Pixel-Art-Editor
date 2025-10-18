import { state } from './state.js';

export function showDownloadOptions() {
    const modal = document.getElementById('download-modal');
    modal.style.display = 'flex';
}

export function hideDownloadOptions() {
    const modal = document.getElementById('download-modal');
    modal.style.display = 'none';
}

export function setupDownloadModal() {
    const modal = document.getElementById('download-modal');
    const cancelBtn = document.getElementById('cancel-download');
    const customDownloadBtn = document.getElementById('custom-download');
    const customInput = document.getElementById('custom-scale-input');

    document.querySelectorAll('.download-option').forEach(button => {
        button.addEventListener('click', (e) => {
            console.log("Button clicked")
            const scale = e.currentTarget.dataset.scale;

            if (scale === 'custom') {
                customInput.style.display = 'block';
            } else {
                downloadWithScale(parseInt(scale));
                hideDownloadOptions();
            }
        });
    });

    customDownloadBtn.addEventListener('click', () => {
        const scaleInput = document.getElementById('scale-input');
        const scale = parseInt(scaleInput.value) || 10;
        const clampedScale = Math.min(Math.max(scale, 1), 50);
        downloadWithScale(clampedScale);
        hideDownloadOptions();
    });

    cancelBtn.addEventListener('click', hideDownloadOptions);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideDownloadOptions();
        }
    })
}

export function downloadWithScale(scale) {
    const gridSize = state.gridSize;
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = gridSize * scale;
    tempCanvas.height = gridSize * scale;
    const tempCtx = tempCanvas.getContext('2d');
    
    if (scale === 1) {
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                tempCtx.fillStyle = state.grid[y][x];
                tempCtx.fillRect(x, y, 1, 1);
            }
        }
    } else {
        tempCtx.fillStyle = '#FFFFFF';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                tempCtx.fillStyle = state.grid[y][x];
                tempCtx.fillRect(x * scale, y * scale, scale, scale);
            }
        }
    }
    
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const scaleText = scale === 1 ? '1x1' : `${scale}x`;
    link.download = `pixel-art-${gridSize}x${gridSize}-${scaleText}.png`;
    link.href = tempCanvas.toDataURL('image/png');
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`Image downloaded at ${scale}x scale!`);
}