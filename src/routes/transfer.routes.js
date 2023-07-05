import { Router } from "express";
import { 
  Transaction,
  getTransactionsByAccount,
  getTransactionsByUser, 
  createCsrfToken
} from "../controllers/transfer.controllers.js";
import { auth } from "../middlewares/auth.middleware.js";
import csrfProtection  from '../middlewares/csfr.middeleware.js'

const router = Router();

router.post("/transactions", csrfProtection, auth, Transaction);

router.get("/accounts/:id/transactions", auth, getTransactionsByAccount);

router.get("/user/transactions", csrfProtection, auth, getTransactionsByUser);

//Form CSRF request

router.get('/formTransfer', csrfProtection, createCsrfToken);

export default router;