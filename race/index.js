import express from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const app = express();
const port = process.env.PORT;
const api = process.env.API;
const idp = process.env.idp

const StatusCodes = {
  Okay: 200,
  BadGateway: 502,
  InvalidResponse: 424,
};

app.get('/', (req, res) => {
  res.send(`<a href="/api/score">score</a><br/><a href="/api/challenge">challenge</a><br/><a href="/api/practice">practice</a><br/><a href="${idp}">login</a>`);
});

app.get('/callback', async (req, res) => {

  const code = req.params?.code;

  if (!code) {
    res.redirect('/');
  }

  const response = await fetch('https://pace.auth.eu-west-1.amazoncognito.com/oauth2/token', {
    method: 'post',
    body: {
      grant_type: 'authorization_code',
      client_id: process.env.IDP_CLIENT_ID,
      code,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const accessToken = response?.data?.access_token

  console.log('token', accessToken);
  console.log('response', response);

  res.redirect('/api/score');
});

app.get('/api/score', async (req, res) => {
  // TODO: Make all routes do proper catches

  const response = await fetch(`${api}/score`);

  if (response.status !== StatusCodes.Okay) {
    res.status(StatusCodes.InvalidResponse).send({
      response,
    });
  }

  try {
    res.send(await response.json());
  } catch (error) {
    res.status(StatusCodes.BadGateway).send('Invalid response from server');
  }
});

app.get('/api/challenge', async (req, res) => {
  const response = await fetch(`${api}/Word/challenge`);

  if (response.status !== StatusCodes.Okay) {
    res.status(StatusCodes.InvalidResponse).send({
      response,
    });
  }

  try {
    res.send(await response.json());
  } catch (error) {
    res.status(StatusCodes.BadGateway).send('Invalid response from server');
  }
});

app.get('/api/practice', async (req, res) => {
  const response = await fetch(`${api}/Word/pratice`);

  if (response.status !== StatusCodes.Okay) {
    res.status(StatusCodes.InvalidResponse).send({
      response,
    });
  }

  try {
    res.send(await response.json());
  } catch (error) {
    res.status(StatusCodes.BadGateway).send('Invalid response from server');
  }
});

app.post('/api/score', async (req, res) => {

  const {
    time,
    username,
  } = req.body;

  // TODO: Sanitize input

  const response = await fetch(`${api}/score`, {
    body: {
      time,
      username,
    },
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status !== StatusCodes.Okay) {
    res.status(StatusCodes.InvalidResponse).send({
      response,
    });
  }

  try {
    res.send(await response.json());
  } catch (error) {
    res.status(StatusCodes.BadGateway).send('Invalid response from server');
  }
});

app.listen(port);