import { Portfolio } from "../models/portfolio";
import { storage } from "../utils/storage";

// Agregamos el tipo de retorno para incluir la recomendación
export interface RiskResult {
  score: number;
  recommendation: string;
}

// Ahora la interfaz principal devuelve el resultado completo
export interface RiskStrategy {
  calculate(portfolio: Portfolio): RiskResult;
}

// Estrategia para la diversificación
export class DiversificationRiskStrategy implements RiskStrategy {
  calculate(portfolio: Portfolio): RiskResult {
    if (portfolio.holdings.length === 0) {
      return { score: 0, recommendation: "Tu portafolio está vacío, no hay datos para analizar la diversificación." };
    }

    const sectors = new Set<string>();
    portfolio.holdings.forEach((holding) => {
      const asset = storage.getAssetBySymbol(holding.symbol);
      if (asset) sectors.add(asset.sector);
    });

    const sectorCount = sectors.size;
    const maxSectors = 5;
    const sectorScore = Math.min(sectorCount / maxSectors, 1) * 50;
    const totalValue = portfolio.totalValue;
    let concentrationPenalty = 0;

    portfolio.holdings.forEach((holding) => {
      const weight = holding.currentValue / totalValue;
      if (weight > 0.3) concentrationPenalty += (weight - 0.3) * 100;
    });

    const distributionScore = Math.max(50 - concentrationPenalty, 0);
    const finalScore = Math.min(sectorScore + distributionScore, 100);

    let recommendation = "";
    if (finalScore < 40) {
      recommendation = "Considera diversificar tu portafolio en más sectores para reducir el riesgo.";
    } else if (finalScore > 80) {
      recommendation = "Excelente diversificación, mantén esta estrategia.";
    } else {
      recommendation = "Tu portafolio tiene una buena diversificación, continúa monitoreándola.";
    }

    return { score: finalScore, recommendation };
  }
}

// Estrategia para la volatilidad
export class VolatilityRiskStrategy implements RiskStrategy {
  calculate(portfolio: Portfolio): RiskResult {
    if (portfolio.holdings.length === 0) {
      return { score: 0, recommendation: "Tu portafolio está vacío, no hay datos para analizar la volatilidad." };
    }
    
    let weightedVolatility = 0;
    const totalValue = portfolio.totalValue;
    
    portfolio.holdings.forEach((holding) => {
      const asset = storage.getAssetBySymbol(holding.symbol);
      if (asset) {
        const weight = holding.currentValue / totalValue;
        const assetVolatility = this.getAssetVolatility(asset.symbol);
        weightedVolatility += weight * assetVolatility;
      }
    });

    const finalScore = Math.min(weightedVolatility, 100);
    let recommendation = "";
    if (finalScore > 70) {
      recommendation = "Tu portafolio tiene alta volatilidad, considera añadir activos más estables.";
    } else if (finalScore < 30) {
      recommendation = "Tu portafolio tiene baja volatilidad, lo que sugiere un perfil conservador.";
    } else {
      recommendation = "La volatilidad de tu portafolio es moderada, lo que se alinea con un perfil balanceado.";
    }

    return { score: finalScore, recommendation };
  }

  // Se mantiene la lógica de obtener volatilidad
  public getAssetVolatility(symbol: string): number {
    const asset = storage.getAssetBySymbol(symbol);
    if (!asset) return 50;

    const volatilityBySector: { [key: string]: number } = {
      Technology: 65,
      Healthcare: 45,
      Financial: 55,
      Automotive: 70,
      "E-commerce": 60,
    };
    return volatilityBySector[asset.sector] || 50;
  }
}

// Las estrategias de recomendación se mantienen igual
export interface RecommendationStrategy {
  generate(userId: string): any[];
}

export class RiskToleranceRecommendationStrategy implements RecommendationStrategy {
  generate(userId: string): any[] {
    const user = storage.getUserById(userId);
    const portfolio = storage.getPortfolioByUserId(userId);
    if (!user || !portfolio) throw new Error("Usuario o portafolio no encontrado");

    const recommendations: any[] = [];
    const allAssets = storage.getAllAssets();
    const volatilityStrategy = new VolatilityRiskStrategy();

    allAssets.forEach((asset) => {
        const hasHolding = portfolio.holdings.some(h => h.symbol === asset.symbol);
        if (!hasHolding) {
            let recommendation = "";
            let priority = 0;
            const assetVolatility = volatilityStrategy.getAssetVolatility(asset.symbol);

            if (user.riskTolerance === "low" && assetVolatility < 50) {
                recommendation = "Activo de bajo riesgo recomendado para perfil conservador";
                priority = 1;
            } else if (user.riskTolerance === "high" && assetVolatility > 60) {
                recommendation = "Activo con potencial de crecimiento para perfil agresivo";
                priority = 2;
            } else if (user.riskTolerance === "medium" && assetVolatility >= 40 && assetVolatility <= 60) {
                recommendation = "Activo balanceado adecuado para perfil moderado";
                priority = 1;
            }

            if (recommendation) {
                recommendations.push({
                    symbol: asset.symbol,
                    name: asset.name,
                    currentPrice: asset.currentPrice,
                    recommendation,
                    priority,
                    riskLevel: assetVolatility > 60 ? "high" : (assetVolatility > 40 ? "medium" : "low"),
                });
            }
        }
    });

    return recommendations.sort((a, b) => b.priority - a.priority).slice(0, 5);
  }
}