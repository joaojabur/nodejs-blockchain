import crypto from 'crypto-js';
import elliptic from 'elliptic';
const EC = elliptic.ec;
const ec = new EC('secp256k1');

class Transaction {
    _from: string | null;
    _to: string;
    _amount: number;
    _signature: any;

    constructor (from: string | null, to: string, amount: number) {
        this._from = from;
        this._to = to;
        this._amount = amount;
    };

    calculateHash(): string {
        return crypto.SHA256(this._from + this._to + this._amount).toString();
    };

    signTransaction(signing_key: elliptic.ec.KeyPair): void {
        if (signing_key.getPublic('hex') !== this._from) {
            throw new Error("You cannot sign transactions for other wallets.");
        };

        const hash = this.calculateHash();
        const sig = signing_key.sign(hash, 'base64');
        this._signature = sig.toDER('hex');
    };

    isValid(): boolean {
        if (this._from === null) return true;
        if (!this._signature || this._signature.length === 0) throw new Error("No signature in this transaction.");

        const public_key = ec.keyFromPublic(this._from, 'hex');

        return public_key.verify(this.calculateHash(), this._signature);
    };

    getSender(): string | null {
        return this._from;
    };

    getReceiver(): string {
        return this._to;
    };

    getAmount(): number {
        return this._amount;
    };
};

export default Transaction;