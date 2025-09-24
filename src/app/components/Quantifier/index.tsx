import { useSelector } from "@/app/contexts/QuoteContext/index";
import { type ClientQuote } from "@/app/types/clientQuote";
import { type QuoteState } from "@/app/contexts/QuoteContext/reducer";
import { useDispatch } from "@/app/contexts/QuoteContext/index";
import { actionCreators } from "@/app/contexts/QuoteContext/reducer";

export default function Quantifier({ cardId }: { cardId: string }) {
  const clientQuote: ClientQuote = useSelector(
    (state: QuoteState) => state.quote[0]
  );
    
  const itemExist = clientQuote?.items?.length || 0;
  let quantity = 0;
  if (itemExist) {
    quantity = clientQuote?.items?.filter( (item) => item.id === cardId).length;
  }

  const dispatch = useDispatch();

  const addItem = () => dispatch(actionCreators.increment(cardId));
  const removeItem = () => dispatch(actionCreators.decrement(cardId));
  const removeAllItems = () => dispatch(actionCreators.deleteAllItems(cardId));

  return (
    <>
      {quantity === 0 ? (
        <button type="button" className="btn btn-primary dark:text-gray-100" onClick={addItem}>
          Agregar
        </button>
      ) : (
        <div className="grid gap-1 grid-rows-1 grid-cols-4">
          <input
            type="button"
            value="🗑️"
            className="bg-red-500 text-white py-2 px-4 rounded-lg 
               hover:bg-red-700 focus:ring-4 focus:ring-red-300 
               active:scale-95 transition-all duration-150 ease-in-out"
            onClick={removeAllItems}
          />
          <input
            type="button"
            value="-"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg 
               hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 
               active:scale-95 transition-all duration-150 ease-in-out"
            onClick={removeItem}
          />
          <input
            type="number"
            step="1"
            max=""
            value={quantity}
            className=""
            disabled
          />
          <input
            type="button"
            value="+"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg 
               hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 
               active:scale-95 transition-all duration-150 ease-in-out"
            onClick={addItem}
          />
        </div>
      )}
    </>
  );
}
