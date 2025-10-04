import { UserRepository } from "../repositories/UserRepository";
import { AssetRepository } from "../repositories/AssetRepository";
import { PortfolioRepository } from "../repositories/PortfolioRepository";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { TransactionFactory } from "../factories/TransactionFactory";
import { BuyFeeStrategy, SellFeeStrategy } from "../strategies/FeeStrategies";
import { eventBus } from "../events/EventBus";
import { Transaction } from "../models/transaction";

export class TradingService {
  private userRepo = new UserRepository();
  private assetRepo = new AssetRepository();
  private portfolioRepo = new PortfolioRepository();
  private transactionRepo = new TransactionRepository();

  async executeBuyOrder(userId: string, symbol: string, quantity: number): Promise<Transaction> {
    // Obtener usuario y activo
    const user = this.userRepo.getById(userId);
    if (!user) throw new Error("Usuario no encontrado");

    const asset = this.assetRepo.getBySymbol(symbol);
    if (!asset) throw new Error("Activo no encontrado");

    // Precio y fees
    const price = asset.currentPrice;
    const grossAmount = price * quantity;
    const fees = new BuyFeeStrategy().calculate(grossAmount);
    const totalCost = grossAmount + fees;

    if (!user.canAfford(totalCost)) throw new Error("Fondos insuficientes");

    // Crear transacción vía factory
    const transaction = TransactionFactory.create("buy", userId, symbol, quantity, price, fees);
    transaction.complete();

    // Persistir cambios (repos)
    user.deductBalance(totalCost);
    this.userRepo.update(user);

    const portfolio = this.portfolioRepo.getByUserId(userId);
    if (portfolio) {
      portfolio.addHolding(symbol, quantity, price);
      portfolio.calculateTotals();
      this.portfolioRepo.update(portfolio);
    }

    this.transactionRepo.add(transaction);

    // Emitir evento para listeners (market impact, analytics, etc.)
    eventBus.emit("transaction.completed", transaction);

    return transaction;
  }

  async executeSellOrder(userId: string, symbol: string, quantity: number): Promise<Transaction> {
    const user = this.userRepo.getById(userId);
    if (!user) throw new Error("Usuario no encontrado");

    const asset = this.assetRepo.getBySymbol(symbol);
    if (!asset) throw new Error("Activo no encontrado");

    const portfolio = this.portfolioRepo.getByUserId(userId);
    if (!portfolio) throw new Error("Portafolio no encontrado");

    const holding = portfolio.holdings.find(h => h.symbol === symbol);
    if (!holding || holding.quantity < quantity) throw new Error("No tienes suficientes activos para vender");

    const price = asset.currentPrice;
    const grossAmount = price * quantity;
    const fees = new SellFeeStrategy().calculate(grossAmount);
    const netAmount = grossAmount - fees;

    // Actualizar portfolio
    const removed = portfolio.removeHolding(symbol, quantity);
    if (!removed) throw new Error("Error al remover holdings");
    portfolio.calculateTotals();
    this.portfolioRepo.update(portfolio);

    // Crear y completar transacción
    const transaction = TransactionFactory.create("sell", userId, symbol, quantity, price, fees);
    transaction.complete();

    // Actualizar usuario y persistir todo
    user.addBalance(netAmount);
    this.userRepo.update(user);

    this.transactionRepo.add(transaction);
    eventBus.emit("transaction.completed", transaction);

    return transaction;
  }

  getTransactionHistory(userId: string) {
    return this.transactionRepo.getByUserId(userId);
  }
}
