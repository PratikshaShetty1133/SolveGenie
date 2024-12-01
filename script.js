const Api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyC0Fxoh5dZ5ic0cf2Icw6gs4UrLbOTytTo";
document.addEventListener("DOMContentLoaded", function () {
let innerUploadImage = document.querySelector(".inner-upload-image");
let input = innerUploadImage.querySelector("input");
let image = document.querySelector("#image");
let loading = document.querySelector("#loading");
let uploadBtn = document.querySelector("#uploadBtn");
let manualBtn = document.querySelector("#manualBtn");
let text = document.querySelector("#text");
const resetUploadImageBtn = document.getElementById("resetUploadImageBtn");
const icon = document.getElementById("icon");
let output = document.querySelector(".output");
const imageResult = document.getElementById("imageResult");
const uploadText = document.querySelector(".inner-upload-image span");
let equationInput = document.querySelector("#equation-input");
const answerMessageDiv = document.getElementById("answer-message");
const outputSection = document.getElementById("outputSection");
if(resetUploadImageBtn && input && image && imageResult && icon && uploadText){
    resetUploadImageBtn.addEventListener("click",()=>{
        input.value = "";
        image.style.display = "none" ;
        image.src = "";
        uploadText.style.display = "block";
        icon.style.display = "block";
        imageResult.inneHTML = "";
        answerMessageDiv.style.display = "none";
        text.inneHTML = "";
        outputSection.style.display = "none";
    })
}
if (resetManualBtn && equationInput && output) 
{ 
    resetManualBtn.addEventListener("click", () => 
    {
    equationInput.value = "";
     answerMessageDiv.style.display = "none"; 
    text.innerHTML = ""; 
    outputSection.style.display = "none";
 }); 
}
let fileDetails = {
    mime_type: null,
    data: null
};

// Function to send API request
async function generateResponse(content) {
    const RequestOption = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "contents": [content]
        })
    };

    try {
        loading.style.display = "block";
        let response = await fetch(Api_url, RequestOption);

        if (!response.ok) {
            console.error("Network response was not ok:", response.statusText);
            return;
        }

        let data = await response.json();
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();

        text.innerHTML = apiResponse;
        output.style.display = "block";
    } catch (e) {
        console.error("Error fetching data:", e);
    } finally {
        loading.style.display = "none";
    }
}

// Event listener for image upload
input.addEventListener("change", (e) => {
    const file = input.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = (e) => {
        let base64data = e.target.result.split(",")[1];
        fileDetails.mime_type = file.type;
        fileDetails.data = base64data;
    
        innerUploadImage.querySelector("span").style.display = "none";
        innerUploadImage.querySelector("#icon").style.display = "none";
        image.style.display = "block";
        image.src = `data:${fileDetails.mime_type};base64,${fileDetails.data}`;
    
        // Adjust the image styles dynamically
        image.style.maxWidth = "100%";  // Ensure it fits within the container
        image.style.maxHeight = "250px";    // Maintain aspect ratio
        output.style.display = "none";
    };
    

    reader.readAsDataURL(file);
});

// Click event for answering image upload
uploadBtn.addEventListener("click", () => {
    if (fileDetails.data) {
        generateResponse({
            "parts": [
                { "text": "solve the mathematical problem with proper steps of solution stepwise" },
                {
                    "inline_data": {
                        "mime_type": fileDetails.mime_type,
                        "data": fileDetails.data
                    }
                }
            ]
        });
    } else {
        console.error("No file data found");
    }
});

// Click event for manual equation entry
manualBtn.addEventListener("click", () => {
    const equation = equationInput.value.trim();
    if (equation) {
        generateResponse({
            "parts": [
                { "text": `solve the equation: ${equation} with proper steps` }
            ]
        });
        equationInput.value = ""; // Clear input field after submission
    } else {
        alert("Please enter an equation.");
    }
});

