// configLoader.js
let configCache = null;

export async function loadConfig() {
    if (configCache) return configCache;
    const response = await fetch('src/config.json');
    if (!response.ok) throw new Error('Failed to load config.json');
    configCache = await response.json();
    return configCache;
} 