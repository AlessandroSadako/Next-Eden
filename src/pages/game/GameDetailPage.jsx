import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetchSolution from "../../hooks/useFetchSolution";
import { supabase } from "../../supabase/supabaseClient";
import { useSession } from "../../context/SessionProvider";
import FavoriteButton from "../../components/FavoriteButton";
import "../../allcss/GameDetailPage.css";

export default function GameDetailPage() {
  const { id } = useParams();
  const { user } = useSession();
  const RAWG_KEY = import.meta.env.VITE_RAWG_KEY;
  const initialUrl = `https://api.rawg.io/api/games/${id}?key=${RAWG_KEY}`;
  const { data: game, loading, error } = useFetchSolution(initialUrl);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loadingChat, setLoadingChat] = useState(true);
  const [userProfiles, setUserProfiles] = useState({});

  useEffect(() => {
    let ignore = false;

    async function loadMessages() {
      setLoadingChat(true);
      const { data, error } = await supabase
        .from("messages")
        .select("id,user_id,content,created_at")
        .eq("game_id", id)
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
        setLoadingChat(false);
      }
    }

    loadMessages();

    const channel = supabase
      .channel(`game-chat-${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `game_id=eq.${id}`,
        },
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
  }, [id]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!user) return;
    const content = text.trim();
    if (!content) return;

    const { error } = await supabase.from("messages").insert({
      user_id: user.id,
      game_id: id,
      content,
    });

    if (error) {
      console.error("Insert message error:", error);
      return;
    }
    setText("");
  };

  if (loading)
    return <div className="container py-4 text-gold-dark">Caricamento…</div>;
  if (error) return <div className="container py-4 text-danger">{error}</div>;
  if (!game) return null;

  return (
    <div className="container-fluid py-4">
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="card shadow">
            <div className="position-relative">
              <img
                src={game.background_image}
                className="card-img-top game-detail-image"
                alt={game.name}
              />
              {/* Logo in alto a destra */}
              <img
                src="/nextedenlogo.png"
                alt="Next Eden Logo"
                className="game-detail-logo"
              />
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 className="card-title mb-0">{game.name}</h2>
                <FavoriteButton game={game} />
              </div>
              <p className="text-gold-dark mb-2">{game.released}</p>
              <div dangerouslySetInnerHTML={{ __html: game.description }} />
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card shadow">
            <div className="card-header custom-chat-title">
              <h5 className="mb-0">
                <img
                  className="mela-custom-chat"
                  src="/public/melasingola.png"
                  alt=""
                />{" "}
                Chat sul gioco
              </h5>
            </div>
            <div className="card-body d-flex flex-column p-0">
              {!user && (
                <div className="alert alert-warning m-3 mb-0">
                  Devi essere loggato per scrivere nella chat.
                </div>
              )}

              <div className="flex-grow-1 p-3 game-detail-chat-area">
                {loadingChat && (
                  <p className="text-gold-dark">Caricamento chat…</p>
                )}
                {!loadingChat && messages.length === 0 && (
                  <p className="text-gold-dark">
                    Nessun messaggio. Inizia la conversazione!
                  </p>
                )}

                {messages.map((m) => (
                  <div key={m.id} className="mb-3">
                    <div className="bg-chat-custom text-gold-dark">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong className="small">
                          {m.user_id === user?.id
                            ? "Tu"
                            : userProfiles[m.user_id] || "Utente"}
                        </strong>
                        <span
                          className="small text-gold-dark"
                          style={{ opacity: 0.8 }}
                        >
                          {new Date(m.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div>{m.content}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border-top">
                <form onSubmit={sendMessage} className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={
                      user ? "Scrivi un messaggio…" : "Accedi per scrivere…"
                    }
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={!user}
                  />
                  <button
                    className="btn btn-primary"
                    disabled={!user || !text.trim()}
                  >
                    Invia
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
