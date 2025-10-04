export class MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: Date;

  constructor(symbol: string, price: number) {
    this.symbol = symbol;
    this.price = price;
    this.change = 0;
    this.changePercent = 0;
    this.volume = Math.floor(Math.random() * 1000000);
    this.timestamp = new Date();
  }

  updatePrice(newPrice: number): void {
    this.change = newPrice - this.price;
    this.changePercent = this.price > 0 ? (this.change / this.price) * 100 : 0;
    this.price = newPrice;
    this.volume += Math.floor(Math.random() * 10000);
    this.timestamp = new Date();
  }
}