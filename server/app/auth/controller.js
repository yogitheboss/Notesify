import { UserModel } from "../../models/user.js";
import { generateToken } from "../../middleware/auth.js";
import bcrypt from "bcrypt";

/**
 * Handle user login
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if password is hashed
    const isPasswordValid = user.password.startsWith("$2")
      ? await bcrypt.compare(password, user.password)
      : user.password === password;

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      message: "Successfully logged in",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error during login",
      error: error.message,
    });
  }
};

/**
 * Handle user signup
 */
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Please provide all required fields",
    });
  }

  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      message: "Successfully registered",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during registration",
      error: error.message,
    });
  }
};
