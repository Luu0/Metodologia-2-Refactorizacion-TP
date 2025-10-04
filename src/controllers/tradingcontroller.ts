import { Request, Response } from "express";
import { storage } from "../utils/storage";
import { TradingService } from "../services/TradingService";

const tradingService = new TradingService();

export class TradingController {
  static async buyAsset(req: Request, res: Response) {
    try {
      const user = req.user;
      const { symbol, quantity } = req.body;

      if (!symbol || typeof symbol !== "string") {
        return res.status(400).json({ error: "Símbolo requerido" });
      }
      if (!quantity || typeof quantity !== "number" || quantity <= 0) {
        return res.status(400).json({ error: "Cantidad inválida" });
      }

      const asset = storage.getAssetBySymbol(symbol.toUpperCase());
      if (!asset) {
        return res.status(404).json({ error: "Activo no encontrado" });
      }

      const transaction = await tradingService.executeBuyOrder(
        user.id,
        symbol.toUpperCase(),
        quantity
      );

      res.status(201).json({ transaction });
    } catch (error) {
      res.status(400).json({
        error: "Error en orden de compra",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  static async sellAsset(req: Request, res: Response) {
    try {
      const user = req.user;
      const { symbol, quantity } = req.body;

      if (!symbol || typeof symbol !== "string") {
        return res.status(400).json({ error: "Símbolo requerido" });
      }
      if (!quantity || typeof quantity !== "number" || quantity <= 0) {
        return res.status(400).json({ error: "Cantidad inválida" });
      }

      const asset = storage.getAssetBySymbol(symbol.toUpperCase());
      if (!asset) {
        return res.status(404).json({ error: "Activo no encontrado" });
      }

      const transaction = await tradingService.executeSellOrder(
        user.id,
        symbol.toUpperCase(),
        quantity
      );

      res.status(201).json({ transaction });
    } catch (error) {
      res.status(400).json({
        error: "Error en orden de venta",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  static async getTransactionHistory(req: Request, res: Response) {
    try {
      const user = req.user;
      const transactions = tradingService.getTransactionHistory(user.id);
      res.json({ transactions });
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener historial",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}
