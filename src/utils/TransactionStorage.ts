import { Transaction } from "../models/types";

export class TransactionStorage {
  private transactions: Transaction[] = [];

  addTransaction(tx: Transaction): void {
    this.transactions.push(tx);
  }

  getTransactionsByUserId(userId: string): Transaction[] {
    return this.transactions.filter(t => t.userId === userId);
  }

  getAllTransactions(): Transaction[] {
    return [...this.transactions];
  }
}
