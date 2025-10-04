export class Transaction {
  id: string;
  userId: string;
  type: "buy" | "sell";
  symbol: string;
  quantity: number;
  price: number;
  timestamp: Date;
  fees: number;
  status: "pending" | "completed" | "failed";

  constructor(
    id: string,
    userId: string,
    type: "buy" | "sell",
    symbol: string,
    quantity: number,
    price: number,
    fees: number
  ) {
    this.id = id;
    this.userId = userId;
    this.type = type;
    this.symbol = symbol;
    this.quantity = quantity;
    this.price = price;
    this.fees = fees;
    this.timestamp = new Date();
    this.status = "pending";
  }

  complete(): void {
    this.status = "completed";
  }

  fail(): void {
    this.status = "failed";
  }

  getTotalAmount(): number {
    return this.quantity * this.price;
  }
}