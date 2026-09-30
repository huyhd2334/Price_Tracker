import api from "../lib/axios";

export const getProductByUrlService = async (url) => {
  const result = await api.get("/product/get", { params: { url } });
  return result.data;
};