document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const themeLabel = document.getElementById("theme-label");
  const body = document.body;

  function applyTheme(theme) {
    if (theme === "dark") {
      body.classList.add("dark-mode");
      themeLabel.textContent = "🌙";
      themeToggle.checked = true;
    } else {
      body.classList.remove("dark-mode");
      themeLabel.textContent = "☀️";
      themeToggle.checked = false;
    }
  }

  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  themeToggle.addEventListener("change", () => {
    const newTheme = themeToggle.checked ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  });

  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const attachBtn = document.getElementById("attach-btn");
  const fileInput = document.getElementById("file-input");
  const filePreviewContainer = document.getElementById(
    "file-preview-container"
  );

  let selectedFile = null;

  attachBtn.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      selectedFile = fileInput.files[0];
      showFilePreview(selectedFile.name);
    }
  });

  // Main submission logic
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userMessage = userInput.value.trim();

    if (!userMessage && !selectedFile) {
      return;
    }

    const displayMessage = userMessage || `File: ${selectedFile.name}`;
    appendMessage("user", displayMessage);

    const fileToSend = selectedFile;
    const messageToSend = userMessage;

    userInput.value = "";
    clearFilePreview();

    const loadingMessage = appendMessage("loading", "Gemini is thinking...");

    try {
      let response;
      if (fileToSend) {
        const formData = new FormData();
        const { endpoint, fieldName } = getFileInfo(fileToSend.type);

        formData.append(fieldName, fileToSend);
        formData.append("prompt", messageToSend);

        response = await fetch(`/api/${endpoint}`, {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: messageToSend }),
        });
      }

      const result = await response.json();

      chatBox.removeChild(loadingMessage);

      if (response.ok && result.success) {
        appendMessage("bot", result.data);
      } else {
        appendMessage("error", result.message || "An unknown error occurred.");
      }
    } catch (error) {
      chatBox.removeChild(loadingMessage);
      appendMessage(
        "error",
        "Failed to connect to the server. Please try again."
      );
      console.error("Fetch Error:", error);
    }
  });

  function appendMessage(sender, text) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender);

    if (sender === "bot") {
      msgDiv.innerHTML = marked.parse(text);
    } else {
      msgDiv.textContent = text;
    }

    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgDiv;
  }

  function showFilePreview(fileName) {
    filePreviewContainer.innerHTML = `
            <div class="file-preview">
                <span>${fileName}</span>
                <button class="remove-file-btn" title="Remove file">×</button>
            </div>
        `;
    filePreviewContainer
      .querySelector(".remove-file-btn")
      .addEventListener("click", clearFilePreview);
  }

  function clearFilePreview() {
    selectedFile = null;
    fileInput.value = "";
    filePreviewContainer.innerHTML = "";
  }

  function getFileInfo(mimeType) {
    if (mimeType.startsWith("image/")) {
      return { endpoint: "image", fieldName: "image" };
    }
    if (mimeType.startsWith("audio/")) {
      return { endpoint: "audio", fieldName: "audio" };
    }
    if (
      [
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(mimeType)
    ) {
      return { endpoint: "document", fieldName: "document" };
    }
    // Fallback or throw error for unsupported types
    throw new Error("Unsupported file type");
  }
});
