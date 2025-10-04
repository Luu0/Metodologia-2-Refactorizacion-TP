import { Order } from "../models/types";

export class OrderStorage {
  private orders: Order[] = [];

  addOrder(order: Order): void {
    this.orders.push(order);
  }

  getOrdersByUserId(userId: string): Order[] {
    return this.orders.filter(o => o.userId === userId);
  }

  updateOrder(order: Order): void {
    const index = this.orders.findIndex(o => o.id === order.id);
    if (index !== -1) this.orders[index] = order;
  }
}
