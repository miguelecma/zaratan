import StartJob from "@/app/_components/StartJob";
import { Order } from "../_components/Order";

export default async function Page() {
  return (
    <main>
      <aside></aside>
      <StartJob />
      <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
            Latest Customers
          </h5>
          <a
            href="#"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            View all
          </a>
        </div>
        <div className="flow-root">
          <Order />
        </div>
      </div>
    </main>
  );
}
