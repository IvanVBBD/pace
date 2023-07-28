import { Router } from "express";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicRouter = Router();

publicRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../pages/login.html'));
});

export default publicRouter;
