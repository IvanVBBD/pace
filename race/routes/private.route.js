import { Router } from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const privateRouter = Router();

const verify = async (idToken, path, fallbackPath = '/../pages/login.html') => {
    if (!idToken) {
        return fallbackPath;
    }

    try {
        const verifier = CognitoJwtVerifier.create({
        userPoolId: process.env.USER_POOL_ID,
        tokenUse: 'id',
        clientId: process.env.IDP_CLIENT_ID,
        });

        await verifier.verify(idToken);
    } catch (error) {
        return fallbackPath;
    }

    return path;
};

privateRouter.get('/', async (req, res) => {
    const idToken = req?.session?.idToken;
    const route = await verify(idToken, '/../pages/menu.html');
    res.sendFile(path.join(__dirname + route));
});

privateRouter.get('/game', async (req, res) => {
    const idToken = req?.session?.idToken;
    const route = await verify(idToken, '/../pages/index.html');
    res.sendFile(path.join(__dirname + route));
});

privateRouter.get('/leaderboard', async (req, res) => {
    const idToken = req?.session?.idToken;
    const route = await verify(idToken, '/../pages/leaderboard.html');
    res.sendFile(path.join(__dirname + route));
});

export default privateRouter;
