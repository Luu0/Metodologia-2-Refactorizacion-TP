export class Asset {
  symbol: string;
  name: string;
  currentPrice: number;
  sector: string;
  lastUpdated: Date;

  constructor(
    symbol: string,
    name: string,
    currentPrice: number,
    sector: string
  ) {
    this.symbol = symbol;
    this.name = name;
    this.currentPrice = currentPrice;
    this.sector = sector;
    this.lastUpdated = new Date();
  }

  updatePrice(newPrice: number): void {
    this.currentPrice = newPrice;
    this.lastUpdated = new Date();
  }
}
