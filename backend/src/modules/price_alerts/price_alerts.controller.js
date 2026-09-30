import { getProductById } from "../product/product.service.js";
import { createAlert } from "./price_alerts.service.js";

export const createAlertController = async(req, res) => {
  try {
      const user_id = req.user.userId;
      const product_id = req.params.id;
      const {target_price, is_active} = req.body

      if(!user_id || !product_id){
        throw new console.error("User_id or product_id is invalid!");
      };
      
      const product = await getProductById(product_id);
      
      if(!product){
        return res.status(404).json({ message: "product not found" });
      };
      
      const result = await createAlert(user_id, product_id, target_price, is_active);

      return res.status(201).json(result);
  } catch (error) {
    console.error("Error in createAlertController:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}

export const deleteAlertController = async(req, res) => {
  try {
    const user_id = req.user.userId;
    const product_id = req.params.id;

    if(!user_id || !product_id){
     return res.status(400).json({ error: "user_id or product_id is invalid" });
    };
    
    const product = await getProductById(product_id);
    
    if(!product){
      return res.status(404).json({ message: "product not found" });
    };
    
    const result = await deleteAlert(user_id, product_id);
    return res.status(201).json(result);
  } catch (error) {
    console.error("Error in deleteAlertController:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};