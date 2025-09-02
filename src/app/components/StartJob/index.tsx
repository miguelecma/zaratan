"use client"

export type props = {
  handleClick: () => void;
}

export default function StartJob({handleClick}: props) {
  return (
    <main className="flex h-lvh items-center justify-center">
      <button
        onClick={handleClick}
        className="btn btn-primary cursor-pointer h-26 bg-green-500 text-xl sm:text-3xl rounded-lg hover:bg-green-600"
      >
        Start Background Job
      </button>
    </main>
  )
}