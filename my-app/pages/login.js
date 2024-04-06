import { useState } from 'react';
import { useRouter } from 'next/router';
import { authenticateUser, getFavourites, getHistory } from '../lib/authenticate'; 
import { useAtom } from 'jotai';
import { favouritesAtom, searchHistoryAtom } from '../store';

export default function Login() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState('');
  const router = useRouter();
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom); 
  const [, setSearchHistory] = useAtom(searchHistoryAtom);

  async function updateAtoms() {
    setFavouritesList(await getFavourites()); 
    setSearchHistory(await getHistory());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const success = await authenticateUser(user, password);
    if (success) {
      await updateAtoms();
      router.push('/');
    } else {
      setAlert('Invalid username or password');
    }
  }

  const togglePasswordVisibility = (inputId) => {
    const passwordInput = document.getElementById(inputId);
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <h1 className="mb-4">Login</h1>
          {alert && <div className="alert alert-danger" role="alert">{alert}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input type="text" className="form-control" placeholder="Username" value={user} onChange={(e) => setUser(e.target.value)} />
            </div>
            <div className="mb-3 position-relative">
              <input type="password" className="form-control" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="btn btn-outline-secondary position-absolute top-50 end-0 translate-middle-y" onClick={() => togglePasswordVisibility('password')}>
                Show
              </button>
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
