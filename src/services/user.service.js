import { User } from "../models/index.js";

export const getAllUser = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    throw new Error("Error fetching users: " + error.message);
  }
};

export const getUserByQuery = async (query) => {
  try {
    const users = await User.findAll({
      where: query,
    });
    return users;
  } catch (error) {
    throw new Error("Error fetching users by query: " + error.message);
  }
};

export const getUserByUUID = async (userId) => {
  try {
    const user = await User.findByPk(userId);

    if (!user) throw new Error("User is not found");

    return user;
  } catch (error) {
    throw new Error("Error fetching users by UUID: " + error.message);
  }
};

export const UpdateUser = async (userId, updatedData) => {
  try {
    const user = await User.findByPk(userId);

    if (!user) throw new Error("User is not found");

    if (user.id !== userId) throw new Error("You can update your own account");

    await user.update(updatedData);

    return user;
  } catch (error) {
    throw new Error("Error updating user: " + error.message);
  }
};

export const deleteUserByUUID = async (userId) => {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("User not found!");
    }

    if (user.id !== userId)
      throw new Error("You can delete only your own account");

    await user.destroy();
    return { success: true, message: "User deleted successfully." };
  } catch (error) {
    throw new Error("Error deleting user by UUID: " + error.message);
  }
};

export const DeleteAllUser = async (Model) => {
  try {
    await Model.destroy({
      where: {},
      truncate: true,
    });

    return { success: true, message: "All data deleted successfully." };
  } catch (error) {
    throw new Error("Error deleting user by UUID: " + error.message);
  }
};
