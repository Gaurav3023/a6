import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { favouritesAtom, searchHistoryAtom } from '../store';
import { getFavourites, getHistory } from '../lib/userData'; 

const RouteGuard = ({ children }) => {
  const router = useRouter();
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  async function updateAtoms() {
    setFavouritesList(await getFavourites());
    setSearchHistory(await getHistory());
  }

  useEffect(() => {
    const PUBLIC_PATHS = ['/', '/login', '/register']; 

    if (!localStorage.getItem('token') && !PUBLIC_PATHS.includes(router.pathname)) {
      router.push('/login');
    }

    updateAtoms();
  }, []);

  return children;
};

export default RouteGuard;
