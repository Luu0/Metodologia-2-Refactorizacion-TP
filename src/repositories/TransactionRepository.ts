import { storage } from "../utils/storage";
import { Transaction } from "../models/transaction"

export class TransactionRepository {
  add(transaction: Transaction): void {
    storage.addTransaction(transaction);
  }
  getByUserId(userId: string): Transaction[] {
    return storage.getTransactionsByUserId(userId);
  }
}
