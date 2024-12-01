document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('getSolution').addEventListener('click', () => {
        const canvas = document.getElementById('whiteboard');
        const preprocessedImageData = preprocessCanvasForOCR(canvas);

        // Debugging line to show the image being processed
        document.getElementById('imageResult').innerHTML = `<img src="${preprocessedImageData}" />`;
        document.getElementById('imageResult').textContent = "Processing... Please wait.";

        Tesseract.recognize(preprocessedImageData, 'eng', {
            logger: (info) => console.log(info),
            tessedit_char_whitelist: '0123456789+-*/().= ', // Allow only math characters
            oem: 3,
            psm: 6
        })
        .then(({ data }) => {
            const rawText = data?.text?.trim() || "";
            console.log("Raw OCR Text:", rawText);

            // Clean the extracted text
            const cleanedText = cleanAndValidateEquation(rawText);
            console.log("Cleaned Equation:", cleanedText);

            if (cleanedText) {
                try {
                    const solution = eval(cleanedText);
                    document.getElementById('imageResult').textContent = `Extracted Equation: ${cleanedText} | Solution: ${solution}`;
                } catch (err) {
                    console.error("Evaluation Error:", err);
                    document.getElementById('imageResult').textContent = "Error: Unable to solve the equation.";
                }
            } else {
                document.getElementById('imageResult').textContent = "No valid equation detected.";
            }
        })
        .catch((err) => {
            console.error("OCR Error:", err);
            document.getElementById('imageResult').textContent = "Error processing whiteboard.";
        });
    });

    // Preprocess the canvas for better OCR results
    function preprocessCanvasForOCR(canvas) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        // Upscale the image for better OCR accuracy
        tempCanvas.width = canvas.width * 2;
        tempCanvas.height = canvas.height * 2;

        tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            const brightness = avg > 170 ? 255 : 0; // Increase brightness threshold for better contrast
            data[i] = brightness;
            data[i + 1] = brightness;
            data[i + 2] = brightness;
        }

        tempCtx.putImageData(imageData, 0, 0);
        return tempCanvas.toDataURL('image/png');
    }

    // Clean and validate the OCR result (math equation)
    function cleanAndValidateEquation(equation) {
        console.log("Raw Equation:", equation);

        // Clean unwanted characters
        let validEquation = equation.replace(/[^0-9+\-*/().= ]/g, '').trim();

        if (validEquation.includes('=')) {
            validEquation = validEquation.split('=')[0].trim(); // Only evaluate left-hand side
        }

        if (/^[0-9+\-*/().= ]+$/.test(validEquation)) {
            return validEquation;
        }

        return ""; // Return empty string if invalid equation
    }
});
