import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

const FavoritesContext = createContext({
  favorites: [],
  total: 0,
  addFavorite: async () => {},
  removeFavorite: async () => {},
  loading: true,
});

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .order("created_at", { ascending: false });

      if (!mounted) return;
      if (error) {
        console.error("Load favorites error:", error.message);
        setFavorites([]);
      } else {
        setFavorites(data ?? []);
      }
      setLoading(false);
    })();

    const channel = supabase
      .channel("favorites-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "favorites" },
        () => {
          supabase
            .from("favorites")
            .select("*")
            .then(({ data }) => {
              setFavorites(data ?? []);
            });
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const addFavorite = async ({ game_id, game_name, background_image }) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const tempFav = { game_id, game_name, background_image, user_id: user.id };
    setFavorites((prev) => [tempFav, ...prev]);

    const { error } = await supabase.from("favorites").insert({
      user_id: user.id,
      game_id,
      game_name,
      background_image,
    });

    if (error) {
      console.error("Insert favorite error:", error.message);
      setFavorites((prev) => prev.filter((f) => f.game_id !== game_id));
    }
  };

  const removeFavorite = async (game_id) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setFavorites((prev) => prev.filter((f) => f.game_id !== game_id));

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("game_id", game_id);

    if (error) {
      console.error("Remove favorite error:", error.message);
      const { data } = await supabase.from("favorites").select("*");
      setFavorites(data ?? []);
    }
  };

  const isFavorite = (game_id) => {
    return favorites.some((f) => String(f.game_id) === String(game_id));
  };

  const value = {
    favorites,
    total: favorites.length,
    addFavorite,
    removeFavorite,
    isFavorite,
    loading,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
