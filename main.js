const SHA256 = require('crypto-js/sha256');

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0; // Only for mining
  }

  calculateHash() {
    return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
  }

  // Proof-of-work
  mineBlock(difficulty) {
    // Loop until the first difficulty amount of numbers in the hash are equal to 0
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++; // Make sure the hash can be changed
      this.hash = this.calculateHash();
    }

    console.log("Block mined:", this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 3;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  // Function to create the first block
  createGenesisBlock() {
    return new Block(0, "01/01/2018", "Genesis block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /*
  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }
  */

  minePendingTransactions(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log("Block successfully mined!");
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Check if the hash of the current block is correct
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      // Check if the previous hash of the current block points to the right block
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

let newCoin = new Blockchain();

newCoin.createTransaction(new Transaction("address1", "address2", 100));
newCoin.createTransaction(new Transaction("address2", "address1", 50));

newCoin.minePendingTransactions("shawn-address");

console.log("Is blockchain valid?", newCoin.isChainValid());
console.log("\nBalance of address1 is", newCoin.getBalanceOfAddress("address1"));

// Hack the chain
// console.log(newCoin.chain[1].transactions[0]);
// hackedTransaction = new Transaction(null, "address1", 1000);
// newCoin.chain[1].transactions[0] = hackedTransaction;
// console.log("\nBalance of address1 is", newCoin.getBalanceOfAddress("address1"));
// console.log("Is blockchain valid?", newCoin.isChainValid());


// Mine for the transactions above
console.log("\n Starting the mainer...");
newCoin.minePendingTransactions("shawn-address");
console.log("\n Balance of shawn is", newCoin.getBalanceOfAddress("shawn-address"));

// Mine for the minging reward
console.log("\n Starting the mainer again...");
newCoin.minePendingTransactions("shawn-address");
console.log("\n Balance of shawn is", newCoin.getBalanceOfAddress("shawn-address"));


/*
// Check validity & prove-of-work

console.log("Mining block 1...");
newCoin.addBlock(new Block(1, "22/02/2018", { amount: 4 }));
console.log("Mining block 2...");
newCoin.addBlock(new Block(2, "14/03/2018", { amount: 10 }));

console.log("Is blockchain valid?", newCoin.isChainValid());

// Try to hack one of the block
newCoin.chain[1].data = { amount: 100 };
newCoin.chain[1].hash = newCoin.chain[1].calculateHash();

console.log("Is blockchain valid?", newCoin.isChainValid());

*/

