// main.js
import './firebase.js';
import { setupAuthHandlers } from './auth.js';
import {
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
} from './ui.js';
import {
    loadChatHistory,
    deleteChatHistory,
    setCurrentHistory,
    getCurrentHistory,
    sendMessageToChatbot
} from './chat.js';
import { clearAstraMemory } from './astra.js';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('Service Worker Registered!', reg))
            .catch(err => console.error('Service Worker Error:', err));
    });
}

function handleSend(user) {
    const message = chatInput.value.trim();
    if (!message) return;
    chatInput.value = '';
    sendMessageToChatbot(user, message);
}

setupAuthHandlers(async user => {
    if (user) {
        showChatbot();
        clearChatHistoryUI();
        // Load and display history from Firestore
        const history = await loadChatHistory(user.email);
        setCurrentHistory(history);
        history.forEach(msg => {
            appendMessage(msg.sender, msg.message);
        });
        // Attach event listeners
        sendBtn.onclick = () => handleSend(user);
        chatInput.onkeydown = e => {
            if (e.key === 'Enter') handleSend(user);
        };
        setClearHistoryBtn(true, async () => {
            await deleteChatHistory(user.email);
            clearChatHistoryUI();
            setCurrentHistory([]);
        });
        setClearAstraMemoryBtn(true, async () => {
            await clearAstraMemory(user.email);
        });
    } else {
        showAuth();
        clearChatHistoryUI();
        sendBtn.onclick = null;
        chatInput.onkeydown = null;
        setCurrentHistory([]);
        setClearHistoryBtn(false, null);
        setClearAstraMemoryBtn(false, null);
    }
}); 