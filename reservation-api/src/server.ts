import app from "./app";
import sequelize from "./config/database";
import dotenv from "dotenv";
import logger from "./config/logger";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function connectWithRetry(retries = 5, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      logger.info("Conectado ao banco com sucesso.");
      return true;
    } catch (err) {
      logger.error(`Erro ao conectar no banco (tentativa ${i + 1} de ${retries}):`, err);
      if (i < retries - 1) {
        logger.info(`Tentando novamente em ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        throw err;
      }
    }
  }
}

(async () => {
  try {
    await connectWithRetry(10, 5000);

    app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    logger.error("Erro ao conectar no banco:", error);
  }
})();
