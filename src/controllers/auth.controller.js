import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from "../libs/jwt.js";
import Account from "../models/account.model.js";
import { randomInt } from "crypto";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userFound = await User.findOne({ email });

    if (userFound)
      return res.status(400).json({
        message: ["The email is already in use"],
      });

    // hashing the password
    const passwordHash = await bcrypt.hash(password, 10);

    // creating the user
    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });

    // saving the user in the database
    const userSaved = await newUser.save();

    // create access token
    const token = await createAccessToken({
      id: userSaved._id,
    });

    const generateAccountNumber = async () => {
      let accountNumber;
      let isUnique = false;

      while (!isUnique) {
        accountNumber = randomInt(100, 999);

        const existingAccount = await Account.findOne({ $or: [{ numberAccount: accountNumber }, { numberAccountInterbank: accountNumber }] });

        if (!existingAccount) {
          isUnique = true;
        }
      }

      return accountNumber;
    };

    // Create a new account for the user
    const newAccount1 = new Account({
      type: "ahorros",
      currency: "dolares",
      balance: 100,
      numberAccount: await generateAccountNumber(),
      numberAccountInterbank: await generateAccountNumber(),
      user: userSaved._id,
    });

    await newAccount1.save();

    const newAccount2 = new Account({
      type: "corriente",
      currency: "dolares",
      balance: 100,
      numberAccount: await generateAccountNumber(),
      numberAccountInterbank: await generateAccountNumber(),
      user: userSaved._id,
    });

    await newAccount2.save();

    const newAccount3 = new Account({
      type: "nomina",
      currency: "dolares",
      balance: 100,
      numberAccount: await generateAccountNumber(),
      numberAccountInterbank: await generateAccountNumber(),
      user: userSaved._id,
    });

    await newAccount3.save();

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });

    if (!userFound)
      return res.status(400).json({message: ["The email does not exist"]});

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({
        message: ["The password is incorrect"],
      });
    }

    const token = await createAccessToken({
      id: userFound._id,
      username: userFound.username,
    });

    console.log(process.env.NODE_ENV !== "development")
    res.cookie("token", token, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
    });

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.send(false);

  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) return res.sendStatus(401);

    const userFound = await User.findById(user.id);
    if (!userFound) return res.sendStatus(401);

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  });
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });
  return res.sendStatus(200);
};
