import express from 'express';

const app = express();
const port = 3000;
const api = 'https://yu7ijviz93.eu-west-1.awsapprunner.com';

const StatusCodes = {
  Okay: 200,
  BadGateway: 502,
  InvalidResponse: 424,
};

app.get('/', (req, res) => {
  res.send(`<a href="/api/score">score</a><br/><a href="/api/challenge">challenge</a><br/><a href="/api/practice">practice</a>`);
});

app.get('/api/score', async (req, res) => {
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