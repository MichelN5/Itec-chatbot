// ui.js
const authDiv = document.getElementById('auth');
const chatbotDiv = document.getElementById('chatbot');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('sendBtn');
const chatHistory = document.getElementById('chat-history');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const clearAstraMemoryBtn = document.getElementById('clearAstraMemoryBtn');

function showAuth() {
    authDiv.style.display = 'block';
    chatbotDiv.style.display = 'none';
}

function showChatbot() {
    authDiv.style.display = 'none';
    chatbotDiv.style.display = 'block';
}

function setChatUIEnabled(enabled) {
    chatInput.disabled = !enabled;
    sendBtn.disabled = !enabled;
}

async function appendMessage(sender, message) {
    const msgDiv = document.createElement('div');
    msgDiv.style.margin = '0.5em 0';
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatHistory.appendChild(msgDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function clearChatHistoryUI() {
    chatHistory.innerHTML = '';
}

function setClearHistoryBtn(enabled, handler) {
    if (clearHistoryBtn) {
        clearHistoryBtn.disabled = !enabled;
        clearHistoryBtn.onclick = enabled ? handler : null;
    }
}

function setClearAstraMemoryBtn(enabled, handler) {
    if (clearAstraMemoryBtn) {
        clearAstraMemoryBtn.disabled = !enabled;
        clearAstraMemoryBtn.onclick = enabled ? handler : null;
    }
}

export {
    showAuth,
    showChatbot,
    setChatUIEnabled,
    appendMessage,
    clearChatHistoryUI,
    setClearHistoryBtn,
    setClearAstraMemoryBtn,
    chatInput,
    sendBtn,
    chatHistory
}; 