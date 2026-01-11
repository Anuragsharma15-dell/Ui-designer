import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import User from "../models/User.js";

app.post(
  "/api/users/sync",
  ClerkExpressRequireAuth(),
  async (req, res) => {
    const { userId } = req.auth;

    let user = await User.findOne({ clerkUserId: userId });

    if (!user) {
      user = await User.create({
        clerkUserId: userId,
      });
    }

    res.status(200).json(user);
  }
);
