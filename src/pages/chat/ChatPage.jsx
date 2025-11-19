import { useEffect, useState } from "react";
import "../../allcss/ChatPage.css";
import { supabase } from "../../supabase/supabaseClient";
import { useSession } from "../../context/SessionProvider";

export default function ChatPage() {
  const { user } = useSession();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [userProfiles, setUserProfiles] = useState({});

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
          // Carica i profili degli utenti
          if (data && data.length > 0) {
            const userIds = [...new Set(data.map((m) => m.user_id))];
            const { data: profiles } = await supabase
              .from("profiles")
              .select("id, username")
              .in("id", userIds);

            if (profiles) {
              const profilesMap = {};
              profiles.forEach((p) => {
                profilesMap[p.id] = p.username || "Utente";
              });
              setUserProfiles(profilesMap);
            }
          }
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
        async (payload) => {
          setMessages((curr) => [...curr, payload.new]);
          // Carica il profilo del nuovo utente se non presente
          if (!userProfiles[payload.new.user_id]) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("id, username")
              .eq("id", payload.new.user_id)
              .single();

            if (profile) {
              setUserProfiles((prev) => ({
                ...prev,
                [profile.id]: profile.username || "Utente",
              }));
            }
          }
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
        {loading && <p className="text-gold-dark">Caricamento…</p>}
        {!loading && messages.length === 0 && (
          <p className="text-gold-dark">Nessun messaggio.</p>
        )}

        {messages.map((m) => (
          <div key={m.id} className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <strong className="small text-gold-dark">
                {m.user_id === user?.id
                  ? "Tu"
                  : userProfiles[m.user_id] || "Utente"}
              </strong>
              <span className="small text-gold-dark" style={{ opacity: 0.8 }}>
                {new Date(m.created_at).toLocaleString()}
              </span>
            </div>
            <div className="text-gold-dark">{m.content}</div>
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
