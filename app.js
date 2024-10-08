let currentUser = null;
let messages = [];
let users = [];

// Element referensi
const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message-input');
const messagesContainer = document.getElementById('messages');
const usersContainer = document.getElementById('users');
const chatHeader = document.getElementById('chat-header');

// Membuat koneksi WebSocket
const ws = new WebSocket('ws://192.168.79.126:8080');  // Ganti <alamat_IP> dengan IP server kamu

// Fungsi untuk render pesan
function renderMessages() {
    messagesContainer.innerHTML = '';
    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(msg.username === currentUser ? 'my-message' : 'other-message');
        messageElement.textContent = `${msg.username}: ${msg.text}`;
        messagesContainer.appendChild(messageElement);
    });
}

// Fungsi untuk render daftar user aktif
function renderUsers() {
    usersContainer.innerHTML = '';
    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.classList.add('user');
        userElement.textContent = user;
        usersContainer.appendChild(userElement);
    });
}

// Menerima pesan dari server WebSocket
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'message') {
        messages.push({ username: data.username, text: data.text });
        renderMessages();
    } else if (data.type === 'updateUsers') {
        users = data.users;
        renderUsers();
    }
};

// Fungsi login
document.getElementById('loginBtn').addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        currentUser = username;
        chatHeader.textContent = `Chat as ${username}`;
        ws.send(JSON.stringify({ type: 'login', username }));

        loginScreen.style.display = 'none';
        chatScreen.style.display = 'block';
    }
});

// Fungsi kirim pesan
document.getElementById('sendBtn').addEventListener('click', () => {
    const messageText = messageInput.value.trim();
    if (messageText) {
        ws.send(JSON.stringify({ type: 'message', text: messageText }));
        messageInput.value = '';
    }
});
