import { app } from './app';
import { connection } from './config/db-connection';

const start = async () => {

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  connection()

  app.listen(process.env.PORT, () => {
    console.log('Listening on port '+process.env.PORT+'!!!!!!!!');
  });
};

start();
