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

connectBtn.onclick = () => {
  const id = guildInput.value.trim();
  if (!id) return;

  currentGuild = id;
  updateTitle(`Guild ${id}`);
  loadMemory(id);

  // Simulate loading channel — replace with fetch to backend later
  addMessage("System", `🔗 Connected to guild ${id}`);
};

sendBtn.onclick = () => {
  const msg = messageInput.value.trim();
  if (!msg || !currentGuild) return;
  addMessage("You", msg);
  messageInput.value = "";

  // Later: Send to backend with fetch
};

// Modal logic for sidebar actions
document.getElementById("open-members").onclick = () => showModal("Member list loading...");
document.getElementById("open-roles").onclick = () => showModal("Role manager coming soon...");
document.getElementById("open-history").onclick = () => {
  const logs = chatMemory[currentGuild] || [];
  showModal(`<h3>Conversation History</h3><ul>${
    logs.map(m => `<li><b>${m.author}:</b> ${m.content}</li>`).join("")
  }</ul>`);
};

function showModal(html) {
  modal.classList.remove("hidden");
  modalBody.innerHTML = html;
}
closeModal.onclick = () => modal.classList.add("hidden");
