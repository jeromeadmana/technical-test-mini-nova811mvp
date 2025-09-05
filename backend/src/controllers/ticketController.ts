import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Ticket } from "../entities/Ticket";
import { AuthRequest } from "../middlewares/authMiddleware";
import { User } from "../entities/User";

export const getTickets = async (req: AuthRequest, res: Response) => {
  try {
    const ticketRepo = AppDataSource.getRepository(Ticket);

    let tickets;
    if (req.user?.role === "admin") {
      tickets = await ticketRepo.find({ relations: ["createdBy"] });
    } else {
      tickets = await ticketRepo.find({
        where: { createdBy: { id: req.user!.id } },
        relations: ["createdBy"],
      });
    }

    return res.json(tickets);
  } catch (err) {
    console.error("Error fetching tickets:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const createTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { title, organization, location, notes, createdDate, expirationDate } = req.body;

    const userRepo = AppDataSource.getRepository(User);
    const creator = await userRepo.findOneBy({ id: req.user!.id });
    if (!creator) return res.status(401).json({ error: "Invalid user" });

    const ticketRepo = AppDataSource.getRepository(Ticket);

    const ticket = ticketRepo.create({
      title,
      ticketNumber: `T-${Date.now()}`,
      organization,
      status: "open",
      createdDate: createdDate ? new Date(createdDate) : new Date(),
      expirationDate: expirationDate ? new Date(expirationDate) : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      location,
      notes,
      createdBy: creator,
    });

    await ticketRepo.save(ticket);
    return res.status(201).json(ticket);
  } catch (err) {
    console.error("Error creating ticket:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const renewTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const ticketRepo = AppDataSource.getRepository(Ticket);

    const ticket = await ticketRepo.findOne({
      where: { id: Number(id) },
      relations: ["createdBy"],
    });
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    if (ticket.status === "closed") {
      return res.status(400).json({ error: "Cannot renew a closed ticket" });
    }

    if (!ticket.expirationDate || isNaN(ticket.expirationDate.getTime())) {
      ticket.expirationDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
    } else {
      ticket.expirationDate = new Date(
        ticket.expirationDate.getTime() + 15 * 24 * 60 * 60 * 1000
      );
    }

    ticket.status = "open";

    await ticketRepo.save(ticket);

    console.log(`Ticket ${ticket.id} renewed by user ${req.user?.id}`);

    return res.json(ticket);
  } catch (err) {
    console.error("Error renewing ticket:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const closeTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const ticketRepo = AppDataSource.getRepository(Ticket);

    const ticket = await ticketRepo.findOne({
      where: { id: Number(id) },
      relations: ["createdBy"],
    });
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    ticket.status = "closed";
    await ticketRepo.save(ticket);

    return res.json(ticket);
  } catch (err) {
    console.error("Error closing ticket:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
