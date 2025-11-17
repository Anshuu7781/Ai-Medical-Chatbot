// Get DOM elements
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');

// API endpoint - will be updated when backend is ready
const API_ENDPOINT = 'http://localhost:5000/api/chat';

// Get current time for timestamps
function getCurrentTime() {
    return new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Add message to chat
function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <div>${text}</div>
            <div class="timestamp">${getCurrentTime()}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator active';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Get bot response from backend (will be implemented later)
async function getBotResponseFromAPI(userMessage) {
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage })
        });
        
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.log('Backend not connected yet, using demo responses');
        return getBotResponseDemo(userMessage);
    }
}

// Demo responses (temporary - will be replaced with backend)
function getBotResponseDemo(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('fever')) {
        return `<strong>Common symptoms of fever include:</strong><br><br>
        • Body temperature above 100.4°F (38°C)<br>
        • Sweating and chills<br>
        • Headache<br>
        • Muscle aches<br>
        • Loss of appetite<br>
        • Weakness<br><br>
        💡 <em>Tip:</em> Stay hydrated and rest. If fever persists for more than 3 days or exceeds 103°F, consult a doctor.`;
    } 
    else if (lowerMessage.includes('burn')) {
        return `<strong>First Aid for Burns:</strong><br><br>
        1. <strong>Cool the burn:</strong> Hold under cool running water for 10-20 minutes<br>
        2. Remove jewelry/tight items near the burn<br>
        3. Don't break blisters<br>
        4. Apply aloe vera or moisturizer<br>
        5. Cover with sterile bandage<br><br>
        ⚠️ <em>Seek immediate medical help for severe burns!</em>`;
    } 
    else if (lowerMessage.includes('diabetes')) {
        return `<strong>Diabetes Prevention Tips:</strong><br><br>
        • Maintain healthy weight<br>
        • Exercise regularly (30 min/day)<br>
        • Eat balanced diet (more fiber, less sugar)<br>
        • Limit processed foods<br>
        • Stay hydrated<br>
        • Get regular checkups<br>
        • Manage stress levels<br><br>
        💪 <em>Small lifestyle changes can make a big difference!</em>`;
    } 
    else if (lowerMessage.includes('headache')) {
        return `<strong>Common Headache Information:</strong><br><br>
        🔹 <strong>Types:</strong> Tension, Migraine, Cluster<br><br>
        🔹 <strong>Common causes:</strong><br>
        • Stress and anxiety<br>
        • Dehydration<br>
        • Poor posture<br>
        • Eye strain<br>
        • Lack of sleep<br><br>
        🔹 <strong>Relief tips:</strong><br>
        • Rest in quiet, dark room<br>
        • Stay hydrated<br>
        • Apply cold/warm compress<br>
        • Gentle massage<br><br>
        <em>If headaches are severe or frequent, consult a doctor.</em>`;
    } 
    else if (lowerMessage.includes('cold') || lowerMessage.includes('flu')) {
        return `<strong>Common Cold vs Flu:</strong><br><br>
        <strong>Common Cold symptoms:</strong><br>
        • Runny/stuffy nose<br>
        • Sore throat<br>
        • Cough<br>
        • Mild fatigue<br><br>
        <strong>Flu symptoms:</strong><br>
        • High fever<br>
        • Body aches<br>
        • Severe fatigue<br>
        • Dry cough<br><br>
        💊 <em>Treatment:</em> Rest, fluids, over-the-counter medications. Consult doctor if symptoms worsen.`;
    }
    else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return "Hello! 😊 How can I assist you with your health questions today? Feel free to ask about symptoms, conditions, or general health information.";
    } 
    else if (lowerMessage.includes('thank')) {
        return "You're welcome! Stay healthy and feel free to ask if you have more questions. Take care! 🌟";
    } 
    else {
        return `I understand you're asking about: <strong>"${userMessage}"</strong><br><br>
        I'm currently in demo mode. Once connected to the backend, I'll be able to provide detailed information about:<br><br>
        • Symptoms and conditions<br>
        • First aid procedures<br>
        • Health tips<br>
        • Medicine information<br><br>
        Try asking about: <em>fever, burns, diabetes, headaches, cold, or flu!</em> 😊`;
    }
}

// Send message function
async function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    // Add user message
    addMessage(message, true);
    userInput.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Simulate network delay and get response
    setTimeout(async () => {
        hideTypingIndicator();
        const response = await getBotResponseFromAPI(message);
        addMessage(response, false);
    }, 1000 + Math.random() * 1000);
}

// Send quick message
function sendQuickMessage(message) {
    userInput.value = message;
    sendMessage();
}

// Handle Enter key press
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Focus input on load
window.onload = () => {
    userInput.focus();
    console.log('HealthBot Frontend Loaded Successfully! ✅');
    console.log('Backend connection will be established next...');
};