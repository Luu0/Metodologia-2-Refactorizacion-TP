import { Request, Response } from "express";
import { storage } from "../utils/storage";

export class PortfolioController {
  static async getPortfolio(req: Request, res: Response) {
    try {
      const user = req.user;
      const portfolio = storage.getPortfolioByUserId(user.id);

      if (!portfolio) {
        return res.status(404).json({ error: "Portafolio no encontrado" });
      }

      res.json({ portfolio });
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener portafolio",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  static async getPerformance(req: Request, res: Response) {
    try {
      const user = req.user;
      const portfolio = storage.getPortfolioByUserId(user.id);

      if (!portfolio) {
        return res.status(404).json({ error: "Portafolio no encontrado" });
      }

      const performance = {
        totalValue: portfolio.totalValue,
        totalInvested: portfolio.totalInvested,
        totalReturn: portfolio.totalReturn,
        percentageReturn: portfolio.percentageReturn,
      };

      res.json({ performance });
    } catch (error) {
      res.status(500).json({
        error: "Error al analizar rendimiento",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}
