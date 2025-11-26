import { Request, Response } from "express";
import { DemoResponse } from "@shared/api";

export function handleDemo(_req: Request, res: Response) {
  try {
    const response: DemoResponse = {
      message: "Hello from Express server",
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error en /api/demo:", error);

    return res.status(500).json({
      error: "Error interno en /api/demo",
    });
  }
}
