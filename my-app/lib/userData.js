// Include necessary dependencies
const fetch = require('node-fetch');
const { getToken } = require('./authenticate');

async function makeAuthenticatedRequest(url, method) {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No token found');
    }
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${token}`
      }
    });
    if (response.status === 200) {
      return await response.json();
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

async function addToFavourites(id) {
  return await makeAuthenticatedRequest(`${process.env.NEXT_PUBLIC_API_URL}/favourites/${id}`, 'PUT');
}

async function removeFromFavourites(id) {
  return await makeAuthenticatedRequest(`${process.env.NEXT_PUBLIC_API_URL}/favourites/${id}`, 'DELETE');
}

async function getFavourites() {
  return await makeAuthenticatedRequest(`${process.env.NEXT_PUBLIC_API_URL}/favourites`, 'GET');
}

async function addToHistory(id) {
  return await makeAuthenticatedRequest(`${process.env.NEXT_PUBLIC_API_URL}/history/${id}`, 'PUT');
}

async function removeFromHistory(id) {
  return await makeAuthenticatedRequest(`${process.env.NEXT_PUBLIC_API_URL}/history/${id}`, 'DELETE');
}

async function getHistory() {
  return await makeAuthenticatedRequest(`${process.env.NEXT_PUBLIC_API_URL}/history`, 'GET');
}

module.exports = {
  addToFavourites,
  removeFromFavourites,
  getFavourites,
  addToHistory,
  removeFromHistory,
  getHistory
};
