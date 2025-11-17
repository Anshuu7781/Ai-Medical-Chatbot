// Healthcare Chatbot - Frontend Script
// Your Backend URL: https://healthbot-hc9x.onrender.com

const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');

// Your Render backend URL
const API_ENDPOINT = 'https://healthbot-hc9x.onrender.com/api/chat';

console.log('✅ HealthBot Script Loaded');
console.log('🔗 Backend API:', API_ENDPOINT);

function getCurrentTime() {
    return new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

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

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator active';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

async function getBotResponseFromAPI(userMessage) {
    try {
        console.log('📤 Sending to backend:', userMessage);
        
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage })
        });
        
        console.log('📥 Status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Backend response received');
        
        return data.response;
        
    } catch (error) {
        console.error('❌ Error:', error);
        
        return `<strong>⚠️ Connection Error</strong><br><br>
                Cannot connect to backend server.<br><br>
                <strong>Possible reasons:</strong><br>
                • Backend is starting up (wait 30-60 sec)<br>
                • Backend has an error<br>
                • Network issue<br><br>
                <em>Error: ${error.message}</em>`;
    }
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    addMessage(message, true);
    userInput.value = '';

    showTypingIndicator();

    const response = await getBotResponseFromAPI(message);
    
    hideTypingIndicator();
    addMessage(response, false);
}

function sendQuickMessage(message) {
    userInput.value = message;
    sendMessage();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

window.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Page ready!');
    
    if (userInput) {
        userInput.focus();
    }
    
    window.sendMessage = sendMessage;
    window.sendQuickMessage = sendQuickMessage;
    window.handleKeyPress = handleKeyPress;
});
