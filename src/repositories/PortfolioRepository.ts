import { storage } from "../utils/storage";
import { Portfolio } from "../models/portfolio";

export class PortfolioRepository {
  getByUserId(userId: string): Portfolio | undefined {
    return storage.getPortfolioByUserId(userId);
  }
  update(portfolio: Portfolio): void {
    storage.updatePortfolio(portfolio);
  }
}
