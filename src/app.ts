import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import * as dotenv from "dotenv";
dotenv.config();

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { marketInstrument } from './routes/market-instrument';
import { portfolio } from './routes/portfolio';
import { exampleDataRouter } from './routes/example-data';

import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(express.urlencoded({extended:true}))

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signupRouter)
app.use(marketInstrument)
app.use(portfolio)
app.use(exampleDataRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
