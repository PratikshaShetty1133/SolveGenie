document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('whiteboard');
    const ctx = canvas.getContext('2d');

    // Set canvas size dynamically
   const resizeCanvas = () => {
    const container = document.querySelector('.whiteboard-container');
    canvas.width = container.offsetWidth; // Match the container's width
    canvas.height = container.offsetHeight; // Match the container's height
};


    // Call resize function on load and resize events
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let isDrawing = false;
    let isErasing = false;

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    let selectedColor = 'black'; // Default pen color
    ctx.strokeStyle = selectedColor; // Set initial stroke color

    // Start drawing
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    });

    // Stop drawing
    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
    });

    // Draw or erase
    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;

        if (isErasing) {
            ctx.clearRect(e.offsetX - 5, e.offsetY - 5, 10, 10);
        } else {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        }
    });

    // Clear canvas
    document.getElementById('clearBoard').addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Toggle erase mode
    document.getElementById('eraseMode').addEventListener('click', () => {
        isErasing = !isErasing;
        if (isErasing) {
            document.getElementById('eraseMode').textContent = 'Draw';
        } else {
            document.getElementById('eraseMode').textContent = 'Erase';
        }
    });

    const colorOptions = document.querySelectorAll('.color-option');
    const selectedColorDisplay = document.getElementById('selected-color');

    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            selectedColor = option.getAttribute('data-color');  // Get selected color
            selectedColorDisplay.textContent = selectedColor;  // Update displayed color
            selectedColorDisplay.style.color = selectedColor;  // Update text color

            // Highlight the selected color
            colorOptions.forEach(opt => opt.style.borderColor = 'black');
            option.style.borderColor = selectedColor;

            // Update pen color
            ctx.strokeStyle = selectedColor;  // Set the drawing color to the selected color
        });
    });
    // Handle eraser size selection
    //const eraserSizeSlider = document.getElementById('eraserSize');
    // const eraserSizeValue = document.getElementById('eraserSizeValue');

    // // Initialize with the current value of the slider
    // eraserSizeValue.textContent = eraserSizeSlider.value;

    // // Update eraser size when slider value changes
    // eraserSizeSlider.addEventListener('input', (e) => {
    //     const newSize = e.target.value;
    //     eraserSizeValue.textContent = newSize;  // Display the current size
    //     ctx.lineWidth = newSize;  // Update the line width for erasing
    // });
    // Get the elements
const penSize = document.getElementById('penSize');
const penSizeValue = document.getElementById('penSizeValue');
const eraserSizeSlider = document.getElementById('eraserSizeSlider');
const eraserSizeValue = document.getElementById('eraserSizeValue');

// Add event listeners to update the displayed values
penSize.addEventListener('input', () => {
    penSizeValue.textContent = penSize.value;
});

eraserSizeSlider.addEventListener('input', () => {
    eraserSizeValue.textContent = eraserSizeSlider.value;
});
 penSize = 5; 
eraserSize = 50;
function updatePenSize(size) {
    penSize = size; 
    ctx.lineWidth = penSize; 
} 
function updateEraserSize(size) { 
    eraserSize = size; 
} 
// Event listeners for sliders 
document.getElementById('penSize').addEventListener('input', (event) => { 
    const newSize = event.target.value;
     updatePenSize(newSize); 
     document.getElementById('penSizeValue').textContent = newSize; 
    }); 
    document.getElementById('eraserSizeSlider').addEventListener('input', (event) => {
         const newSize = event.target.value; 
         updateEraserSize(newSize); 
         document.getElementById('eraserSizeValue').textContent = newSize; 
        });  
        // Example drawing function 
        function draw(x, y) { 
            ctx.lineWidth = penSize; 
            ctx.lineTo(x, y);
             ctx.stroke(); 
            } 
            // Example erasing function
             function erase(x, y) { 
                ctx.clearRect(x, y, eraserSize, eraserSize);
            }
});

canvas.width = canvas.offsetWidth; // Set canvas width
canvas.height = canvas.offsetHeight; // Set canvas height
let drawing = false;
let erasing = false;
let selectedColor = 'black';

// Track the previous points for smoother lines
let previousX = 0;
let previousY = 0;

// Function to start drawing
function startDrawing(event) {
    drawing = true;
    previousX = event.clientX - canvas.offsetLeft;
    previousY = event.clientY - canvas.offsetTop;
    ctx.beginPath();
    ctx.moveTo(previousX, previousY);
}

// Function to draw
function draw(event) {
    if (!drawing) return;
    const currentX = event.clientX - canvas.offsetLeft;
    const currentY = event.clientY - canvas.offsetTop;
    ctx.lineWidth = penSize; // Ensure lineWidth is updated dynamically
    ctx.strokeStyle = selectedColor;

    // Use quadratic curve for smoother lines
    ctx.quadraticCurveTo(previousX, previousY, (previousX + currentX) / 2, (previousY + currentY) / 2);
    ctx.stroke();

    // Update previous points
    previousX = currentX;
    previousY = currentY;
}

// Function to stop drawing
function stopDrawing() {
    drawing = false;
    ctx.closePath();
}

// Function to start erasing
function startErasing(event) {
    erasing = true;
    erase(event);
}

// Function to erase
function erase(event) {
    if (!erasing) return;
    ctx.clearRect(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop, eraserSize, eraserSize);
}

// Function to stop erasing
function stopErasing() {
    erasing = false;
}

// Event listeners for drawing
canvas.addEventListener('mousedown', (event) => {
    if (selectedColor === 'white') {
        startErasing(event);
    } else {
        startDrawing(event);
    }
});
canvas.addEventListener('mousemove', (event) => {
    if (selectedColor === 'white') {
        erase(event);
    } else {
        draw(event);
    }
});
canvas.addEventListener('mouseup', () => {
    if (selectedColor === 'white') {
        stopErasing();
    } else {
        stopDrawing();
    }
});
canvas.addEventListener('mouseout', () => {
    if (selectedColor === 'white') {
        stopErasing();
    } else {
        stopDrawing();
    }
});

// Event listeners for sliders
document.getElementById('penSize').addEventListener('input', (event) => {
    const newSize = event.target.value;
    penSize = newSize;
    document.getElementById('penSizeValue').textContent = newSize;
});

document.getElementById('eraserSizeSlider').addEventListener('input', (event) => {
    const newSize = event.target.value;
    eraserSize = newSize;
    document.getElementById('eraserSizeValue').textContent = newSize;
});

// Set initial lineWidth
ctx.lineWidth = penSize;

