import { 
  MarketSimulation, 
  BullMarketSimulation, 
  BearMarketSimulation, 
  CrashMarketSimulation, 
  RecoveryMarketSimulation 
} from "../Template/MarketSimulation";

export class MarketSimulationFactory {
  static create(type: "bull" | "bear" | "crash" | "recovery"): MarketSimulation {
    switch (type) {
      case "bull": return new BullMarketSimulation();
      case "bear": return new BearMarketSimulation();
      case "crash": return new CrashMarketSimulation();
      case "recovery": return new RecoveryMarketSimulation();
      default: throw new Error(`Tipo de simulación desconocido: ${type}`);
    }
  }
}
