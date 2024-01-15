//register
// Import necessary modules
import { Router } from "express";
import { usersManager } from "../../dao/models/User.js";
import { createHash } from "../../utils/hashing.js";
import { onlyLoggedInRest } from "../../middlewares/authorization.js";

// Create the router
export const usersRouter = Router();

// Handle user registration (POST /api/users/)
usersRouter.post("/", async (req, res) => {
  try {
    // Hash the password
    req.body.password = createHash(req.body.password);

    // Create a new user
    const user = await usersManager.create(req.body);

    // Successful response
    res.status(201).json({
      status: "success",
      payload: user.toObject(),
    });
  } catch (error) {
    // Handle errors
    res.status(400).json({ status: "error", message: error.message });
  }
});

usersRouter.get('/current', onlyLoggedInRest, async (req, res) => {
  // @ts-ignore
  const usuario = await usersManager.findOne({ email: req['user'].email }, { password: 0 }).lean()
  res.json({ status: 'success', payload: usuario })
})


// Update user password
usersRouter.put("/resetpass", async function (req, res) {
  try {
    // Hash the new password
    req.body.password = createHash(req.body.password);

    // Update user password
    const updatedUser = await usersManager.updateOne(
      { email: req.body.email },
      { $set: { password: req.body.password } },
      { new: true }
    );

    // Handle case where user does not exist
    if (!updatedUser) {
      return res
        .status(404)
        .json({ status: "error", message: "user not found" });
    }

    // Successful response
    res.json({ status: "success", payload: updatedUser, message: "password updated" });
  } catch (error) {
    // Handle errors
    res.status(400).json({ status: "error", message: error.message });
  }
});

// Update user profile information (PUT /api/users/)
usersRouter.put("/edit", async function (req, res) {
  try {
    // Update user information
    const updatedUser = await usersManager.findOneAndUpdate(
      { email: req.body.email },
      {
        $set: {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          age: req.body.age,
        },
      },
      { new: true }
    );

    // Handle case where user does not exist
    if (!updatedUser) {
      return res
        .status(404)
        .json({ status: "error", message: "user not found" });
    }

    // Successful response
    res.json({
      status: "success",
      payload: updatedUser,
      message: "user information updated",
    });
  } catch (error) {
    // Handle errors
    res.status(400).json({ status: "error", message: error.message });
  }
});
