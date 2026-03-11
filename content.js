console.log("Blip AI Helper iniciado");

function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

function getConversationMessages() {
  const messages = [];
  const nodes = document.querySelectorAll("div[role='row'], div[class*='message']");

  nodes.forEach(node => {
    const text = node.innerText?.trim();
    if (text) messages.push(text);
  });

  return messages;
}

async function generateSuggestions(messages) {
  const lastMessage = messages[messages.length - 1] || "";

  return [
    `Entendi sua mensagem: "${lastMessage}". Pode detalhar mais?`,
    `Vou verificar essa informação para você agora.`,
    `Obrigado pelo contato! Já estou analisando sua solicitação.`
  ];
}

function insertText(text) {
  const input =
    document.querySelector("div[contenteditable='true']") ||
    document.querySelector("textarea");

  if (!input) return;

  input.focus();
  document.execCommand("insertText", false, text);
}

function renderPanel(suggestions) {
  let panel = document.getElementById("blip-ai-panel");

  if (!panel) {
    panel = document.createElement("div");
    panel.id = "blip-ai-panel";
    document.body.appendChild(panel);
  }

  panel.innerHTML = "<h3>Sugestões</h3>";

  suggestions.forEach(text => {
    const btn = document.createElement("button");
    btn.innerText = text;
    btn.onclick = () => insertText(text);
    panel.appendChild(btn);
  });
}

const handleMutation = debounce(async () => {
  const messages = getConversationMessages();
  if (!messages.length) return;

  const suggestions = await generateSuggestions(messages);
  renderPanel(suggestions);
}, 1000);

const observer = new MutationObserver(handleMutation);
observer.observe(document.body, { childList: true, subtree: true });
