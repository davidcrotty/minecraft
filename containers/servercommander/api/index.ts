import express, { Express, Request, Response } from 'express';
import { createLogger, transports, format } from "winston";


const app: Express = express();
const port = process.env.PORT;
const logger = createLogger({
  transports: [new transports.Console()],
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
});

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.post('/minecraft', (req: Request, res: Response) => {
  logger.info("Starting server minecraft server");
  res.status(201).end();
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});