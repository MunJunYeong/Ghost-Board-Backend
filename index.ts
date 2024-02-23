import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  // business logic
  
  res.send('Express Server');
});
app.post('/', (req: Request, res: Response) => {
  // business logic
  
  res.send('Express Server');
});
app.put('/', (req: Request, res: Response) => {
  // business logic
  
  res.send('Express Server');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at <https://localhost>:${port}`);
});