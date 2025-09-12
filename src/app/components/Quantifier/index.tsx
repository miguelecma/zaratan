export default function Quantifier() {
  return (
    <div className="grid grid-rows-1 grid-cols-3">
      <input type="button" value="-" className="bg-blue-500 text-white py-2 px-4 rounded-lg 
               hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 
               active:scale-95 transition-all duration-150 ease-in-out" onClick={() => {}} />
      <input type="number"
             step="1"
             max=""
             value={0}
             onChange={() => {}}
             className="" />
      <input type="button" value="+" className="bg-blue-500 text-white py-2 px-4 rounded-lg 
               hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 
               active:scale-95 transition-all duration-150 ease-in-out" onClick={() => {}} />
    </div>
  )
}