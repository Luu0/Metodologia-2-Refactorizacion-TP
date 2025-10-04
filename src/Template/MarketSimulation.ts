export abstract class MarketSimulation {
  abstract getImpactFactor(): number;

  run(currentPrice: number): number {
    const impactFactor = this.getImpactFactor();
    return Math.max(currentPrice + currentPrice * impactFactor, 0.01);
  }
}

export class BullMarketSimulation extends MarketSimulation {
  getImpactFactor(): number {
    return 0.05 + Math.random() * 0.1; // +5% a +15%
  }
}

export class BearMarketSimulation extends MarketSimulation {
  getImpactFactor(): number {
    return -(0.05 + Math.random() * 0.1); // -5% a -15%
  }
}

export class CrashMarketSimulation extends MarketSimulation {
  getImpactFactor(): number {
    return -(0.15 + Math.random() * 0.2); // -15% a -35%
  }
}

export class RecoveryMarketSimulation extends MarketSimulation {
  getImpactFactor(): number {
    return 0.1 + Math.random() * 0.15; // +10% a +25%
  }
}
