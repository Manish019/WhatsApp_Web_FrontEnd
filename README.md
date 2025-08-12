📌 Frontend Overview
The frontend is a WhatsApp Web Clone built with React.js that replicates the familiar WhatsApp Web chat interface.
It is designed for real-time messaging using Socket.IO and fetches chat history from the backend API.

✨ Features
Sidebar Chat List: Displays all active conversations with:

Contact number / name

Last message preview

Timestamp of the last message

Unread message count (green bubble)

Search Bar: Allows searching for contacts or starting a new chat.

## Chat Window:

Shows the selected contact’s name/number and status (e.g., "Online").

Displays full conversation history in a scrollable view.

Messages are styled differently for sent (green bubble) and received (white bubble).

Each message includes a timestamp and status ticks (✓✓ for read, ✓ for sent).

<img width="1366" height="605" alt="image" src="https://github.com/user-attachments/assets/61592973-0635-4c65-9254-0b47eff7a979" />

Message Input Box:

Type and send new messages instantly.

Messages are updated in real-time without page refresh.

🖼 UI Layout
Left Sidebar: Conversation list with search input at the top.

Right Panel: Active chat with messages aligned left (received) or right (sent).

Bottom Input Area: Text input and send button for quick messaging.

📌 Live Demo
Frontend: https://whats-app-web-front-end.vercel.app/


1. Frontend Setup (React + Vite)
Open a new terminal window and go into the frontend folder:

* Install dependencies:
* npm install
* npm run dev

2. Open in Browser
Visit http://localhost:5173 for the frontend.


