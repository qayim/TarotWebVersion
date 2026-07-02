import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'tarot-favorite-ids';

function loadFavorites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ids: [], positions: {} };

    const parsed = JSON.parse(stored);

    if (Array.isArray(parsed)) {
      return {
        ids: parsed,
        positions: Object.fromEntries(parsed.map((id) => [id, 'upright'])),
      };
    }

    return {
      ids: parsed.ids ?? [],
      positions: parsed.positions ?? {},
    };
  } catch {
    return { ids: [], positions: {} };
  }
}

export const FavoritesContext = createContext({
  ids: [],
  positions: {},
  getPosition: () => 'upright',
  setPosition: () => {},
  addFavorite: () => {},
  removeFavorite: () => {},
});

export default function FavoritesProvider({ children }) {
  const initial = loadFavorites();
  const [ids, setIds] = useState(initial.ids);
  const [positions, setPositions] = useState(initial.positions);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ids, positions }));
  }, [ids, positions]);

  function getPosition(id) {
    return positions[id] ?? 'upright';
  }

  function setPosition(id, position) {
    setPositions((current) => ({ ...current, [id]: position }));
  }

  function addFavorite(id) {
    setIds((current) => (current.includes(id) ? current : [...current, id]));
    setPositions((current) => (current[id] ? current : { ...current, [id]: 'upright' }));
  }

  function removeFavorite(id) {
    setIds((current) => current.filter((cardId) => cardId !== id));
    setPositions((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  const value = useMemo(
    () => ({
      ids,
      positions,
      getPosition,
      setPosition,
      addFavorite,
      removeFavorite,
    }),
    [ids, positions]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
