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

const CartButton = () => {
  return (
    <a
      href="/order"
      className="relative inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-sm hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      <svg
        className="w-4 h-4 me-2"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 16"
      >
        <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
        <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
      </svg>
      <span className="sr-only">Notifications</span>
      Mis Ordenes
      <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
        8
      </div>
    </a>
  );
};
