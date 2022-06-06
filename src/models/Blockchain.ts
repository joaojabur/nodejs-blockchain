import Block from './Block';
import Transaction from './Transaction';

class Blockchain {
    _length: number;
    _blocks: Array<Block>;
    _difficulty: number;
    _pending_transactions: Array<Transaction>;
    _mining_reward: number;

    constructor () {
        const genesis = new Block(1, "", [], 1)
        genesis.mineBlock();

        this._length = 1;
        this._difficulty = 2;
        this._blocks = [genesis];
        this._pending_transactions = [];
        this._mining_reward = 100;
    };

    minePendingTransactions(miner_address: string): void {
        const block = new Block(this._length, this.getLastBlock().getHash(), this._pending_transactions, this._difficulty);
        block.mineBlock();

        this._blocks.push(block);

        this._pending_transactions = [
            new Transaction(null, miner_address, this._mining_reward),
        ];
    };

    addBlock(data: Array<any>, miner_address: string): string {
        if (!this.isChainValid()) {
            throw new Error("The chain is not valid.");
        };

        const previous_hash = this.getLastBlock().getHash();
        const index = this._length;
        const block = new Block(index, previous_hash, data, this._difficulty);
        block.mineBlock();

        this._blocks.push(block);
        this._length++;

        return miner_address;
    };

    addTransaction(transaction: Transaction): void {
        if (!transaction.getSender() || !transaction.getReceiver) throw new Error("Transaction must include from and to address.");
        if (!transaction.isValid()) throw new Error("Cannot add invalid transaction to the chain.");

        this._pending_transactions.push(transaction);
    };

    getAddressBalance(address: string): number {
        let balance = 0;

        for (const block of this._blocks) {
            for (const transaction of block.getTransactions()) {
                if (transaction.getSender() === address) {
                    balance = balance - transaction.getAmount();
                };
                if (transaction.getReceiver() === address) {
                    balance = balance + transaction.getAmount();
                };
            };
        };

        return balance;
    };

    isChainValid(): boolean {
        for (let i = 1; i < this._blocks.length; i++) {
            const current_block = this._blocks[i];
            const previous_block = this._blocks[i - 1];

            if (!current_block.hasValidTransactions()) return false;
            if (current_block.generateHash() !== current_block.getHash()) return false;
            if (current_block.getPreviousHash() !== previous_block.getHash()) return false;
        };

        return true;
    };

    getBlockchain(): Array<Block> {
        return this._blocks;
    };

    getLastBlock(): Block {
        return this._blocks[this._length - 1];
    };

    getLength(): number {
        return this._length;
    };

    getMiningReward(): number {
        return this._mining_reward;
    };
}

export default Blockchain;