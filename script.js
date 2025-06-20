const API_BASE = 'https://passionate-surprise.up.railway.app';
const API_KEY = 'myUltraSecretKey2025'; // ✅ This is your actual API key

const guildInput = document.getElementById("guild-id-input");
const connectBtn = document.getElementById("connect-btn");
const chatLog = document.getElementById("chat-log");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const channelTitle = document.getElementById("channel-title");

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeModal = document.getElementById("close-modal");

let currentGuild = null;
let currentChannel = null;
let chatMemory = JSON.parse(localStorage.getItem("chatMemory") || "{}");

function updateTitle(title) {
  channelTitle.textContent = `Channel • ${title}`;
  document.title = `Channel • ${title}`;
}

function addMessage(author, content) {
  const msg = document.createElement("div");
  msg.className = "chat-message";
  msg.innerHTML = `<span>${author}:</span> ${content}`;
  chatLog.appendChild(msg);
  chatLog.scrollTop = chatLog.scrollHeight;

  if (!currentGuild) return;
  if (!chatMemory[currentGuild]) chatMemory[currentGuild] = [];
  chatMemory[currentGuild].push({ author, content });
  localStorage.setItem("chatMemory", JSON.stringify(chatMemory));
}

function loadMemory(guildId) {
  chatLog.innerHTML = "";
  const logs = chatMemory[guildId] || [];
  logs.forEach(({ author, content }) => {
    addMessage(author, content);
  });
}

// 🔌 Fetch #1: Connect to guild
connectBtn.onclick = () => {
  const id = guildInput.value.trim();
  if (!id) return;

  fetch(`${API_BASE}/connect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': API_KEY
    },
    body: JSON.stringify({ guildId: id })
  })
    .then(res => res.json())
    .then(data => {
      if (!data.guild || !data.channels) throw new Error("Invalid response");
      currentGuild = id;
      currentChannel = data.channels[0]?.id;
      updateTitle(data.guild);
      loadMemory(id);
      addMessage("System", `🔗 Connected to ${data.guild}`);
      addMessage("System", `📺 Default channel: #${data.channels[0]?.name || 'unknown'}`);
    })
    .catch(err => {
      console.error(err);
      addMessage("Error", "❌ Connection failed.");
    });
};

// 📤 Fetch #2: Send message to current channel
sendBtn.onclick = () => {
  const msg = messageInput.value.trim();
  if (!msg || !currentGuild || !currentChannel) return;

  addMessage("You", msg);
  messageInput.value = "";

  fetch(`${API_BASE}/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': API_KEY
    },
    body: JSON.stringify({ message: msg })
  })
    .catch(err => {
      console.error(err);
      addMessage("Error", "❌ Message failed.");
    });
};

// 📋 UI: Open side modals
document.getElementById("open-members").onclick = () =>
  showModal("👥 Member list coming soon...");
document.getElementById("open-roles").onclick = () =>
  showModal("🎭 Role manager not implemented yet.");
document.getElementById("open-history").onclick = () => {
  const logs = chatMemory[currentGuild] || [];
  showModal(`<h3>📜 Conversation History</h3><ul>${
    logs.map(m => `<li><b>${m.author}:</b> ${m.content}</li>`).join("")
  }</ul>`);
};

function showModal(html) {
  modal.classList.remove("hidden");
  modalBody.innerHTML = html;
}
closeModal.onclick = () => modal.classList.add("hidden");

// ✅ Startup indicator
console.log("✅ script.js loaded and ready.");
