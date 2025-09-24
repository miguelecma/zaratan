import Quantifier from "@/app/components/Quantifier";

export type CardProps = {
  name: string;
  description: string;
  price: number;
  id: string;
};

const getNumberFormat = (price: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "COP" }).format(
    price
  );

export function Card(items: CardProps) {
  const { name, description, price, id } = items;
  return (
    <div className="card flex flex-col justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <div>
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {`${name} - ${getNumberFormat(price)}`}
        </h2>
        <p className="mb-3">{description}</p>
      </div>

      <div className="justify-end">
        <Quantifier cardId={id}/>
      </div>
    </div>
  );
}
