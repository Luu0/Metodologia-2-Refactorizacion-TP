export class PortfolioHolding {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentValue: number;
  totalReturn: number;
  percentageReturn: number;

  constructor(symbol: string, quantity: number, averagePrice: number) {
    this.symbol = symbol;
    this.quantity = quantity;
    this.averagePrice = averagePrice;
    this.currentValue = 0;
    this.totalReturn = 0;
    this.percentageReturn = 0;
  }

  updateCurrentValue(currentPrice: number): void {
    this.currentValue = this.quantity * currentPrice;
    const invested = this.quantity * this.averagePrice;
    this.totalReturn = this.currentValue - invested;
    this.percentageReturn =
      invested > 0 ? (this.totalReturn / invested) * 100 : 0;
  }

  addShares(quantity: number, price: number): void {
    const totalQuantity = this.quantity + quantity;
    const totalCost = this.quantity * this.averagePrice + quantity * price;
    this.quantity = totalQuantity;
    this.averagePrice = totalCost / totalQuantity;
  }

  removeShares(quantity: number): void {
    this.quantity -= quantity;
  }
}