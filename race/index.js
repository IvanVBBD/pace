import express from 'express';
import jwt from 'jsonwebtoken';
import fetch from "node-fetch";
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import session from 'express-session';
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
  cookie: { secure: true },
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

const get = async (url, req, options = {}) => {

  if (req?.session?.accessToken) {
    options.headers.Authorization = `Bearer ${req.session.accessToken}`;
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

app.get('/', (req, res) => {
  res.send(`<a href="/api/score">score</a><br/><a href="/api/challenge">challenge</a><br/><a href="/api/practice">practice</a><br/><a href="${idp}/oauth2/authorize?client_id=${clientId}&response_type=code&scope=email+openid+phone&redirect_uri=${callbackUrl}">login</a>`);
});

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

  const response = await get(`${idp}/oauth2/token`, req, {
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

  // TODO: Get and save username from idToken

  req.session.accessToken = accessToken;
  console.log(`access token - \n${accessToken}\nID token - \n${idToken}`);

  res.send(`access token - \n${accessToken}\nID token - \n${idToken}`);

  // res.redirect('/api/score');
});

/* Authenticated endpoints */

// TODO: Verify token for each request with middlewares

app.get('/api/score', async (req, res) => {
  const response = await get(`${api}/score`, req);

  res.send(response);
});

app.get('/api/challenge', async (req, res) => {
  const response = await get(`${api}/Word/challenge`, req);

  res.send(response);
});

app.get('/api/practice', async (req, res) => {
  const response = await get(`${api}/Word/pratice`, req);

  res.send(response);
});

app.post('/api/score', async (req, res) => {

  const {
    time,
    username,
  } = req.body;

  // TODO: Sanitize input

  const response = await get(`${api}/score`, req, {
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