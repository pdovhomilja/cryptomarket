import Link from "next/link";
import React from "react";
import "../../styles/globals.css";

type Props = {};

function ThankYou({}: Props) {
  return (
    <div className="w-full h-screen bg-white text-[#EF85D1] flex flex-col justify-center items-center p-10">
      <div className="pb-10 m-40">
        <picture>
          <img
            src="/images/mintit-high-resolution-logo-color-on-transparent-background.png"
            alt="logo"
          />
        </picture>
      </div>
      <div className="items-center justify-center pb-10">
        <h1 className="text-6xl justify-center items-center">
          <span className="text-gray-600 font-bold"> Hi there,</span>
          we just want to tell you{" "}
          <span className="text-[#6D285F] animate-pulse">,thank you!</span>
        </h1>
      </div>
      <div className="items-end">
        <h2 className="text-4xl pb-10">Team MintIT</h2>
      </div>
      <div className="pt-5 flex flex-col items-center md:flex-row">
        <Link
          href="/"
          className="bg-[#EF85D1] border border-[#6D285F] rounded-lg text-[#6D285F] font-bold p-2 m-2"
        >
          Go to homepage
        </Link>
        <p>or</p>
        <Link
          href=""
          className="bg-[#EF85D1] border border-[#6D285F] rounded-lg text-[#6D285F] font-bold p-2 m-2 cursor-not-allowed"
        >
          Mint our welcome NFT
        </Link>
        <span>(100/100 NFT minted)</span>
      </div>
      <div></div>
    </div>
  );
}

export default ThankYou;
