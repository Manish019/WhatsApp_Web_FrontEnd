export const API = import.meta.env.VITE_API_URL;

export async function fetchConversations() {
  const res = await fetch(`${API}/api/conversations`);
  return res.json();
}

export async function fetchMessages(wa_id) {
  const res = await fetch(`${API}/api/conversations/${wa_id}/messages`);
  return res.json();
}

export async function sendMessage(wa_id, text, from = 'me') {
  const res = await fetch(`${API}/api/conversations/${wa_id}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, from })
  });
  return res.json();
}
