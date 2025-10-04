import { Request, Response } from "express";
import { storage } from "../utils/storage";

export class MarketController {
  static async getPrices(req: Request, res: Response) {
    try {
      const marketData = storage.getAllMarketData();

      res.json({
        prices: marketData.map((data) => ({
          symbol: data.symbol,
          price: data.price,
          change: data.change,
          changePercent: data.changePercent,
          volume: data.volume,
          timestamp: data.timestamp,
        })),
        timestamp: new Date(),
      });
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener precios",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  static async getPriceBySymbol(req: Request, res: Response) {
    try {
      const { symbol } = req.params;
      const marketData = storage.getMarketDataBySymbol(symbol.toUpperCase());

      if (!marketData) {
        return res.status(404).json({
          error: "Activo no encontrado",
          message: `No se encontraron datos para el símbolo ${symbol}`,
        });
      }

      res.json({
        symbol: marketData.symbol,
        price: marketData.price,
        change: marketData.change,
        changePercent: marketData.changePercent,
        volume: marketData.volume,
        timestamp: marketData.timestamp,
      });
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener precio",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}
