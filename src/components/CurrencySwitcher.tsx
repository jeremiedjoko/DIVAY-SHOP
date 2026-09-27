"use client";

import type { ShopCurrency } from "@/lib/currency";
import { useCurrency } from "@/store/currency";

const options: { code: ShopCurrency; label: string }[] = [
  { code: "USD", label: "$ USD" },
  { code: "CDF", label: "FC CDF" },
];

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div
      className="flex rounded-full bg-stone-200/80 p-0.5 text-xs font-semibold"
      role="group"
      aria-label="Devise"
    >
      {options.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => setCurrency(code)}
          className={`rounded-full px-3 py-1.5 transition ${
            currency === code ? "bg-white text-stone-900 shadow-sm" : "text-stone-600 hover:text-stone-900"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
