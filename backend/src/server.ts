import './config/env';
import { connectDb } from './lib/db';
import app from './app';
import { PORT } from './config/env';

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to connect to database', error);
  process.exit(1);
});
