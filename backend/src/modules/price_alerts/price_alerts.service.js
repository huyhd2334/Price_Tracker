import pool from "../../db/index.js";

export const createAlert = async(user_id, product_id, target_price, is_active) => {
  const results = await pool.query(
        "INSERT INTO price_alerts (user_id, product_id, target_price, is_active) VALUES ($1, $2, $3, $4) RETURNING product_id, target_price, is_active",
        [user_id, product_id, target_price, is_active]
    );
    const data = results.rows[0]
    return data
}

export const deleteAlert = async(id, user_id) => {
    await pool.query("DELETE FROM price_alerts WHERE id = $1 AND user_id=$2", [id, user_id]);
    return { message: "price alerts deleted successfully" };
}