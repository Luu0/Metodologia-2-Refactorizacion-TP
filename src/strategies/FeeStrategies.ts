import { config } from "../config/config";

export interface FeeStrategy {
  calculate(amount: number): number;
}

export class BuyFeeStrategy implements FeeStrategy {
  calculate(amount: number) {
    return Math.max(amount * config.tradingFees.buyFeePercentage, config.tradingFees.minimumFee);
  }
}

export class SellFeeStrategy implements FeeStrategy {
  calculate(amount: number) {
    return Math.max(amount * config.tradingFees.sellFeePercentage, config.tradingFees.minimumFee);
  }
}

