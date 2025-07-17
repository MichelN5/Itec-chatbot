# PWA Chatbot

A modern, responsive Progressive Web App (PWA) chatbot interface with a beautiful dark UI, built for seamless user experience and easy deployment.

## Features

- ⚡ Progressive Web App (PWA) support
- 💬 Chatbot interface with smooth animations
- 🌙 Professional dark mode design
- 📱 Mobile-friendly and fully responsive
- 🔒 Authentication-ready (see `src/auth.js`)
- 🔥 Firebase integration (see `src/firebase.js`)
- 🛠️ Easily customizable styles (`styles.css`)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the app locally:**
   ```bash
   node server.js
   ```
   Then open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build & Deploy:**
   - The app is ready to be deployed as a static site or Node.js server.

## Project Structure

```
/src         # App logic (chat, auth, UI, config)
server.js    # Node.js server
index.html   # Main HTML file
styles.css   # Modern dark UI styles
manifest.json# PWA manifest
service-worker.js # Offline support
/icons       # App icons
```

## License

MIT 