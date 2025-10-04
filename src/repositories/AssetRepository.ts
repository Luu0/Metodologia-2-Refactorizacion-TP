import { storage } from "../utils/storage";
import { Asset } from "../models/asset";

export class AssetRepository {
  getBySymbol(symbol: string): Asset | undefined {
    return storage.getAssetBySymbol(symbol);
  }
  getAll(): Asset[] {
    return storage.getAllAssets();
  }
  update(asset: Asset): void {
    storage.updateAsset(asset);
  }
}
