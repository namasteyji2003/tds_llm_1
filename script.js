async function sendMessage() {
  const inputField = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");
  const userMessage = inputField.value.trim();
  if (!userMessage) return;

  appendMessage(userMessage, "user-message");
  inputField.value = "";

  const botMsgEl = appendMessage("...", "bot-message");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userMessage })
    });

    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }

    const data = await response.json();
    const botText = data.text || "⚠️ No response received";
    typeText(botMsgEl, botText);
  } catch (err) {
    botMsgEl.textContent = "❌ " + err.message;
  }
}

// Helper to append message bubble
function appendMessage(text, className) {
  const chatBox = document.getElementById("chatBox");
  const msgEl = document.createElement("div");
  msgEl.className = "message " + className;
  msgEl.textContent = text;
  chatBox.appendChild(msgEl);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msgEl;
}

// Typing animation effect
function typeText(element, text, speed = 10) {
  element.textContent = "";
  let i = 0;
  function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  }
  typing();
}