import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';

// Carrega a skill nexa do diretório
const skillPath = path.join(__dirname, 'skills', 'nexa', 'SKILL.md');
let nexaSystemPrompt = '';

try {
  nexaSystemPrompt = fs.readFileSync(skillPath, 'utf-8');
} catch (error) {
  console.error('Aviso: Não foi possível carregar a skill Nexa:', error);
  nexaSystemPrompt = 'You are a helpful GeneXus assistant.';
}

export const chatHandler = async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Mensagem é obrigatória' });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Requer a chave configurada no .env
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Ou o modelo preferido
      messages: [
        { role: 'system', content: nexaSystemPrompt },
        { role: 'user', content: message }
      ],
      stream: true,
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('Erro na chamada da LLM:', error);
    res.status(500).json({ error: 'Falha ao processar a requisição com a LLM', details: error.message });
  }
};