// Click to open file selector
innerUploadImage.addEventListener("click", () => {
    input.click();
});


// Function to create calculator buttons dynamically
function createButtons(buttonSet) {
    const calculatorButtons = document.querySelector("#calculator-buttons");
    calculatorButtons.innerHTML = ''; // Clear existing buttons

    buttonSet.forEach(button => {
        const btn = document.createElement("button");
        btn.textContent = button.label;
        btn.onclick = () => handleButtonClick(button.value);
        calculatorButtons.appendChild(btn);
    });
}

const basicButtons = [
    { label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' }, { label: '+', value: '+' },
    { label: '4', value: '4' }, { label: '5', value: '5' }, { label: '6', value: '6' }, { label: '-', value: '-' },
    { label: '7', value: '7' }, { label: '8', value: '8' }, { label: '9', value: '9' }, { label: '*', value: '*' },
    { label: '0', value: '0' }, { label: '.', value: '.' }, { label: '=', value: 'calculate' }, { label: '/', value: '/' },
    { label: 'C', value: 'clear' }, { label: '←', value: 'backspace' }
];
const scientificButtons = [
    { label: '( )', value: '( )' }, { label: '^', value: '^' }, { label: '√', value: 'sqrt(' },
    { label: 'sin', value: 'sin(' }, { label: 'cos', value: 'cos(' }, { label: 'tan', value: 'tan(' },
    { label: 'log', value: 'log(' }, { label: 'exp', value: 'exp(' }, { label: 'π', value: 'pi' }, { label: 'e', value: 'e' }
];
// Switch calculator mode
function setMode(mode) {
    if (mode === 'basic') {
        createButtons(basicButtons);
    } else if (mode === 'scientific') {
        createButtons([...basicButtons, ...scientificButtons]);
    }
}

// Handle button clicks
function handleButtonClick(value) {
    if (value === 'clear') {
        equationInput.value = '';
    } else if (value === 'backspace') {
        equationInput.value = equationInput.value.slice(0, -1);
    } else if (value === 'calculate') {
        try {
            // Simplified evaluation for demonstration, consider using a math library for complex calculations
            equationInput.value = eval(equationInput.value.replace('^', '**'));
        } catch {
            equationInput.value = 'Error';
        }
    } else {
        equationInput.value += value;
    }
}

// Initialize with basic mode
setMode('basic');
var toggleButton = document.querySelector("#toggleButton");
var imageUploadSection = document.querySelector("#imageUploadSection");
var manualEntrySection = document.querySelector("#manualEntrySection");
var manualAnswerButton = document.querySelector("#manualAnswerButton");
var imageAnswerButton = document.querySelector("#imageAnswerButton");

setMode('scientific');
 toggleButton = document.querySelector("#toggleButton");
 imageUploadSection = document.querySelector("#imageUploadSection");
 manualEntrySection = document.querySelector("#manualEntrySection");
 manualAnswerButton = document.querySelector("#manualAnswerButton");
 imageAnswerButton = document.querySelector("#imageAnswerButton");

// Initially show image upload section
imageUploadSection.style.display = "block";

// Toggle button click event to switch sections
toggleButton.addEventListener("click", () => {
    if (imageUploadSection.style.display === "none") {
        imageUploadSection.style.display = "block";
        manualEntrySection.style.display = "none";
        toggleButton.textContent = "Switch to Manual Entry";
    } else {
        imageUploadSection.style.display = "none";
        manualEntrySection.style.display = "block";
        toggleButton.textContent = "Switch to Image Upload";
    }
});

// Function to speak the given text using the Web Speech API
function speak(text) {
    // Create a new SpeechSynthesisUtterance instance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Optional: Adjust voice properties
    utterance.pitch = 1; // Pitch of the voice
    utterance.rate = 1;  // Speed of speech
    utterance.volume = 1;
    // Speak the text
    window.speechSynthesis.speak(utterance);
}

// Function to send API request
async function generateResponse(content) {
    const RequestOption = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "contents": [content]
        })
    };

    try {
        loading.style.display = "block";
        let response = await fetch(Api_url, RequestOption);

        if (!response.ok) {
            console.error("Network response was not ok:", response.statusText);
            return;
        }

        let data = await response.json();
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();

        // Show answer message and speak
        const answerMessageDiv = document.getElementById("answer-message");
        answerMessageDiv.textContent = "Here is your answer:";
        answerMessageDiv.style.display = "block";
        speak("Here is your answer");

        // Display the answer
        text.innerHTML = apiResponse;
        output.style.display = "block";

        // Scroll to the answer section
        answerMessageDiv.scrollIntoView({ behavior: "smooth", block: "start" });

    } catch (e) {
        console.error("Error fetching data:", e);
    } finally {
        loading.style.display = "none";
    }
}


