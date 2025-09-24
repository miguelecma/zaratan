import { CartButton } from "./CartButton";

export function Navbar() {
  return (
    <nav className="w-full fixed top-0 right-0 left-0 bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            🍸 Zaratan
          </span>
        </a>

        <div className="block md:w-auto" id="navbar-multi-level">
          <ul className="flex flex-wrap items-center justify-between w-full font-medium md:space-x-8 min-w-56 ">
            <li>
              <a
                href="/#menu"
                className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent"
                aria-current="page"
              >
                Menu
              </a>
            </li>

            <li>
              <CartButton />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
