"use client";
import Image from "next/image";
import StartJob from "./components/StartJob";
import { Card, CardProps } from "./components/Card";
import data from "./mockdata.json";
import { Navbar } from "./components/Navbar";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[5px_1fr_5px] items-center justify-items-center min-h-screen p-2 pb-20 gap-16 sm:p-10">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <map name="infographic">
          <area
            shape="poly"
            coords="130,147,200,107,254,219,130,228"
            href="https://developer.mozilla.org/docs/Web/HTML"
            alt="HTML"
          />
          <area
            shape="poly"
            coords="130,147,130,228,6,219,59,107"
            href="https://developer.mozilla.org/docs/Web/CSS"
            alt="CSS"
          />
          <area
            shape="poly"
            coords="130,147,200,107,130,4,59,107"
            href="https://developer.mozilla.org/docs/Web/JavaScript"
            alt="JavaScript"
          />
        </map>
        <Image
          width={280}
          height={38}
          useMap="#infographic"
          src="/fondo-lowabv.png"
          alt="MDN infographic"
        />
        <h2 id="menu" className="text-xl">Menu</h2>
        <ul className="grid grid-flow-row grid-cols-1 gap-4">
          {data.map((item: CardProps) => (
            <li key={item.name}>
              <Card
                name={item.name}
                description={item.description}
                price={item.price}
              />
            </li>
          ))}
        </ul>
        <StartJob />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/josepplloo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            className="light"
            src="/vercel.svg"
            alt="Vercel logomark"
            width={16}
            height={16}
          />
          Created with Next.js with love 💕
        </a>
      </footer>
    </div>
  );
}