// Speech function with volume maxed out
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;  // Ensure maximum volume
    window.speechSynthesis.speak(utterance);
}

// Handle speech recognition for equation input
const micButton = document.getElementById("micButton");

micButton.addEventListener("click", () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        micButton.textContent = "Listening...";
    };

    recognition.onspeechend = () => {
        micButton.textContent = "🎤";
        recognition.stop();
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        equationInput.value = transcript;
    };

    recognition.start();
});
function displayAnswerWithSteps(answer) {
    const steps = answer.split("\n"); // Assuming steps are separated by newlines
    text.innerHTML = ''; // Clear previous answer

    steps.forEach((step, index) => {
        setTimeout(() => {
            text.innerHTML += `<p>${step}</p>`;
        }, index * 500); // Display each step with a delay
    });
}
function saveToHistory(equation, answer) {
    let history = JSON.parse(localStorage.getItem('history')) || [];
    history.push({ equation, answer });
    localStorage.setItem('history', JSON.stringify(history));
}

function loadHistory() {
    let history = JSON.parse(localStorage.getItem('history')) || [];
    history.forEach(item => {
        const historyItem = document.createElement("div");
        historyItem.classList.add("history-item");
        historyItem.innerHTML = `<strong>${item.equation}</strong>: ${item.answer}`;
        document.querySelector(".output").appendChild(historyItem);
    });
}

loadHistory(); // Call this on page load to populate history
document.addEventListener("DOMContentLoaded", () => {
    // Check if each element exists before attaching event listeners

    const resetUploadImageBtn = document.getElementById("resetUploadImageBtn");
    const imageInput = document.getElementById("imageInput");
    const imageResult = document.getElementById("imageResult");

    if (resetUploadImageBtn && imageInput && imageResult) {
        resetUploadImageBtn.addEventListener("click", () => {
            imageInput.value = "";  // Clear the file input
            imageResult.innerHTML = "";  // Clear any results displayed from the image processing
        });
    }

    const resetManualBtn = document.getElementById("resetManualBtn");
    const equationInput = document.getElementById("equation-input");
    const calculatorButtons = document.getElementById("calculator-buttons");

    if (resetManualBtn && equationInput && calculatorButtons) {
        resetManualBtn.addEventListener("click", () => {
            equationInput.value = "";  // Clear the equation input
            calculatorButtons.innerHTML = "";  // Clear any results or displayed answers
        });
    } 
});
});

document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");

    if (!themeToggle) {
        console.error("Checkbox with ID 'themeToggle' not found.");
        return;
    }

    // Apply the correct class based on the toggle state on load
    if (themeToggle.checked) {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.add("light-mode");
    }

    // Add event listener for the toggle
    themeToggle.addEventListener("change", () => {
        if (themeToggle.checked) {
            document.body.classList.remove("light-mode");
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
            document.body.classList.add("light-mode");
        }
    });
    document.getElementById('clickableHeader').addEventListener('click', () => {
        window.location.href = 'welcome.html'; // Redirect to the desired URL
    });
    
});


