import { Portfolio } from "../models/types";

export class PortfolioStorage {
  private portfolios = new Map<string, Portfolio>();

  constructor(defaultPortfolios: Portfolio[] = []) {
    defaultPortfolios.forEach(p => this.portfolios.set(p.userId, p));
  }

  getPortfolioByUserId(userId: string): Portfolio | undefined {
    return this.portfolios.get(userId);
  }

  updatePortfolio(portfolio: Portfolio): void {
    this.portfolios.set(portfolio.userId, portfolio);
  }
}
