import pool from "../../db/index.js";

export const addProduct = async(url, title, current_price, currency, image_url) => {
    const results = await pool.query("INSERT INTO products VALUES ($1, $2, $3, $4, $5) RETURNING url, title, current_price, currency, image_url",
        [url, title, current_price, currency, image_url]);

    return results.rows[0];
}

export const getProductByUrl = async(url) => {
    const results = await pool.query("SELECT * FROM products WHERE url=$1", [url] );
    return results.rows[0];}


export const getProductById = async(id) => {
    const results = await pool.query("SELECT * FROM products WHERE id=$1", [id] );
    return results.rows[0];
}

export const deleteProductById = async(id) => {
    await pool.query("DELETE FROM products WHERE id=$1",[id]);
    return {message: "Project was deleted!"};
}
