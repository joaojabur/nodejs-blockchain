import express, { Request, Response } from 'express';
import blockchain_controller from '../controllers/blockchain_controller';
import payment_controller from '../controllers/payment_controller';

const routes = (app: express.Express) => {
    app.get('/', (_req: Request, res: Response) => {
        res.send("Hello world!");
    });

    app.get('/blockchain', blockchain_controller.index);

    app.get('/payment', payment_controller.index);
    app.post('/payment/create', payment_controller.create);
};

export default routes;