(() => {
  const SCRIPT = Array.from(document.scripts).find(s => /helpchat(\.js)?(\?|$)/.test(s.src));
  const SITE_KEY = SCRIPT?.dataset.sitekey || '';
  const API_BASE = SCRIPT?.dataset.apiBase || (new URL(SCRIPT.src)).origin;
  const LOCALE = navigator.language || 'en';
  const ORIGIN = window.location.origin;

  if (!SITE_KEY) { console.warn('[helpchat] missing data-sitekey'); return; }

  let token = null, tokenExp = 0, cfg = null, open = false, lastBotId = 0;

  const host = document.createElement('div');
  const shadow = host.attachShadow({ mode: 'open' });
  document.body.appendChild(host);

  const style = document.createElement('style');
  style.textContent = `
:host { all: initial; }
* { box-sizing: border-box; font-family: sans-serif; }
.hc-launcher { position: fixed; right:16px; bottom:16px; width:56px; height:56px; border-radius:50%; border:none; background:#111; color:#fff; }
.hc-panel { position:fixed; right:16px; bottom:84px; width:360px; max-width:90vw; height:520px; background:#fff; border-radius:12px; border:1px solid #ddd; display:none; flex-direction:column; }
.hc-panel.open { display:flex; }
.hc-header { padding:12px; background:#111; color:#fff; display:flex; justify-content:space-between; }
.hc-messages { flex:1; padding:12px; overflow:auto; }
.hc-msg { margin:8px 0; }
.hc-bubble { display:inline-block; padding:8px 10px; border-radius:10px; max-width:90%; white-space:pre-wrap; }
.hc-bubble.user { background:#111; color:#fff; }
.hc-bubble.bot { background:#f3f4f6; }
.hc-input { display:flex; gap:8px; padding:12px; border-top:1px solid #ddd; }
.hc-input input { flex:1; padding:10px; border:1px solid #ccc; border-radius:8px; }
.hc-input button { padding:10px 12px; border:none; border-radius:8px; background:#111; color:#fff; }
.hc-powered { font-size:12px; color:#888; padding:0 12px 12px; }
.hc-feedback { margin-top:6px; }
.hc-thumb { background:none; border:none; }
`;
  shadow.appendChild(style);

  const panel = document.createElement('div'); panel.className = 'hc-panel';
  const header = document.createElement('div'); header.className = 'hc-header';
  const title = document.createElement('div'); title.textContent = 'Help';
  const close = document.createElement('button'); close.textContent = '✕';
  header.append(title, close);
  const messages = document.createElement('div'); messages.className = 'hc-messages';
  const inputRow = document.createElement('div'); inputRow.className = 'hc-input';
  const input = document.createElement('input'); input.placeholder = 'Type a message…';
  const send = document.createElement('button'); send.textContent = 'Send';
  inputRow.append(input, send);
  const powered = document.createElement('div'); powered.className = 'hc-powered'; powered.textContent = 'Powered by HelpChat';
  panel.append(header, messages, inputRow, powered);

  const launcher = document.createElement('button'); launcher.className = 'hc-launcher'; launcher.textContent = '💬';
  shadow.append(panel, launcher);

  function show() { panel.classList.add('open'); open = true; input.focus(); }
  function hide() { panel.classList.remove('open'); open = false; }
  launcher.onclick = () => open ? hide() : show();
  close.onclick = hide;
  send.onclick = () => {
    const msg = input.value.trim();
    if (!msg) return;
    addMessage(msg, 'user');
    input.value = '';
    setTimeout(() => addMessage("Thanks for your message!", 'bot'), 500);
  };

  function addMessage(text, who) {
    const row = document.createElement('div'); row.className = `hc-msg ${who}`;
    const bubble = document.createElement('div'); bubble.className = `hc-bubble ${who}`; bubble.innerText = text;
    row.appendChild(bubble);
    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
  }
})();
