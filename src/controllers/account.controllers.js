import Account from "../models/account.model.js";

export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user.id }).populate("user");
    res.json(accounts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createAccount = async (req, res) => {
  try {
    const { type, currency, balance, numberAccount, numberAccountInterbank } = req.body;
    const newAccount = new Account({
      type,
      currency,
      balance,
      numberAccount,
      numberAccountInterbank,
      user: req.user.id,
    });
    await newAccount.save();
    res.json(newAccount);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const deletedAccount = await Account.findByIdAndDelete(req.params.id);
    if (!deletedAccount)
      return res.status(404).json({ message: ["Account not found"] });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateAccount = async (req, res) => {
  try {
    const { type, currency, balance, numberAccount, numberAccountInterbank } = req.body;
    const accountUpdated = await Account.findOneAndUpdate(
      { _id: req.params.id },
      { type, currency, balance, numberAccount, numberAccountInterbank },
      { new: true }
    );
    return res.json(accountUpdated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: ["Account not found"] });
    return res.json(account);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAccountByType = async (req, res) => {
  const { type } = req.params;
  try {
    const account = await Account.findOne({ type });

    if (account) {
      res.status(200).json({ accountId: account._id });
    } else {
      res.status(404).json({ message: ["Account not found"] });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAccountByNumberAccount = async (req, res) => {
  const { numberAccount } = req.params;

  try {
    const account = await Account.findOne({ numberAccount });

    if (!account) {
      return res.status(400).json({ message: ["Account not found"], });
    }

    res.json({ accountId: account._id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};