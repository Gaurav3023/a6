const fetch = require('node-fetch');

function setToken(token) {
  localStorage.setItem('token', token);
}

function getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null; 
  }
  
function removeToken() {
  localStorage.removeItem('token');
}

function readToken() {
  const token = getToken();
  if (token) {
    return token;
  } else {
    return null;
  }
}

function isAuthenticated() {
  return getToken() !== null;
}

async function authenticateUser(user, password) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user, password })
    });
    if (response.status === 200) {
      const data = await response.json();
      setToken(data.token);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

async function registerUser(user, password, password2) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user, password, password2 })
    });
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

module.exports = {
  setToken,
  getToken,
  removeToken,
  readToken,
  isAuthenticated,
  authenticateUser,
  registerUser
};
