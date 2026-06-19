import pool from "../config/db.js";

export const ProductModel = {
  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM products");
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [
      id,
    ]);
    return rows[0];
  },

  // NUEVO MÉTODO: Búsqueda relacional
  findByCategoryId: (categoryId) => {
    // Usamos .filter() porque una categoría puede tener MUCHOS productos
    // Retorna un arreglo (vacío si no hay coincidencias, o con los productos encontrados)
    return productsData.filter((p) => p.categoryId === categoryId);
  },

  create: async (newProduct) => {
    const {name, price, stock, categori_id} = newProduct;
    const [result] = await pool.query(
      "INSERT INTO products (name, price, stock, categori_id) VALUES (?, ?, ?, ?)",
      [name, price, stock, categori_id],
    );

    console.log("Resultado de la inserción:", result);

    //result.insertID contiene el ID autogenerado por MySQL
    const [createdProduct] = await pool.query(
      "SELECT * FROM products WHERE id = ?",
      [result.insertId]
    );
    
    return createdProduct[0];
  },

  update: async (id, updatedFields) => {
    const {name, price, stock, categori_id} = updatedFields;
    const isActiveField = updatedFields.isActive !== undefined ? updatedFields.isActive : updatedFields.is_active;

    let query = "UPDATE products SET name = ?, price = ?, stock = ?, categori_id = ?";
    const params = [ name, price, stock, categori_id];

    if (isActiveField !== undefined) {
        query += ", is_active = ?";
        params.push(isActiveField ? 1 : 0);
    }
    query += " WHERE id = ?";
    params.push(id);

    const [result] = await pool.query(query, params);
    
    if (result.affectedRows === 0) return null;
    
    const [updatedProduct] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
    return updatedProduct[0];
  },

  delete: async(id) => {
    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};
