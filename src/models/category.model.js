import pool from "../config/db.js";
import { updateCategory } from "../controllers/category.controller.js";

export const CategoryModel = {
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM categories");
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [
      id,
    ]);
    return rows[0];
  },

  create: async (newCategory) => {
    const {name} = newCategory;
    const [result] = await pool.query(
      "INSERT INTO categories (name) VALUES (?)",
      [name],
    );

    console.log("Resultado de la inserción:", result);

    //result.insertID contiene el ID autogenerado por MySQL
    const [createdCategory] = await pool.query(
      "SELECT * FROM categories WHERE id = ?",
      [result.insertId],
    );
    return createdCategory[0];
    
  },

  update: async (id, updatedFields) => {
    const {name} = updatedFields;
    const [result] = await pool.query(
      "UPDATE categories SET name = ? WHERE id = ?",
      [name, id],
    );

    if (result.affectedRows === 0) return null;

    const [updateCategory] = await pool.query(
      "SELECT * FROM categories WHERE id = ?",
      [id],
    );
    return updateCategory[0];

  },

  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM categories WHERE id ?",
      [id,]
    );
    return result.affectedRows > 0;

  },
};