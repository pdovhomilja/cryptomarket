import Link from "next/link";
import React from "react";

type Props = {};

function Footer({}: Props) {
  return (
    <footer className="flex flex-row h-10 bg-white justify-center p-2 sticky bottom-0 text-xs max-w-7xl mx-auto">
      <div className="space-x-2 pr-2">
        powered by Next.js{" "}
        <span className="bg-black rounded-md text-white px-1">13</span> hosted
        by:
        <span className="text-bold underline">
          <Link href="https://www.vercel.com">Vercel</Link>
        </span>
      </div>
      <div className="space-x-2">
        Supported by:
        <Link className="pl-1 font-bold" href="https://www.softbase.cz">
          SoftBase s.r.o.
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
