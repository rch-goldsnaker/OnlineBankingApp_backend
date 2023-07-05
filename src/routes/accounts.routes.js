import { Router } from "express";
import {
  createAccount,
  deleteAccount,
  getAccount,
  getAccounts,
  updateAccount,
  getAccountByType,
  getAccountByNumberAccount
} from "../controllers/account.controllers.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createAccountSchema } from "../schemas/account.schema.js";

const router = Router();

router.get("/accounts", auth, getAccounts);

router.post("/accounts", auth, validateSchema(createAccountSchema), createAccount);

router.get("/accounts/:id", auth, getAccount);

router.put("/accounts/:id", auth, updateAccount);

router.delete("/accounts/:id", auth, deleteAccount);

router.get("/accountByType/:type", auth, getAccountByType);

router.get("/accountByNumberAccount/:numberAccount", auth, getAccountByNumberAccount);

export default router;