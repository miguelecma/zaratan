"use client";
import { useSelector } from "@/app/_contexts/QuoteContext";
import { type QuoteState } from "@/app/_contexts/QuoteContext/reducer";
import { type QuoteItem } from "@/app/_types/clientQuote";
import data from "@/app/mockdata.json";

const enrichOrderWithPricesCombined = (orderItems: { id: string }[], mockData: any[]) => {
  // First group by id and count quantities
  const grouped = orderItems.reduce((acc, item) => {
    acc[item.id] = (acc[item.id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Then create the final array with prices
  return Object.entries(grouped).map(([id, quantity]) => {
    const mockItem = mockData.find(mock => mock.id === id);
    return {
      id,
      quantity,
      price: (mockItem?.price || 0) * quantity
    };
  });
};

export const Order = () => {
  const items = useSelector((state: QuoteState) => state.quote[0].items);
  const itemsWithPrices = enrichOrderWithPricesCombined(items, data);

  return (
    <ul
      role="list"
      className="divide-y divide-gray-200 dark:divide-gray-700"
    >
      {itemsWithPrices.map((item: QuoteItem) => (
        <li className="py-3 sm:py-4">
          <div className="flex items-center">
            <div className="shrink-0">
              <div className="w-8 h-8 rounded-full">°🥂⋆˚࿔</div>
            </div>
            <div className="flex-1 min-w-0 ms-4">
              <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                {item.id}
              </p>
              <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                {item.quantity}
              </p>
            </div>
            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
              {item.price}
            </div>
          </div>
        </li>
      ))}
    </ul>);
}