import { MarketData } from "../models/types";
import { storage } from "../utils/storage";
import { config } from "../config/config";
import { MarketSimulationFactory } from "../factories/MarketSimulationFactory";

export class MarketSimulationService {
  private static instance: MarketSimulationService;
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): MarketSimulationService {
    if (!MarketSimulationService.instance) {
      MarketSimulationService.instance = new MarketSimulationService();
    }
    return MarketSimulationService.instance;
  }

  // Iniciar simulación automática
  startMarketSimulation(): void {
    if (this.isRunning) {
      console.log("La simulación de mercado ya está ejecutándose");
      return;
    }

    this.isRunning = true;
    console.log("Iniciando simulación de mercado...");

    this.intervalId = setInterval(() => {
      this.updateMarketPrices();
    }, config.market.updateIntervalMs);
  }

  // Detener simulación automática
  stopMarketSimulation(): void {
    if (!this.isRunning) {
      console.log("La simulación de mercado no está ejecutándose");
      return;
    }

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log("Simulación de mercado detenida");
  }

  // Actualización periódica aleatoria
  private updateMarketPrices(): void {
    const allMarketData = storage.getAllMarketData();

    allMarketData.forEach((marketData: MarketData) => {
      const randomChange = (Math.random() - 0.5) * 2;
      const volatilityFactor = config.market.volatilityFactor;
      const priceChange = marketData.price * randomChange * volatilityFactor;

      const newPrice = Math.max(marketData.price + priceChange, 0.01);
      const change = newPrice - marketData.price;
      const changePercent = (change / marketData.price) * 100;

      marketData.price = newPrice;
      marketData.change = change;
      marketData.changePercent = changePercent;
      marketData.volume += Math.floor(Math.random() * 10000);
      marketData.timestamp = new Date();

      storage.updateMarketData(marketData);

      const asset = storage.getAssetBySymbol(marketData.symbol);
      if (asset) {
        asset.currentPrice = newPrice;
        asset.lastUpdated = new Date();
        storage.updateAsset(asset);
      }
    });

    this.updateAllPortfolioValues();
  }

  // Recalcular portfolios
  private updateAllPortfolioValues(): void {
    const allUsers = [
      storage.getUserById("demo_user"),
      storage.getUserById("admin_user"),
      storage.getUserById("trader_user"),
    ].filter((user) => user !== undefined);

    allUsers.forEach((user) => {
      if (user) {
        const portfolio = storage.getPortfolioByUserId(user.id);
        if (portfolio && portfolio.holdings.length > 0) {
          this.recalculatePortfolioValues(portfolio);
          storage.updatePortfolio(portfolio);
        }
      }
    });
  }

  private recalculatePortfolioValues(portfolio: any): void {
    let totalValue = 0;
    let totalInvested = 0;

    portfolio.holdings.forEach((holding: any) => {
      const asset = storage.getAssetBySymbol(holding.symbol);
      if (asset) {
        holding.currentValue = holding.quantity * asset.currentPrice;
        const invested = holding.quantity * holding.averagePrice;
        holding.totalReturn = holding.currentValue - invested;
        holding.percentageReturn =
          invested > 0 ? (holding.totalReturn / invested) * 100 : 0;

        totalValue += holding.currentValue;
        totalInvested += invested;
      }
    });

    portfolio.totalValue = totalValue;
    portfolio.totalInvested = totalInvested;
    portfolio.totalReturn = totalValue - totalInvested;
    portfolio.percentageReturn =
      totalInvested > 0 ? (portfolio.totalReturn / totalInvested) * 100 : 0;
    portfolio.lastUpdated = new Date();
  }

  // Ahora se usa Factory + Template Method para eventos de mercado
  simulateMarketEvent(eventType: "bull" | "bear" | "crash" | "recovery"): void {
    console.log(`Simulando evento de mercado: ${eventType}`);

    const allMarketData = storage.getAllMarketData();

    allMarketData.forEach((marketData: MarketData) => {
      const simulation = MarketSimulationFactory.create(eventType);
      const newPrice = simulation.run(marketData.price);

      const change = newPrice - marketData.price;
      const changePercent = (change / marketData.price) * 100;

      marketData.price = newPrice;
      marketData.change = change;
      marketData.changePercent = changePercent;
      marketData.timestamp = new Date();

      storage.updateMarketData(marketData);

      const asset = storage.getAssetBySymbol(marketData.symbol);
      if (asset) {
        asset.currentPrice = newPrice;
        asset.lastUpdated = new Date();
        storage.updateAsset(asset);
      }
    });

    this.updateAllPortfolioValues();
  }

  getSimulationStatus(): { isRunning: boolean; lastUpdate: Date | null } {
    return {
      isRunning: this.isRunning,
      lastUpdate: this.isRunning ? new Date() : null,
    };
  }
}
