import Account from "../models/account.model.js";
import Transfer from '../models/transfer.model.js'

export const Transaction = async (req, res) => {
  const { accountFromId, accountToId, amount, userFrom } = req.body;
  console.log("req.body",req.body)
  try {
    const accountFrom = await Account.findById(accountFromId);
    const accountTo = await Account.findById(accountToId);
    const accountCheckOwner = await Account.findOne({ _id: accountFromId, user: userFrom.id });

    if (!accountFrom || !accountTo) {
      return res.status(404).json({ message: ['Account not found'] });
    }

    if (!accountCheckOwner) {
      return res.status(403).json({ message: ['The source account does not belong to the user.'] });
    }

    if (accountFrom.balance < amount) {
      return res.status(400).json({ message: ['Insufficient balance'] });
    }

    accountFrom.balance -= amount;
    accountTo.balance += amount;

    await accountFrom.save();
    await accountTo.save();

    const nuevaTransaccion = new Transfer({
      accountFrom: accountFromId,
      accountTo: accountToId,
      amount: amount,
    });
    await nuevaTransaccion.save();

    return res.status(200).json({ message: ['Successful transfer'], success: true });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Error' });
  }
};

export const getTransactionsByAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const transacciones = await Transfer.find({
      $or: [{ accountFrom: id }, { accountTo: id }],
    })
      .populate({
        path: 'accountFrom',
        select: 'balance type numberAccount',
        populate: {
          path: 'user',
          select: 'username email',
        },
      })
      .populate({
        path: 'accountTo',
        select: 'balance type numberAccount',
        populate: {
          path: 'user',
          select: 'username email',
        },
      });

    return res.status(200).json(transacciones);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Error' });
  }
};

export const getTransactionsByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const transacciones = await Transfer.find()
      .populate({
        path: 'accountFrom',
        populate: {
          path: 'user',
          select: 'username'
        }
      })
      .populate({
        path: 'accountTo',
        populate: {
          path: 'user',
          select: 'username'
        }
      })

    const filteredTransactions = transacciones.filter(transaction => {
      return (
        transaction.accountFrom.user._id.toString() === id ||
        transaction.accountTo.user._id.toString() === id
      );
    });

    return res.status(200).json(filteredTransactions);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Error' });
  }
};

export const createCsrfToken = async (req, res) => {
  try {
    const csrfToken = { csrfToken: req.csrfToken() }
    return res.status(200).json(csrfToken);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Error' });
  }
};