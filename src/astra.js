// astra.js
import { loadConfig } from './configLoader.js';

async function clearAstraMemory(email) {
    try {
        const config = await loadConfig();
        const response = await fetch(config.ASTRA_CLEAR_MEMORY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (response.ok) {
            alert(data.message);
        } else {
            alert('Failed to clear chatbot memory: ' + (data.error || response.statusText));
        }
    } catch (error) {
        alert('Error clearing chatbot memory: ' + error.message);
    }
}

export { clearAstraMemory }; 