import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

const UserActivity = sequelize.define(
  "borrowing_activity",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Sequelize will automatically generate UUIDv4
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID, // Use UUID, not UUIDV4
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    book_id: {
      type: DataTypes.UUID, // Use UUID, not UUIDV4
      allowNull: false,
      references: {
        model: "Book",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    borrow_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    return_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.VIRTUAL,
      get() {
        const returnDate = this.getDataValue("return_date");
        const dueDate = this.getDataValue("due_date");
        if (!returnDate) return "Not Returned";
        return returnDate <= dueDate ? "On Time" : "Overdue";
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { timestamps: false }
);

export default UserActivity;
