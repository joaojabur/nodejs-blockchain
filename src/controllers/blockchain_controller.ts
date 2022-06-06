import { Request, Response } from 'express';
import elliptic from 'elliptic';
import coin from '../config/blockchain';

const EC = elliptic.ec;
const ec = new EC("secp256k1");

const blockchain_controller = {
    async index(_req: Request, res: Response) {
        try {
            const blockchain = coin.getBlockchain();
            res.status(202).json({
                message: "Success",
                data: blockchain,
            });
        } catch (error) {
            if (error) {
                res.status(400).json({
                    message: "Unexpected error",
                });
            };
        };
    },

    async create(req: Request, res: Response) {
        try {
            const { private_key } = req.body;
            const key = ec.keyFromPrivate(private_key);
            const wallet = key.getPublic('hex');

            coin.minePendingTransactions(wallet);

            res.status(201).json({
                message: "Block mined!",
                data: {
                    from: null,
                    to: wallet,
                    amount: coin.getMiningReward(),
                }
            })
        } catch (error) {
            if (error) {
                res.status(400).json({
                    message: "Unexpected error",
                })
            }
        }
    },
};

export default blockchain_controller;