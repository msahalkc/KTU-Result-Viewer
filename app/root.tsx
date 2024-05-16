import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";
import { NextUIProvider } from "@nextui-org/react";
import Navbar from "./components/Navbar";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-[#003632] text-white">
        <NextUIProvider>
          <div className="min-h-screen min-w-screen flex flex-col items-center">
            <Navbar />
            {children}
          </div>
          <ScrollRestoration />
          <Scripts />
        </NextUIProvider>
      </body>
    </html>
  );
}

export default function App() {
  return (
    <div className="flex items-center my-10 flex-col gap-10 w-full">
      <div className="text-center text-4xl md:text-5xl font-thin">
        <span className="font-bold">KTU Results</span>, But
        <br />
        With a <span className="font-bold">better UI</span>
      </div>
      <Outlet />
    </div>
  );
}
