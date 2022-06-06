import crypto from 'crypto-js';
import Transaction from './Transaction';

class Block {
    _index: number;
    _previous_hash: string;
    _transactions: Array<Transaction>;
    _timestamp: Date;
    _nonce: number;
    _difficulty: number;
    _hash: string;

    constructor(index: number, previous_hash: string, transactions: any, difficulty: number) {
        this._index = index;
        this._previous_hash = previous_hash;
        this._transactions = transactions;
        this._timestamp = new Date();
        this._nonce = 0;
        this._difficulty = difficulty;
        this._hash = this.generateHash();
    };

    mineBlock(): void {
        while (this._hash.substring(0,  this._difficulty) !== Array(this._difficulty + 1).join("0")) {
            this._nonce++;
            this._hash = this.generateHash();
        };

        console.log(`Block ${this._hash} mined ⛏️  with ${this._nonce} tentatives.`);
    };

    hasValidTransactions(): boolean {
        for (const tx of this._transactions) {
            if (!tx.isValid()) return false;
        };

        return true;
    };

    generateHash(): string {
        return crypto.SHA256(this._index + this._previous_hash + this._transactions + this._timestamp + this._nonce).toString();
    };

    getHash(): string {
        return this._hash;
    };

    getPreviousHash(): string {
        return this._previous_hash.toString();
    };

    getTransactions(): Array<Transaction> {
        return this._transactions;
    };
};

export default Block;