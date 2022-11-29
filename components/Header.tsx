import React from "react";
import { useAddress, useMetamask, useDisconnect } from "@thirdweb-dev/react";
import Link from "next/link";
import {
  BellIcon,
  ShoppingCartIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

type Props = {};

function Header({}: Props) {
  const connetWithMetamask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();

  return (
    <div className="max-w-6xl  mx-auto p-2">
      <nav className="flex justify-between ">
        <div className="flex items-center space-x-4 text-sm">
          {address ? (
            <button onClick={disconnect} className="connectWalletBtn">
              Hi, {address.slice(0, 5) + "..." + address.slice(-4)}
            </button>
          ) : (
            <button
              onClickCapture={connetWithMetamask}
              className="connectWalletBtn"
            >
              Connect Your Wallet
            </button>
          )}
          <p className="headerLink">Daily deals</p>
          <p className="headerLink">Help & Contacts</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <p className="headerLink">Watchlist</p>
          <Link
            href="/additem"
            className="flex items-center hover:link animate-pulse"
          >
            Add to inventory
            <ChevronDownIcon className="h-4" />
          </Link>
        </div>
      </nav>
      <hr className="mt-2" />
      <section className="flex items-center space-x-2 py-5">
        <div className="h-16 w-16 sm:w-28 md:w-44 cursor-pointer flex-shrink">
          <Link href="/">
            <Image
              className="w-full h-full object-contain"
              alt=""
              src="/images/mintit-high-resolution-logo-color-on-transparent-background.png"
              width={100}
              height={100}
            />
          </Link>
        </div>

        <div className="flex items-center space-x-2 px-2 md:px-5 py-2 border-[#6D285F] border-2 flex-1">
          <MagnifyingGlassIcon className="text-gray-400 w-5" />
          <input
            className="flex-1 outline-none text-[#6D285F]"
            type="text"
            placeholder="Search for anything"
          />
        </div>

        <button className="hidden sm:inline bg-[#6D285F] text-white px-5 md:px-10 py-2 border-2 border-[#6D285F]">
          Search
        </button>

        <Link href="/create">
          <button className="border-2 border-[#6D285F] px-5 mx:px-10 py-2 text-[#6D285F] hover:bg-[#6D285F]/50 hover:text-white cursor-pointer">
            List Item
          </button>
        </Link>
      </section>
      <hr />
      <section className="flex py-3 space-x-6 text-xs md:text-sm whitespace-nowrap justify-center px-6">
        <p className="link ">Home</p>
        <p className="link ">Elektronics</p>
        <p className="link ">Computers</p>
        <p className="link hidden sm:inline">Video Games</p>
        <p className="link hidden sm:inline">Home & Garder</p>
        <p className="link hidden md:inline">Health & Beauty</p>
        <p className="link hidden lg:inline">Collectibles & Art</p>
        <p className="link hidden lg:inline">Books</p>
        <p className="link hidden lg:inline">Musics</p>
        <p className="link hidden xl:inline">Deals</p>
        <p className="link hidden xl:inline">Others</p>
        <p className="link">More</p>
      </section>
    </div>
  );
}

export default Header;
