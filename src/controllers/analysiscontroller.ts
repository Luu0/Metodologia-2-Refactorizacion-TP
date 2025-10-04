import { Request, Response } from "express";
import { MarketAnalysisService } from "../services/MarketAnalysisService";

const analysisService = new MarketAnalysisService();

export class AnalysisController {
  static async getRiskAnalysis(req: Request, res: Response) {
    try {
      const user = req.user;
      const riskAnalysis = analysisService.analyzePortfolioRisk(user.id);
      res.json({ riskAnalysis });
    } catch (error) {
      res.status(500).json({
        error: "Error en análisis de riesgo",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  static async getRecommendations(req: Request, res: Response) {
    try {
      const user = req.user;
      const recommendations = analysisService.generateInvestmentRecommendations(user.id);
      res.json({ recommendations });
    } catch (error) {
      res.status(500).json({
        error: "Error al generar recomendaciones",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}
