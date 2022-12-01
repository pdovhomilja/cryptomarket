import React, { useState } from "react";
import { useAddress, useMetamask, useDisconnect } from "@thirdweb-dev/react";
import Link from "next/link";
import {
  BellIcon,
  ShoppingCartIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { US, CZ } from "country-flag-icons/react/3x2";
import { setGlobalState, useGlobalState } from "../state/index.js";
import { useLangContext } from "../context/lang.js";

type Props = {};

function Header({}: Props) {
  const connetWithMetamask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();

  //Set language
  /*
  const setLang = (e: string) => {
    setGlobalState("lang", e);
  };
  */
  //Set searchQuery
  const setSearch = (q: string) => {
    setGlobalState("search", q);
  };

  //const [lang] = useGlobalState("lang");
  const [lang, setLang] = useLangContext();

  console.log(lang, "lange header");

  const [searchValue, setSearchValue] = useState("");
  //Set search Query to global state
  setSearch(searchValue);

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
              {lang === "cz" ? "Připojit peněženku" : "Connect Your Wallet"}
            </button>
          )}
          <p className="headerLink">
            {lang === "cz" ? "Nabídka dne" : "Daily deals"}
          </p>
          <Link href="/contact">
            <p className="headerLink">
              {lang === "cz" ? "Kontakt" : "Contact"}
            </p>
          </Link>
        </div>
        <div className="flex flex-row justify-center items-center ">
          <p className="border border-red-700 rounded-md px-2 text-white bg-red-500">
            Network: Polygon - Mumbai - Testnet
          </p>
          <p className="px-2"></p>
          <p className="border border-blue-700 rounded-md px-2 text-white bg-blue-500">
            <Link href="https://faucet.polygon.technology/">Free: Tokens</Link>
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <p onClick={() => setLang("en")} className="headerLink">
            <US title="United States" className="w-5 h-5" />
          </p>
          <p onClick={() => setLang("cz")} className="headerLink">
            <CZ title="Czechia" className="w-5 h-5" />
          </p>
          <Link
            href="/additem"
            className="flex items-center hover:link animate-pulse"
          >
            {lang === "cz" ? "Přidat novou položku" : "Add to inventory"}
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
            name="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={
              lang === "cz"
                ? "Zadej co chceš hledat ..."
                : "Search for anything"
            }
          />
        </div>

        <button className="hidden sm:inline bg-[#6D285F] text-white px-5 md:px-10 py-2 border-2 border-[#6D285F]">
          {lang === "cz" ? "Vyhledat" : "Search"}
        </button>

        <Link href="/create">
          <button className="border-2 border-[#6D285F] px-5 mx:px-10 py-2 text-[#6D285F] hover:bg-[#6D285F]/50 hover:text-white cursor-pointer">
            {lang === "cz" ? "Zalistovat položku" : "List item"}
          </button>
        </Link>
      </section>
      <hr />
      <section className="hidden py-3 space-x-6 text-xs md:text-sm whitespace-nowrap justify-center px-6">
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
