export class RiskAnalysis {
  userId: string;
  portfolioRisk: "low" | "medium" | "high";
  diversificationScore: number;
  recommendations: string[];
  calculatedAt: Date;

  constructor(userId: string) {
    this.userId = userId;
    this.portfolioRisk = "medium";
    this.diversificationScore = 0;
    this.recommendations = [];
    this.calculatedAt = new Date();
  }

  updateRisk(
    risk: "low" | "medium" | "high",
    diversificationScore: number,
    recommendations: string[]
  ): void {
    this.portfolioRisk = risk;
    this.diversificationScore = diversificationScore;
    this.recommendations = recommendations;
    this.calculatedAt = new Date();
  }
}