import { useEffect, useState } from "react";
import "../../allcss/ChatPage.css";
import { supabase } from "../../supabase/supabaseClient";
import { useSession } from "../../context/SessionProvider";

export default function ChatPage() {
  const { user } = useSession();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("id,user_id,content,created_at")
        .order("created_at", { ascending: true });

      if (!ignore) {
        if (error) {
          console.error("Load messages error:", error);
        } else {
          setMessages(data || []);
        }
        setLoading(false);
      }
    }

    load();

    const channel = supabase
      .channel("realtime-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((curr) => [...curr, payload.new]);
        }
      )
      .subscribe();

    return () => {
      ignore = true;
      supabase.removeChannel(channel);
    };
  }, []);

  const send = async (e) => {
    e.preventDefault();
    if (!user) return;
    const content = text.trim();
    if (!content) return;

    const { error } = await supabase.from("messages").insert({
      user_id: user.id,
      content,
    });

    if (error) {
      console.error("Insert message error:", error);
      return;
    }
    setText("");
  };

  return (
    <div className="container py-4 chat-container">
      <h2 className="mb-3">Realtime Chat</h2>

      {!user && (
        <div className="alert alert-warning">
          Devi essere loggato per scrivere nella chat.
        </div>
      )}

      <div className="border rounded p-3 mb-3 chat-messages-area">
        {loading && <p className="text-muted">Caricamento…</p>}
        {!loading && messages.length === 0 && (
          <p className="text-muted">Nessun messaggio.</p>
        )}

        {messages.map((m) => (
          <div key={m.id} className="mb-2">
            <div className="small text-secondary">
              <strong>
                {m.user_id === user?.id ? "Tu" : m.user_id.slice(0, 8)}
              </strong>{" "}
              · {new Date(m.created_at).toLocaleString()}
            </div>
            <div>{m.content}</div>
          </div>
        ))}
      </div>

      <form onSubmit={send} className="d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder={user ? "Scrivi un messaggio…" : "Accedi per scrivere…"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!user}
          id="chat-input"
        />
        <button className="btn btn-primary" disabled={!user || !text.trim()}>
          Invia
        </button>
      </form>
    </div>
  );
}
