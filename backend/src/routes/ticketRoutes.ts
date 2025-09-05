import { Router } from "express";
import multer from "multer";
import { authenticateJWT, authorizeRoles } from "../middlewares/authMiddleware";
import * as ticketController from "../controllers/ticketController";
import * as ticketImportController from "../controllers/ticketImportController";

const router = Router();
const upload = multer({ dest: "uploads/" });

// GET ALL TICJETS
router.get(
  "/", 
  authenticateJWT, 
  ticketController.getTickets
);

// CREATE A NEW TICKET
router.post(
  "/", 
  authenticateJWT, 
  authorizeRoles("admin", "contractor"), 
  ticketController.createTicket
);

// RENEW TICKET EXPIRATION
router.post(
  "/:id/renew", 
  authenticateJWT, 
  authorizeRoles("admin", "contractor"), 
  ticketController.renewTicket
);

// CLOSE A TICKET
router.post(
  "/:id/close", 
  authenticateJWT, 
  authorizeRoles("admin"), 
  ticketController.closeTicket
);

// IMPORT TICKETS FROM UPLOADED FILE
router.post(
  "/import",
  authenticateJWT,
  authorizeRoles("admin", "contractor"),
  upload.single("file"),
  ticketImportController.importTicketsFromUpload
);

export default router;
