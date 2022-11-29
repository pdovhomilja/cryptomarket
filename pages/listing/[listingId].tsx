import { UserCircleIcon } from "@heroicons/react/24/solid";
import {
  MediaRenderer,
  useContract,
  useListing,
  useNetwork,
  useMakeBid,
  useMakeOffer,
  useOffers,
  useBuyNow,
  useAddress,
  useNetworkMismatch,
  useAcceptDirectListingOffer,
} from "@thirdweb-dev/react";
import { ListingType, NATIVE_TOKENS } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Countdown from "react-countdown";
import network from "../../utils/network";
import { ethers } from "ethers";
import LoadingSpinner from "../../components/LoadingSpinner";
import Footer from "../../components/Footer";

type Props = {};

function ListingPage({}: Props) {
  const router = useRouter();
  const address = useAddress();

  //GET Bid amount from state by useState hook
  const [bidAmount, setBidAmount] = useState("");

  const [, switchNetwork] = useNetwork();
  const networkMismatch = useNetworkMismatch();

  //GET minimum Bid price
  const [minimumNextBid, setMinimumNextBid] = useState<{
    displayValue: string;
    symbol: string;
  }>();

  //GET ID of item from url(query)
  const { listingId } = router.query as { listingId: string };

  //GET Market place info from ThirdwebProvider
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );

  //Make a Bid
  const {
    mutate: makeBid,
    isLoading: makeBidIsLoading,
    error: makeBidError,
  } = useMakeBid(contract);

  //Use Offer
  const { data: offers } = useOffers(contract, listingId);

  //console.log(offers, "offers");

  //Make offer
  const {
    mutate: makeOffer,
    isLoading: makeOfferIsLoading,
    error: makeOfferError,
  } = useMakeOffer(contract);

  //Buy now function
  const {
    mutate: buyNow,
    isLoading: buyNowLoading,
    error: buyNowError,
  } = useBuyNow(contract);

  //GET Listings from ThirdwebProvider
  const { data: listing, isLoading, error } = useListing(contract, listingId);
  //console.log(listing);

  //Accept offer function
  const {
    mutate: acceptOffer,
    isLoading: acceptOfferIsLoading,
    error: acceptOfferError,
  } = useAcceptDirectListingOffer(contract);

  //console.log(listingId, "listingId");
  //console.log(contract, "contract");
  //console.log(listing, "listing");

  useEffect(() => {
    //Check if listingID or contract exists
    if (!listingId || !contract || !listing) return;

    if (listing.type === ListingType.Auction) {
      fetchMinNextBid();
    }
  }, [listingId, listing, contract]);

  //console.log(minimumNextBid, "minimumNextBid");

  const fetchMinNextBid = async () => {
    if (!listingId || !contract || !listing) return;

    const { displayValue, symbol } = await contract.auction.getMinimumNextBid(
      listingId
    );

    setMinimumNextBid({
      displayValue: displayValue,
      symbol: symbol,
    });
  };

  //
  const formatPlaceholder = () => {
    if (!listing) return;
    if (listing.type === ListingType.Direct) {
      return "Enter Offer Amount";
    }
    if (listing.type === ListingType.Auction) {
      return Number(minimumNextBid?.displayValue) === 0
        ? "Enter Bid Amount"
        : `${minimumNextBid?.displayValue} ${minimumNextBid?.symbol} or more`;
    }
  };

  const buyNft = async () => {
    if (networkMismatch) {
      switchNetwork && switchNetwork(network);
      return;
    }

    if (!listingId || !contract || !listing) return;

    await buyNow(
      { id: listingId, buyAmount: 1, type: listing.type },
      {
        onSuccess(data, variables, context) {
          alert("NFT bought successfully!");
          console.log("SUCESS: ", data, variables, context);
          router.replace("/");
        },
        onError(error, variables, context) {
          alert("ERROR: NFT could not be bought!");
          console.log("ERROR", error, variables, context);
        },
      }
    );
  };

  const createBidOrOffer = async () => {
    try {
      if (networkMismatch) {
        switchNetwork && switchNetwork(network);
        return;
      }
      //Direct Listing
      if (!listing) return;
      if (listing.type === ListingType.Direct) {
        //Compare that bid Amount is the exactly same as the Buy Now price. Using Ethers is doesnt matter even if I am using MATIC on Polygon
        if (
          listing.buyoutPrice.toString() ===
          ethers.utils.parseEther(bidAmount).toString()
        ) {
          console.log("Buyout Price met, buying NFT ...");
          buyNft();
          return;
        }
        //Make an offer
        console.log("Buyout Price doesnt met, making an offer ...");
        await makeOffer(
          {
            quantity: 1,
            listingId,
            pricePerToken: bidAmount,
          },
          {
            onSuccess(data, variables, context) {
              alert("Offer made successfully!");
              console.log("SUCESS: ", data, variables, context);
              setBidAmount("");
            },
            onError(error, variables, context) {
              alert("ERROR: Offer could not be made!");
              console.log("ERROR", error, variables, context);
            },
          }
        );
      }

      //Auction Listing
      if (!listing) return;
      if (listing.type === ListingType.Auction) {
        console.log("Making a Bid ...");

        await makeBid(
          {
            listingId,
            bid: bidAmount,
          },
          {
            onSuccess(data, variables, context) {
              alert("Bid was made successfully!");
              console.log("SUCESS: ", data, variables, context);
              setBidAmount("");
            },
            onError(error, variables, context) {
              alert("ERROR: Bid could not be made!");
              console.log("ERROR", error, variables, context);
            },
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading || makeOfferIsLoading || buyNowLoading || makeBidIsLoading)
    return (
      <div>
        <Header />
        <LoadingSpinner
          message={
            makeOfferIsLoading
              ? "You are making an offer on blockchain ...."
              : buyNowLoading
              ? "You are now in buying process..."
              : makeBidIsLoading
              ? "You are making a bid..."
              : "Loading listings ..."
          }
        />
      </div>
    );

  if (!listing) {
    return <div>Listings not found ...</div>;
  }

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-2 flex flex-col lg:flex-row space-y-10 space-x-5 pr-10">
        <div className="p-10 border mx-auto lg:mx-0 max-w-md lg:max-w-xl">
          <MediaRenderer src={listing.asset.image} />
        </div>
        <section className="flex-1 space-y-5 pb-20 lg:pb-0">
          <div>
            <h1 className="text-xl font-bold">{listing.asset.name}</h1>
            <p className="text-gray-600">{listing.asset.description}</p>
            <p className="flex items-center text-xs sm:text-base">
              <UserCircleIcon className="h-5" />
              <span className="font-bold pr-1">Seller:</span>
              {listing.sellerAddress}
            </p>
          </div>
          <div className="grid grid-cols-2 items-center py-2">
            <p className="font-bold">Listing Type: </p>
            <p>
              {listing.type === ListingType.Direct
                ? "Direct listing"
                : "Auction listing"}
            </p>
            <p className="font-bold">Buy it now Price:</p>
            <p className="text-4xl font-bold">
              {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
              {listing.buyoutCurrencyValuePerToken.symbol}
            </p>
            <button
              onClick={buyNft}
              className="col-start-2 mt-2 bg-[#6D285F] font-bold text-white rounded-full w-44 py-4 px-10"
            >
              Buy now
            </button>
          </div>

          {listing.type === ListingType.Direct && offers && (
            <div className="grid grid-cols-2 gap-y-2">
              <p className="font-bold">Offers:</p>
              <p className="font-bold">
                {offers.length > 0 ? offers.length : 0}
              </p>
              {offers.map((offer) => (
                <>
                  <p className="flex items-center ml-5 text-sm italic">
                    <UserCircleIcon className="h-3 mr-2" />
                    {offer.offeror.slice(0, 5) +
                      "..." +
                      offer.offeror.slice(-4)}
                  </p>
                  <div
                    key={
                      offer.listingId +
                      offer.offeror +
                      offer.totalOfferAmount.toString()
                    }
                  >
                    <p className="text-sm italic">
                      {ethers.utils.formatEther(offer.totalOfferAmount)}{" "}
                      {NATIVE_TOKENS[network].symbol}
                    </p>
                    {listing.sellerAddress === address && (
                      <button
                        onClick={() =>
                          acceptOffer(
                            {
                              listingId,
                              addressOfOfferor: offer.offeror,
                            },
                            {
                              onSuccess(data, variables, context) {
                                alert("Offer accepted successfully!");
                                console.log(
                                  "SUCESS: ",
                                  data,
                                  variables,
                                  context
                                );
                                router.replace("/");
                              },
                              onError(error, variables, context) {
                                alert("ERROR: Offer could not accepted!");
                                console.log("ERROR", error, variables, context);
                              },
                            }
                          )
                        }
                        className="p-2 w-32 bg-red-500/50 rounded-lg font-bold text-xs cursor-pointer"
                      >
                        Accept offer
                      </button>
                    )}
                  </div>
                </>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 space-y-2 items-center justify-end">
            <hr className=" col-span-2" />
            <p className="col-span-2 font-bold">
              {listing.type === ListingType.Direct
                ? "Make an offer"
                : "Bid on this auction"}
            </p>
            {/* */}
            {listing.type === ListingType.Auction && (
              <>
                <p>Current minimum bid:</p>
                <p className="font-bold">
                  {minimumNextBid?.displayValue} {minimumNextBid?.symbol}{" "}
                </p>
                <p>Time remaining:</p>
                <Countdown
                  date={Number(listing.endTimeInEpochSeconds.toString()) * 1000}
                />
              </>
            )}
            <input
              className="border p-2 rounded-lg mr-5 outline-gray-500"
              type="text"
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={formatPlaceholder()}
            />
            <button
              onClick={createBidOrOffer}
              className="bg-red-600 font-bold text-white rounded-full w-44 py-4 px-10"
            >
              {listing.type === ListingType.Direct ? "Offer" : "Bid"}
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default ListingPage;
