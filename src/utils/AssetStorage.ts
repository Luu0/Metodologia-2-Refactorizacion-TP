import { Asset } from "../models/types";

export class AssetStorage {
  private assets = new Map<string, Asset>();

  constructor(defaultAssets: Asset[] = []) {
    defaultAssets.forEach(a => this.assets.set(a.symbol, a));
  }

  getAllAssets(): Asset[] {
    return Array.from(this.assets.values());
  }

  getAssetBySymbol(symbol: string): Asset | undefined {
    return this.assets.get(symbol);
  }

  updateAsset(asset: Asset): void {
    this.assets.set(asset.symbol, asset);
  }
}
