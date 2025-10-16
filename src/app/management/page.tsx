//import dynamic from 'next/dynamic';
import { DnDContext } from "@/app/_components/DnDContext";
import VirtualList from '@/app/_components/DnDContext/VirtualList';
import { getLogs } from '../actions';

//const VirtualList = dynamic(() => import('@/app/_components/DnDContext/VirtualList'), {
//  ssr: false,
//});


export default function Page() {
  const logs = getLogs();
  return (
    <main>
      <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
            Latest Orders
          </h5>
          <a
            href="#"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            View all
          </a>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <DnDContext />
        </div>
        <VirtualList messagePromise={logs}/>
      </div>
    </main>
  );
}
