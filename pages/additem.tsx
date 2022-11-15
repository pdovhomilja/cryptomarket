import { useAddress, useContract } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Header from "../components/Header";

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
  if (isLoading)
    return (
      <div>
        <Header />
        <div className="text-center">
          <div role="status">
            <svg
              className="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="text-md">Working proces on BlockChain ...</span>
          </div>
        </div>
      </div>
    );

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-10 border">
        <h1 className="text-4xl font-bold">Add an Item to the Market place</h1>
        <h2 className="text-xl font-semibold pt-5">Items detail</h2>
        <p className="pb-5">
          By adding an item to the marketplace, your are essentially Minting an
          NFT ot the item into your wallet which we can then list for sale!
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
              Name of Item
            </label>
            <input
              className="formField"
              placeholder="Name of item...."
              type="text"
              name="name"
              id="name"
            />
            <label htmlFor="">Description</label>
            <input
              className="formField"
              placeholder="Enter Description"
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
              className="bg-blue-600 font-bold text-white rounded-full py-4 px-10 w-56 mt-5 md:mt-auto mx-auto md:ml-auto"
            >
              Add/Mint Item
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default addItem;
