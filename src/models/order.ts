export class Order {
  id: string;
  userId: string;
  type: "market";
  action: "buy" | "sell";
  symbol: string;
  quantity: number;
  price?: number;
  status: "pending" | "executed" | "cancelled";
  createdAt: Date;
  executedAt?: Date;

  constructor(
    id: string,
    userId: string,
    type: "market",
    action: "buy" | "sell",
    symbol: string,
    quantity: number,
    price?: number
  ) {
    this.id = id;
    this.userId = userId;
    this.type = type;
    this.action = action;
    this.symbol = symbol;
    this.quantity = quantity;
    this.price = price;
    this.status = "pending";
    this.createdAt = new Date();
  }

  execute(): void {
    this.status = "executed";
    this.executedAt = new Date();
  }

  cancel(): void {
    this.status = "cancelled";
  }
}