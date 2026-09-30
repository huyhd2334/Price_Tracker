"use client";

import { usePathname } from "next/navigation";
import { LogOut, ArrowLeft, ShoppingCart, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const pathname = usePathname();
  
  const isHomePage = pathname === "/";

  return (
    <div className="flex flex-row justify-between border-b border-gray-200 p-4 bg-white">
      <div className="flex items-center gap-4">
        {!isHomePage && (
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-orange-500 font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Quay lại</span>
          </Link>
        )}
        <Link href="/" className="text-xl text-orange-500 font-bold flex flex-row space-x-1">
          <ShoppingBag />
          <span>PricePulse AI</span>
        </Link>
      </div>

      <div className="flex flex-row space-x-2 items-center">
        {isHomePage ? (
          <button className="flex flex-row items-center gap-2 text-sm p-2 rounded-xl bg-orange-50 hover:bg-orange-400 hover:text-white transition-colors">
            <LogOut color="orange" size={18} />
            <span>LogOut</span>
          </button>
        ) : (
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-gray-100 text-gray-600">
            Trang: {pathname}
          </span>
        )}
      </div>
    </div>
  );
}
