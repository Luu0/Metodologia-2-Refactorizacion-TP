import { MarketData } from "../models/types";

export class MarketStorage {
  private marketData = new Map<string, MarketData>();

  constructor(defaultMarketData: MarketData[] = []) {
    defaultMarketData.forEach(m => this.marketData.set(m.symbol, m));
  }

  getAllMarketData(): MarketData[] {
    return Array.from(this.marketData.values());
  }

  getMarketDataBySymbol(symbol: string): MarketData | undefined {
    return this.marketData.get(symbol);
  }

  updateMarketData(data: MarketData): void {
    this.marketData.set(data.symbol, data);
  }
}
