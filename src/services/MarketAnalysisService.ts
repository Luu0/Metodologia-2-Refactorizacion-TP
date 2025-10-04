import { Portfolio, RiskAnalysis } from "../models/types";
import { storage } from "../utils/storage";
import {
  RiskStrategy,
  DiversificationRiskStrategy,
  VolatilityRiskStrategy,
  RecommendationStrategy,
  RiskToleranceRecommendationStrategy,
} from "../strategies/RiskStrategy";

export class MarketAnalysisService {
  private strategies: RiskStrategy[];
  private recommendationStrategy: RecommendationStrategy;

  constructor() {
    this.strategies = [new DiversificationRiskStrategy(), new VolatilityRiskStrategy()];
    this.recommendationStrategy = new RiskToleranceRecommendationStrategy();
  }

  public analyzePortfolioRisk(userId: string): RiskAnalysis {
    const portfolio = storage.getPortfolioByUserId(userId);
    if (!portfolio) throw new Error("Portafolio no encontrado");

    // Delegamos el cálculo y la generación de recomendaciones de riesgo
    const diversificationResult = this.strategies[0].calculate(portfolio);
    const volatilityResult = this.strategies[1].calculate(portfolio);

    let portfolioRisk: "low" | "medium" | "high";
    if (volatilityResult.score < 30 && diversificationResult.score > 70) {
      portfolioRisk = "low";
    } else if (volatilityResult.score < 60 && diversificationResult.score > 40) {
      portfolioRisk = "medium";
    } else {
      portfolioRisk = "high";
    }

    const generalRecommendation = this.getGeneralRiskRecommendation(portfolioRisk);
    const allRecommendations = [
      diversificationResult.recommendation,
      volatilityResult.recommendation,
      generalRecommendation,
    ];

    const riskAnalysis = new RiskAnalysis(userId);
    riskAnalysis.updateRisk(
      portfolioRisk,
      diversificationResult.score,
      allRecommendations
    );
    return riskAnalysis;
  }

  // Método simple para la recomendación general
  private getGeneralRiskRecommendation(riskLevel: string): string {
    if (riskLevel === "high") {
      return "Nivel de riesgo alto detectado, revisa tu estrategia de inversión.";
    }
    return "Tu portafolio se ve balanceado, continúa monitoreando regularmente.";
  }

  public generateInvestmentRecommendations(userId: string): any[] {
    return this.recommendationStrategy.generate(userId);
  }

  public performTechnicalAnalysis(symbol: string): any {
    const marketData = storage.getMarketDataBySymbol(symbol);
    if (!marketData) throw new Error("Datos de mercado no encontrados");

    const sma20 = this.calculateSimpleMovingAverage(marketData.price, 20);
    const sma50 = this.calculateSimpleMovingAverage(marketData.price, 50);
    const rsi = this.calculateRSI();

    let signal: "buy" | "sell" | "hold" = "hold";
    if (marketData.price > sma20 && sma20 > sma50 && rsi < 70) {
      signal = "buy";
    } else if (marketData.price < sma20 && sma20 < sma50 && rsi > 30) {
      signal = "sell";
    }

    return {
      symbol,
      currentPrice: marketData.price,
      sma20,
      sma50,
      rsi,
      signal,
      timestamp: new Date(),
    };
  }

  private calculateSimpleMovingAverage(price: number, periods: number): number {
    const variation = (Math.random() - 0.5) * 0.1;
    return price * (1 + variation);
  }

  private calculateRSI(): number {
    return 20 + Math.random() * 60;
  }
}