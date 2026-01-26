import "reflect-metadata";
import express from "express";
import cors from "cors";

async function bootstrap() {
  const app = express();

  // Habilitar CORS
  app.use(
    cors({
      origin: "http://127.0.0.1:5173",
      credentials: true,
    }),
  );

  app.listen(
    {
      port: 4000,
    },
    () => {
      console.log(`Servidor iniciado na porta 4000!`);
    },
  );
}

bootstrap();
