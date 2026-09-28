import { Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import { recognizeService } from './recognize.service';

export const recognizeController = {
  recognize(req: Request, res: Response) {
    const simulateFailure = req.body?.simulateFailure === 'true' || req.query.simulateFailure === 'true';
    if (simulateFailure) {
      // Supports US-008 AC3: "informar falha e permitir nova tentativa".
      throw AppError.badRequest(
        'Falha simulada no reconhecimento da imagem. Tente novamente com outra foto.'
      );
    }

    if (!req.file) {
      throw AppError.badRequest('Nenhuma imagem enviada. Envie um arquivo no campo "image".');
    }

    const draft = recognizeService.extractDraftFromImage();
    res.json({
      draft,
      message: 'MOCK: extração de imagem simulada. Revise os dados antes de salvar.',
    });
  },
};
