import { Router } from "express";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const privateRouter = Router();

privateRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../pages/menu.html'));
});

privateRouter.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname + '/../pages/index.html'));
});

privateRouter.get('/leaderboard', (req, res) => {
    res.sendFile(path.join(__dirname + '/../pages/leaderboard.html'));
});

export default privateRouter;
