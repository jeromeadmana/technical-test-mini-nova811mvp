// import app from './app';
// import { AppDataSource } from './data-source';
// import { PORT } from './config';
// import { startTicketScheduler } from "./jobs/ticketScheduler";

// AppDataSource.initialize()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server listening on http://localhost:${PORT}`);
//     });
//     startTicketScheduler();
//   })
//   .catch(err => {
//     console.error('Data Source initialization error:', err);
//     process.exit(1);
//   });

// src/server.ts
import app from './app';
import { db } from './data-source';
import { PORT } from './config';
import { startTicketScheduler } from './jobs/ticketScheduler';

// Start Express server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

// Start your ticket scheduler, passing the db client if needed
startTicketScheduler();

// Optional: test DB connection on startup
(async () => {
  try {
    const result = await db.execute('SELECT 1');
    console.log('Turso DB connection OK:', result.rows);
  } catch (err) {
    console.error('Turso DB connection error:', err);
  }
})();
