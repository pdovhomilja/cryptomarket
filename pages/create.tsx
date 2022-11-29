import React, { useState } from "react";
import Header from "../components/Header";
import {
  useAddress,
  useContract,
  MediaRenderer,
  useNetwork,
  useNetworkMismatch,
  useOwnedNFTs,
  useCreateAuctionListing,
  useCreateDirectListing,
} from "@thirdweb-dev/react";
import {
  NFT,
  NFTDrop,
  NATIVE_TOKENS,
  NATIVE_TOKEN_ADDRESS,
} from "@thirdweb-dev/sdk";
import network from "../utils/network";
import { useRouter } from "next/router";
import Footer from "../components/Footer";

type Props = {};

function Create({}: Props) {
  //GET wallet address
  const address = useAddress();

  //Route to destination
  const router = useRouter();

  //GET Market place info from ThirdwebProvider
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );
  //console.log(contract);

  //GET state of slected NFT
  const [selectedNft, setSelectedNft] = useState<NFT>();
  console.log(selectedNft);

  //GET NFTs info from ThirdwebProvider
  const { contract: collectionContract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );

  //GET NFTs I own from ThirdwebProvider
  const ownedNfts = useOwnedNFTs(collectionContract, address);
  //console.log("My Wallet address: ", address);

  //Check network network from thirdweb provider
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  //Get Loading or Error state
  const {
    mutate: createDirectListing,
    isLoading: isLoadingDirect,
    error: errorDirect,
  } = useCreateDirectListing(contract);

  const {
    mutate: createAuctionListing,
    isLoading: isLoadingAuction,
    error: errorAuction,
  } = useCreateAuctionListing(contract);

  //Submit form and Create listings on ThirdwebProvider
  const handelCreateListing = async (e: React.FormEvent<HTMLFormElement>) => {
    //Prevent data reloading or revalidation
    e.preventDefault();
    //Check if you are on right blockchain/network
    if (networkMismatch) {
      switchNetwork && switchNetwork(network);
      return;
    }
    //Check if you have selected NFT
    if (!selectedNft) return;

    //Grab data from form and check typeof and put it to target variable
    const target = e.target as typeof e.target & {
      elements: { listingType: { value: string }; price: { value: string } };
    };
    //Desctructure target variable and get data from target variable to listingType and price variable
    const { listingType, price } = target.elements;

    //Check if listingType is directListing or auctionListing
    console.log(listingType.value);
    console.log(price.value);
    if (listingType.value === "directListing") {
      //console.log(listingType.value);
      //Automaticaly do the listing from ThirdwebProvider
      createDirectListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
          tokenId: selectedNft.metadata.id,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7,
          quantity: 1,
          buyoutPricePerToken: price.value,
          startTimestamp: new Date(),
        },
        {
          onSuccess(data, variales, context) {
            console.log("SUCCESS:", data, variales, context);
            router.push("/");
          },
          onError(error, variales, context) {
            console.log("ERROR:", error, variales, context);
          },
        }
      );
    }

    if (listingType.value === "auctionListing") {
      createAuctionListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
          buyoutPricePerToken: price.value,
          tokenId: selectedNft.metadata.id,
          startTimestamp: new Date(),
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7,
          quantity: 1,
          reservePricePerToken: 0,
        },
        {
          onSuccess(data, variales, context) {
            console.log("SUCCESS:", data, variales, context);
            router.push("/");
          },
          onError(error, variales, context) {
            console.log("ERROR:", error, variales, context);
          },
        }
      );
    }
  };
  //console.log(ownedNfts);

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-10 pt-2">
        <h1 className="text-4xl font-bold">List an Item</h1>
        <h2 className="text-xl font-semibold pt-5">
          Select an Item you would like to Sell
        </h2>
        <hr className="mb-5" />
        <p>Bellow you will find the NFT's you own in your wallet</p>
        <div className="flex overflow-x-scroll space-x-2 p-4">
          {ownedNfts?.data?.map((nft) => (
            <div
              key={nft.metadata.id}
              onClick={() => setSelectedNft(nft)}
              className={`flex flex-col space-y-2 card min-w-fit border-2 bg-gray-100 ${
                nft.metadata.id === selectedNft?.metadata.id
                  ? "border-black"
                  : "border-transparent"
              }`}
            >
              <MediaRenderer
                className="h-48 rounded-lg"
                src={nft.metadata.image}
              />
              <p className="text-lg truncate font-bold">{nft.metadata.name}</p>
              <p className="text-xs truncate">{nft.metadata.description}</p>
            </div>
          ))}
        </div>
        {selectedNft && (
          <form onSubmit={handelCreateListing}>
            <div className="flex flex-col p-10">
              <div className="grid grid-cols-2 gap-5">
                <label className="border-r font-light">
                  Direct Listing / Fixed Price
                </label>
                <input
                  className="ml-auto h-10 w-10"
                  type="radio"
                  name="listingType"
                  value="directListing"
                />
                <label className="border-r font-light">Auction</label>
                <input
                  className="ml-auto h-10 w-10"
                  type="radio"
                  name="listingType"
                  value="auctionListing"
                />
                <label className="border-r font-light">Price</label>
                <input
                  type="text"
                  placeholder="0.05"
                  className="bg-gray-100 p-5"
                  name="price"
                />
              </div>
              <button
                className="bg-[#6D285F] text-white rounded-lg p-4 mt-8"
                type="submit"
              >
                Create listing
              </button>
            </div>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Create;
