import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from '../routes/routes';
import StatusError from '../interfaces/StatusError';

const app = express();
app.use(express.json());
app.use(cors());
routes(app);

app.use((_req: Request, _res: Response, next: NextFunction) => {
    let error: StatusError = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error: StatusError, _req: Request, res: Response, _next: NextFunction) => {
    res.status(error.status || 500).json({
        message: error.message,
    });
});

export default app;