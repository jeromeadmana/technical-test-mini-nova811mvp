import cron from "node-cron";
import { AppDataSource } from "../data-source";
import { Ticket } from "../entities/Ticket";

export function startTicketScheduler() {
  console.log("[Scheduler] Starting ticket scheduler...");

  cron.schedule("* * * * *", async () => {
    console.log("[Scheduler] Running ticket expiration check...");

    try {
      const ticketRepo = AppDataSource.getRepository(Ticket);

      // Tickets that are expiring within < 48h but not yet expired
      const soonToExpire = await ticketRepo
        .createQueryBuilder("ticket")
        .where("ticket.status != :status", { status: "closed" })
        .andWhere("ticket.expirationDate > :now", { now: new Date().toISOString() })
        .andWhere("ticket.expirationDate <= :soon", { 
            soon: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
        })
        .getMany();

      console.log(`[Scheduler] Found ${soonToExpire.length} tickets expiring soon`);
      soonToExpire.forEach(t =>
        console.log(`Ticket ${t.ticketNumber} EXPIRING on ${t.expirationDate}`)
      );

      // Tickets that are already expired
      const expired = await ticketRepo
        .createQueryBuilder("ticket")
        .where("ticket.status != :status", { status: "closed" })
        .andWhere("ticket.expirationDate <= CURRENT_TIMESTAMP")
        .getMany();

      console.log(`[Scheduler] Found ${expired.length} expired tickets`);

      for (const ticket of expired) {
        ticket.status = "expired";
        await ticketRepo.save(ticket);
        console.log(`Ticket ${ticket.ticketNumber} as EXPIRED`);
      }
    } catch (err) {
      console.error("[Scheduler] Error checking tickets:", err);
    }
  });
}
