// import cron from "node-cron";
// import { AppDataSource } from "../data-source";
// import { Ticket } from "../entities/Ticket";

// export function startTicketScheduler() {
//   console.log("[Scheduler] Starting ticket scheduler...");

//   cron.schedule("* * * * *", async () => {
//     console.log("[Scheduler] Running ticket expiration check...");

//     try {
//       const ticketRepo = AppDataSource.getRepository(Ticket);

//       // Tickets that are expiring within < 48h but not yet expired
//       const soonToExpire = await ticketRepo
//         .createQueryBuilder("ticket")
//         .where("ticket.status != :status", { status: "closed" })
//         .andWhere("ticket.expirationDate > :now", { now: new Date().toISOString() })
//         .andWhere("ticket.expirationDate <= :soon", { 
//             soon: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
//         })
//         .getMany();

//       console.log(`[Scheduler] Found ${soonToExpire.length} tickets expiring soon`);
//       soonToExpire.forEach(t =>
//         console.log(`Ticket ${t.ticketNumber} EXPIRING on ${t.expirationDate}`)
//       );

//       // Tickets that are already expired
//       const expired = await ticketRepo
//         .createQueryBuilder("ticket")
//         .where("ticket.status != :status", { status: "closed" })
//         .andWhere("ticket.expirationDate <= CURRENT_TIMESTAMP")
//         .getMany();

//       console.log(`[Scheduler] Found ${expired.length} expired tickets`);

//       for (const ticket of expired) {
//         ticket.status = "expired";
//         await ticketRepo.save(ticket);
//         console.log(`Ticket ${ticket.ticketNumber} as EXPIRED`);
//       }
//     } catch (err) {
//       console.error("[Scheduler] Error checking tickets:", err);
//     }
//   });
// }

import cron from 'node-cron';
import { db } from '../data-source';

export function startTicketScheduler() {
  console.log('[Scheduler] Starting ticket scheduler...');

  cron.schedule('* * * * *', async () => {
    console.log('[Scheduler] Running ticket expiration check...');

    try {
      const now = new Date();
      const soon = new Date(Date.now() + 48 * 60 * 60 * 1000);

      // Tickets that are expiring within <48h but not yet expired
      const soonToExpireResult = await db.execute(
        `SELECT id, ticketNumber, expirationDate 
         FROM Ticket 
         WHERE status != 'Closed' 
           AND expirationDate > ? 
           AND expirationDate <= ?`,
        [now.toISOString(), soon.toISOString()]
      );

      const soonToExpire = soonToExpireResult.rows as any[];
      console.log(`[Scheduler] Found ${soonToExpire.length} tickets expiring soon`);
      soonToExpire.forEach(t =>
        console.log(`Ticket ${t.ticketNumber} EXPIRING on ${t.expirationDate}`)
      );

      // Tickets that are already expired
      const expiredResult = await db.execute(
        `SELECT id, ticketNumber 
         FROM Ticket 
         WHERE status != 'Closed' 
           AND expirationDate <= ?`,
        [now.toISOString()]
      );

      const expired = expiredResult.rows as any[];
      console.log(`[Scheduler] Found ${expired.length} expired tickets`);

      // Mark expired tickets
      for (const ticket of expired) {
        await db.execute(
          `UPDATE Ticket SET status = 'Expired' WHERE id = ?`,
          [ticket.id]
        );
        console.log(`Ticket ${ticket.ticketNumber} marked as EXPIRED`);
      }
    } catch (err) {
      console.error('[Scheduler] Error checking tickets:', err);
    }
  });
}
