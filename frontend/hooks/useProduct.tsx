"use client";
import { useState } from "react";
import { getProductByUrlService } from "../services/product.js";

export interface Product {
  id: number;
  title: string;
  url: string;
  current_price: number;
  target_price: number;
  image_url?: string;
  currency?: string;
}

export function useProduct() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Ban đầu để false
  const [err, setErr] = useState<string | null>(null);

  const getProduct = async (url: string) => {
    setLoading(true);
    setErr(null);
    try {
      const response = await getProductByUrlService(url);
      setProduct(response);
    } catch (err: any) {
      console.error("Error when get product:", err);
      setErr(err.response?.data?.error || "Cannot get product!");
    } finally {
      setLoading(false);
    }
  };

  return {
    product,
    loading,
    err,
    getProduct,
  };
}