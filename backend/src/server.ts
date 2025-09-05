import app from './app';
import { AppDataSource } from './data-source';
import { PORT } from './config';
import { startTicketScheduler } from "./jobs/ticketScheduler";

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
    startTicketScheduler();
  })
  .catch(err => {
    console.error('Data Source initialization error:', err);
    process.exit(1);
  });
