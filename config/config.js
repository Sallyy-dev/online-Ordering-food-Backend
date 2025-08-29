require('dotenv').config();

module.exports = {
ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
ACCESS_TOKEN_EXPIRES_IN: '1h',
REFRESH_TOKEN_EXPIRES_IN: '7d'
   
};