// chat.js
import { firebaseReady } from './firebase.js';
import { setChatUIEnabled, appendMessage } from './ui.js';
import { loadConfig } from './configLoader.js';

let currentHistory = [];

function getHistoryKey(email) {
    return `chat_history_${email}`;
}

async function saveChatHistory(email, history) {
    const { db } = await firebaseReady;
    await db.collection('chat_histories').doc(email).set({ messages: history });
}

async function loadChatHistory(email) {
    const { db } = await firebaseReady;
    const doc = await db.collection('chat_histories').doc(email).get();
    if (doc.exists && doc.data().messages) {
        return doc.data().messages;
    }
    return [];
}

async function deleteChatHistory(email) {
    const { db } = await firebaseReady;
    await db.collection('chat_histories').doc(email).delete();
}

function setCurrentHistory(history) {
    currentHistory = history;
}

function getCurrentHistory() {
    return currentHistory;
}

async function appendMessageAndSave(sender, message, userEmail) {
    await appendMessage(sender, message);
    if (userEmail) {
        currentHistory.push({ sender, message });
        await saveChatHistory(userEmail, currentHistory);
    }
}

async function sendMessageToChatbot(user, message) {
    if (!user || !user.email) {
        appendMessage('System', 'User not authenticated.');
        return;
    }
    setChatUIEnabled(false);
    await appendMessageAndSave('You', message, user.email);
    const config = await loadConfig();
    const payload = {
        output_type: 'chat',
        input_type: 'chat',
        input_value: message,
        session_id: user.email
    };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': config.LANGFLOW_API_KEY
        },
        body: JSON.stringify(payload)
    };
    fetch(config.CHATBOT_API_URL, options)
        .then(response => response.json())
        .then(data => {
            let botReply = '';
            try {
                botReply = data?.outputs?.[0]?.outputs?.[0]?.results?.message?.text
                    || data?.outputs?.[0]?.outputs?.[0]?.message?.message
                    || '[No message from bot]';
            } catch (e) {
                botReply = '[Error parsing bot reply]';
            }
            appendMessageAndSave('Bot', botReply, user.email);
        })
        .catch(err => {
            appendMessageAndSave('Bot', 'Error: ' + err.message, user.email);
        })
        .finally(() => setChatUIEnabled(true));
}

export {
    getHistoryKey,
    saveChatHistory,
    loadChatHistory,
    deleteChatHistory,
    setCurrentHistory,
    getCurrentHistory,
    appendMessageAndSave,
    sendMessageToChatbot
}; 