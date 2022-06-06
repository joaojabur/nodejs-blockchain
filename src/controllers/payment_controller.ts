import { Request, Response } from 'express';
import elliptic from 'elliptic';
import Transaction from '../models/Transaction';
import coin from '../config/blockchain';

const EC = elliptic.ec;
const ec  = new EC('secp256k1');

const payment_controller = {
    async index(_req: Request, res: Response) {
        try {
            const blockchain = coin.getBlockchain();
            var transactions = [];

            for (let i = 0; i < blockchain.length; i++) {
                let temp_transactions = blockchain[i].getTransactions();

                for (let j = 0; j < temp_transactions.length; j++) {
                    transactions.push({
                        from: temp_transactions[j].getSender(),
                        to: temp_transactions[j].getReceiver(),
                        amount: temp_transactions[j].getAmount(),
                    });
                };
            };

            res.status(202).json({
                message: "Success!",
                data: transactions,
            });
        } catch (error) {
            if (error) {
                res.status(400).json({
                    message: "Unexpected error.",
                });
            };
        };
    },

    async create(req: Request, res: Response) {
        try {
            const { private_key, to, amount } = req.body;
            const key = ec.keyFromPrivate(private_key);
            const wallet = key.getPublic('hex');

            const transaction = new Transaction(wallet, to, amount);
            transaction.signTransaction(key);
            coin.addTransaction(transaction);

            res.status(201).json({
                message: "Success!",
            })
        } catch (error) {
            if (error) {
                res.status(400).json({
                    message: "Unexpected error",
                });
            };
        };
    },
};

export default payment_controller;