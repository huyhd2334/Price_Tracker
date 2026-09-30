"use client";

import { useState } from "react";
import { Search, PlusCircle, ShoppingCartPlus } from "lucide-react";
import { useProduct } from "@/hooks/useProduct";

export default function AddProductForm() {
  const [url, setUrl] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const {getProduct, loading, err, product} = useProduct();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit:", { url });
    await getProduct(url)
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-5 rounded-2xl border border-gray-200"
    >
      <h2 className="text-base text-gray-800 mb-4 flex items-center gap-2">
        <ShoppingCartPlus /> <span>Search new item</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        <div className="lg:col-span-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="url"
            required
            placeholder="Enter link Shopee, Tiki, Lazada..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900"
          />
        </div>

        <div className="lg:col-span-1">
          <input
            type="number"
            required
            placeholder="Expected price (VND)"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900"
          />
        </div>
       
        <div className="lg:col-span-1">
          {!loading?(
            <button
                type="submit"
                className="w-full h-full py-2.5 px-4 bg-blue-400 hover:bg-blue-500 active:bg-blue-500 text-white font-medium rounded-xl text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
            >
            <PlusCircle className="w-4 h-4" />
            Get
          </button>):(
            <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin mx-auto"></div>          
           )}
        </div>
      </div>
    </form>
  );
}