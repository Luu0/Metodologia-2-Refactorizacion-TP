import { Transaction } from "../models/transaction";

export class TransactionFactory {
  static create(
    type: "buy" | "sell",
    userId: string,
    symbol: string,
    quantity: number,
    price: number,
    fees: number
  ): Transaction {
    const id = "txn_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    return new Transaction(id, userId, type, symbol, quantity, price, fees);
  }
}
