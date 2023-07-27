import express from 'express';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import session from 'express-session';
import { authenticate } from './middlewares/authenticate.js';
import publicRouter from './routes/public.route.js';
import privateRouter from './routes/private.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

const port = process.env.PORT;
const api = process.env.API;
const idp = process.env.IDP_ENDPOINT;
const callbackUrl = process.env.CALLBACK_URL;
const clientId = process.env.IDP_CLIENT_ID;

const StatusCodes = {
  BadGateway: 502,
  InvalidResponse: 424,
};

const get = async (url, accessToken, options = {}) => {

  if (accessToken) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    return {
      error: {
        code: StatusCodes.InvalidResponse,
        message: 'Invalid response from upstream',
        response,
      },
    };
  }

  try {
    return await response.json();
  } catch (error) {
    return {
      error: {
        code: StatusCodes.BadGateway,
        message: 'An error occured',
        response,
      },
    };
  }
};

app.use('/static',express.static(`${__dirname}/static/`));
app.use('/welcome', publicRouter);
app.use('/', privateRouter);

app.get('/callback', async (req, res) => {

  const code = req.query?.code;

  if (!code) {
    res.redirect('/');
  }

  const data = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: process.env.CLIENT_SECRET,
    code,
    redirect_uri: callbackUrl,
  });

  const response = await get(`${idp}/oauth2/token`, undefined, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: data,
  });

  const {
    access_token: accessToken,
    id_token: idToken,
  } = response;

  // console.log(`access token - \n${accessToken}`);
  // console.log(`ID token - \n${idToken}`);

  req.session.accessToken = accessToken;
  req.session.idToken = idToken;

  res.redirect('/');
});

app.get('/login', (req, res) => {
  res.redirect(`${idp}/oauth2/authorize?client_id=${clientId}&response_type=code&scope=email+openid+phone&redirect_uri=${encodeURIComponent(callbackUrl)}`);
});

app.get('/logout', (req, res) => {
  req.session.idToken = undefined;
  res.redirect('/welcome');
});

/* Authenticated endpoints */

app.use('/', authenticate);
app.use('/', privateRouter);

app.get('/api/score', async (req, res) => {

  const response = await get(`${api}/score`, req.session.accessToken);

  res.send(response);
});

app.get('/api/challenge', async (req, res) => {
  const response = await get(`${api}/Word/challenge`, req.session.accessToken);

  res.send(response);
});

app.get('/api/practice', async (req, res) => {
  const response = await get(`${api}/Word/pratice`, req.session.accessToken);

  res.send(response);
});

app.post('/api/score', async (req, res) => {

  const {
    time,
    username,
  } = req.body;

  // TODO: Sanitize input

  const response = await get(`${api}/score`, req.session.accessToken, {
    body: {
      time,
      username,
    },
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  res.send(response);
});

app.listen(port);