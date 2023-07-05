import { z } from "zod";

export const createAccountSchema = z.object({
  type: z.string({
    required_error: "Type is required",
  }),
  currency: z.string({
    required_error: "Currency is required",
  }),
  balance: z.number({
    required_error: "Balance is required",
  }),
  numberAccount: z.number({
    required_error: "Number Account is required",
  }),
  numberAccountInterbank: z.number({
    required_error: "Number Account Interbank is required",
  }),
});