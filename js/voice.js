// --- Security Check ---
// If no session exists, kick them back to the start
if (!sessionStorage.getItem('janSwasth_session')) {
    window.location.href = 'index.html';
}

const micBtn = document.getElementById('micBtn');
const chatContainer = document.getElementById('chatContainer');
const statusIndicator = document.getElementById('statusIndicator');
const endSessionBtn = document.getElementById('endSessionBtn');

// Basic "Red Flag" keywords for the Offline Rule Engine 
const RED_FLAGS = ['chest pain', 'heart attack', 'breathing', 'bleeding', 'unconscious', 'emergency'];

// --- Speech Recognition Setup (Browser Native) ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US'; // We can switch this to 'hi-IN' later for Hindi support
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// --- Event Listeners ---

micBtn.addEventListener('click', () => {
    if (micBtn.classList.contains('listening')) {
        recognition.stop();
    } else {
        recognition.start();
    }
});

endSessionBtn.addEventListener('click', () => {
    // Secure Cleanup: "Auto-Delete after Session End" 
    sessionStorage.clear(); 
    window.location.href = 'index.html';
});

// --- Recognition Logic ---

recognition.onstart = () => {
    micBtn.classList.add('listening');
    statusIndicator.innerText = "Listening... Speak now";
};

recognition.onend = () => {
    micBtn.classList.remove('listening');
    statusIndicator.innerText = "Processing...";
};

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    
    // 1. Display User Speech
    addMessage(transcript, 'user-msg');

    // 2. Run Offline Red-Flag Check 
    const isEmergency = RED_FLAGS.some(flag => transcript.includes(flag));

    setTimeout(() => {
        if (isEmergency) {
            // Priority Override: Block AI, show Emergency
            addMessage("⚠️ CRITICAL ALERT: Based on your symptoms, please visit the nearest hospital immediately.", 'emergency-msg');
            speakResponse("Critical Alert. Please visit a hospital immediately.");
        } else {
            // 3. Normal AI Flow (Simulated)
            const aiResponse = simulateAIResponse(transcript);
            addMessage(aiResponse, 'system-msg');
            speakResponse(aiResponse);
        }
        statusIndicator.innerText = "Tap mic to reply";
    }, 1000);
};

// --- Helper Functions ---

function addMessage(text, className) {
    const div = document.createElement('div');
    div.classList.add('message', className);
    div.innerText = text;
    chatContainer.appendChild(div);
    // Auto-scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function speakResponse(text) {
    // Basic Text-to-Speech for accessibility
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
}

// Simple logic to mock the backend diagnosis for the prototype
function simulateAIResponse(input) {
    if (input.includes('fever') || input.includes('hot')) {
        return "It sounds like you may have a fever. Keep hydrated and monitor your temperature.";
    } else if (input.includes('headache')) {
        return "Headaches can be caused by dehydration or stress. Rest in a dark room.";
    } else {
        return "I have noted that. Can you tell me how long you have had these symptoms?";
    }
}