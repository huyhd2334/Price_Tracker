import { getProductByUrl } from "./product.service.js";

export const getProductByUrlController = async (req, res) => {
  try {
    const rawUrl = req.query.url;

    if (!rawUrl || typeof rawUrl !== "string") {
      console.log("URL parameter is required")
      return res.status(400).json({ error: "URL parameter is required" });
    }
    const cleanUrl = rawUrl.trim().replace(/\/+$/, "");

    let product = await getProductByUrl(cleanUrl);

    if (!product) {
      product = await getProductByUrl(`${cleanUrl}/`);
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found in database" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error in getProductByUrlController:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};