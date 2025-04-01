const fetch = require('node-fetch');

const clientId = '570a68bc7060457cad8398d516a0b5e7';
const clientSecret = '2fc540e6df00481e835262859197876a';

const getToken = async () => {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'grant_type': 'client_credentials'
        })
    });

    const data = await response.json();
    return data.access_token;
};