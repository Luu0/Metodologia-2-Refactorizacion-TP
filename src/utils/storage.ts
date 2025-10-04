import { UserStorage } from "./UserStorage";
import { AssetStorage } from "./AssetStorage";
import { MarketStorage } from "./MarketStorage";
import { PortfolioStorage } from "./PortfolioStorage";
import { OrderStorage } from "./OrderStorage";
import { TransactionStorage } from "./TransactionStorage";
import { User, Asset, Portfolio, MarketData, Order, Transaction } from "../models/types";
import { config } from "../config/config";

export class InMemoryStorage {
  private static instance: InMemoryStorage;

  private userStorage: UserStorage;
  private assetStorage: AssetStorage;
  private marketStorage: MarketStorage;
  private portfolioStorage: PortfolioStorage;
  private orderStorage: OrderStorage;
  private transactionStorage: TransactionStorage;

  private constructor() {
    const defaultUsers: User[] = [
      new User("demo_user","demo_user","demo@example.com","demo-key-123",10000,"medium"),
      new User("admin_user","admin_user","admin@example.com","admin-key-456",50000,"high"),
      new User("trader_user","trader_user","trader@example.com","trader-key-789",25000,"low")
    ];

    const defaultAssets: Asset[] = config.market.baseAssets.map(a => new Asset(a.symbol,a.name,a.basePrice,a.sector));
    const defaultMarketData: MarketData[] = config.market.baseAssets.map(a => new MarketData(a.symbol,a.basePrice));
    const defaultPortfolios: Portfolio[] = defaultUsers.map(u => new Portfolio(u.id));

    this.userStorage = new UserStorage(defaultUsers);
    this.assetStorage = new AssetStorage(defaultAssets);
    this.marketStorage = new MarketStorage(defaultMarketData);
    this.portfolioStorage = new PortfolioStorage(defaultPortfolios);
    this.orderStorage = new OrderStorage();
    this.transactionStorage = new TransactionStorage();
  }

  public static getInstance(): InMemoryStorage {
    if (!InMemoryStorage.instance) {
      InMemoryStorage.instance = new InMemoryStorage();
    }
    return InMemoryStorage.instance;
  }

  //  Facade: métodos de acceso directo 
  getUserById(id: string) { return this.userStorage.getUserById(id); }
  getUserByApiKey(apiKey: string) { return this.userStorage.getUserByApiKey(apiKey); }
  updateUser(user: User) { this.userStorage.updateUser(user); }

  getAllAssets() { return this.assetStorage.getAllAssets(); }
  getAssetBySymbol(symbol: string) { return this.assetStorage.getAssetBySymbol(symbol); }
  updateAsset(asset: Asset) { this.assetStorage.updateAsset(asset); }

  getAllMarketData() { return this.marketStorage.getAllMarketData(); }
  getMarketDataBySymbol(symbol: string) { return this.marketStorage.getMarketDataBySymbol(symbol); }
  updateMarketData(data: MarketData) { this.marketStorage.updateMarketData(data); }

  getPortfolioByUserId(userId: string) { return this.portfolioStorage.getPortfolioByUserId(userId); }
  updatePortfolio(p: Portfolio) { this.portfolioStorage.updatePortfolio(p); }

  addOrder(order: Order) { this.orderStorage.addOrder(order); }
  getOrdersByUserId(userId: string) { return this.orderStorage.getOrdersByUserId(userId); }
  updateOrder(order: Order) { this.orderStorage.updateOrder(order); }

  addTransaction(tx: Transaction) { this.transactionStorage.addTransaction(tx); }
  getTransactionsByUserId(userId: string) { return this.transactionStorage.getTransactionsByUserId(userId); }
  getAllTransactions() { return this.transactionStorage.getAllTransactions(); }
}

// Se exporta la instancia global (Singleton)
export const storage = InMemoryStorage.getInstance();
