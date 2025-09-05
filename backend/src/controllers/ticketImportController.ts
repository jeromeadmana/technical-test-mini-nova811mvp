import { Request, Response } from "express";
import fs from "fs";
import { AppDataSource } from "../data-source";
import { Ticket } from "../entities/Ticket";
import { User } from "../entities/User";
import { AuthRequest } from "../middlewares/authMiddleware";

export const importTicketsFromUpload = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const raw = fs.readFileSync(req.file.path, "utf-8");
    const ticketData = JSON.parse(raw);

    if (!Array.isArray(ticketData)) {
      return res.status(400).json({ error: "Invalid file format, expected an array" });
    }

    const ticketRepo = AppDataSource.getRepository(Ticket);
    const userRepo = AppDataSource.getRepository(User);
    const importedTickets: Ticket[] = [];

    const creator = await userRepo.findOneBy({ id: req.user!.id });
    if (!creator) return res.status(400).json({ error: "User not found" });

    for (const t of ticketData) {
      const ticket = ticketRepo.create({
        title: t.title,
        organization: t.organization,
        status: t.status || "open",
        createdDate: t.createdDate ? new Date(t.createdDate) : new Date(),
        expirationDate: t.expirationDate ? new Date(t.expirationDate) : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        location: t.location,
        notes: t.notes,
        createdBy: creator,
        ticketNumber: `T-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      });

      await ticketRepo.save(ticket);
      importedTickets.push(ticket);
    }

    fs.unlinkSync(req.file.path);

    return res.json({ imported: importedTickets.length, tickets: importedTickets });

  } catch (err) {
    console.error("Error importing tickets:", err);
    return res.status(500).json({ error: "Server error" });
  }
};


