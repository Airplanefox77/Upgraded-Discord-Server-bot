let socket;

function connect() {
  const guild = document.getElementById('guild').value.trim();
  const channel = document.getElementById('channel').value.trim();

  if (!guild || !channel) {
    alert('Please enter both Guild ID and Channel ID');
    return;
  }

  socket = io('http://localhost:3001'); // CHANGE THIS TO YOUR DEPLOYED BACKEND URL

  socket.emit('connect');

  fetch('http://localhost:3001/connect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ guildId: guild, channelId: channel })
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) alert(data.error);
    else alert(data.message);
  });

  socket.on('newMessage', (msg) => {
    const box = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.className = 'message them';
    div.innerHTML = `<strong>${msg.author}</strong>: ${msg.content}`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  });

  socket.on('errorMessage', (err) => {
    alert('Error: ' + err);
  });
}

function send() {
  const input = document.getElementById('msg');
  const text = input.value.trim();
  if (!text || !socket) return;

  socket.emit('sendMessage', text);

  const box = document.getElementById('chat-box');
  const div = document.createElement('div');
  div.className = 'message you';
  div.textContent = `You: ${text}`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;

  input.value = '';
}
