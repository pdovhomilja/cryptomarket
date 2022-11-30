import { useAddress, useContract } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";
import { useGlobalState } from "../state";

type Props = {};

function addItem({}: Props) {
  //GET address from Wallet
  const address = useAddress();

  //Route to destination
  const router = useRouter();

  //Make hook for web form
  const [preview, setPreview] = useState<string>();
  const [image, setImage] = useState<File>();

  //Get contract from useState
  const { contract, isLoading } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );

  //console.log(contract, "Contract");

  const mintNft = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contract || !address) {
      alert("You are not connected, Connect your wallet!");
      return;
    }

    if (!image) {
      alert("Please select an image");
      return;
    }

    const target = e.target as typeof e.target & {
      name: { value: string };
      description: { value: string };
    };

    const metadata = {
      name: target.name.value,
      description: target.description.value,
      image: image, //IMG URL or File
    };

    try {
      const tx = await contract.mintTo(address, metadata);

      const receipt = tx.receipt; //the transaction receipt
      const tokenId = tx.id; //the id of the NFT minted
      const nft = await tx.data(); //(optional) fetch details of minted NFT

      console.log(receipt, tokenId, nft);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };
  //console.log(address);
  //console.log(contract);
  const [lang] = useGlobalState("lang");
  if (isLoading)
    return (
      <div>
        <Header />
        <LoadingSpinner message="Working process on BlockChain ..." />
      </div>
    );

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-10 border">
        <h1 className="text-4xl font-bold">
          {lang === "cz"
            ? "Přidat novou položku do Marketu"
            : "Add an Item to the Market place"}
        </h1>
        <h2 className="text-xl font-semibold pt-5">
          {lang === "cz" ? "Detaily položky" : "Items detail"}
        </h2>
        <p className="pb-5">
          {lang === "cz"
            ? "Přidáním nové položky do Marketu, vytvoříte nové NFT, které se následně zobrazí ve Vaší peněžence a budete ho moci nabídnout/zalistovat na Marketu ve formě přímého prodeje  nebo aukce"
            : "By adding an item to the marketplace, your are essentially Minting an NFT ot the item into your wallet which we can then list for sale!"}
        </p>
        <div className="flex flex-col justify-center items-center md:flex-row md:space-x-5 pt-5">
          <img
            className="border h-80 w-80 object-contain"
            src={preview || "https://links.papareact.com/ucj"}
            alt=""
          />
          <form
            onSubmit={mintNft}
            className="flex flex-col flex-1 p-2 space-y-2"
            action=""
          >
            <label className="font-light" htmlFor="">
              {lang === "cz" ? "Název položky" : "Name of item"}
            </label>
            <input
              className="formField"
              placeholder={
                lang === "cz" ? "Pojmenujte Váš item" : "Name of item ..."
              }
              type="text"
              name="name"
              id="name"
            />
            <label htmlFor="">
              {lang === "cz" ? "Popis položky" : "Description"}
            </label>
            <input
              className="formField"
              placeholder={
                lang === "cz" ? "Popis položky ..." : "Description of item ...."
              }
              type="text"
              name="description"
              id="description"
            />
            <label htmlFor="Image of the Item"></label>
            <input
              className="mb-10"
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setPreview(URL.createObjectURL(e.target.files?.[0]));
                  setImage(e.target.files?.[0]);
                }
              }}
            />
            <button
              type="submit"
              className="bg-[#6D285F] font-bold text-white rounded-full py-4 px-10 mt-5 md:mt-auto mx-auto md:ml-auto"
            >
              {lang === "cz"
                ? "Vložit/Vymintovat položku(NFT)"
                : "Add/Mint Item (NFT)"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default addItem;
