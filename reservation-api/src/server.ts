import app from "./app";
import sequelize from "./config/database";
import dotenv from "dotenv";
import logger from "./config/logger";

dotenv.config();

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    logger.info("Conectado ao banco com sucesso.");

    app.listen(PORT, () => {
      logger.info(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    logger.error("Erro ao conectar no banco:", error);
  }
})();
