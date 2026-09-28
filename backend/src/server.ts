import { app } from './app';

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[SABORES backend] rodando em http://localhost:${PORT} (dados em memória)`);
});
