import type { NextPage } from "next";
import Header from "../components/Header";
import {
  useContract,
  useActiveListings,
  MediaRenderer,
} from "@thirdweb-dev/react";
import { ListingType } from "@thirdweb-dev/sdk";
import { BanknotesIcon, ClockIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import { useGlobalState } from "../state";

const Home: NextPage = () => {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );

  const { data: listings, isLoading: loadingListings } =
    useActiveListings(contract);

  const [lang] = useGlobalState("lang");

  //Prepare for search in NFT
  const search = "";

  return (
    <div className="">
      <Header />
      <main className="max-w-6xl mx-auto py-2 px-6 font-bold">
        {loadingListings ? (
          <LoadingSpinner
            message={
              lang === "cz"
                ? "Nahrávám data z blockchainu ..."
                : "Loading data from blockchain..."
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mx-auto">
            {listings
              ?.filter((listing) =>
                listing.asset.name?.toString().toLowerCase().match(search)
              )
              ?.map((listing) => (
                <Link
                  className="flex flex-col card hover:scale-105 transition-all duration-150 ease-out"
                  key={listing.id}
                  href={`/listing/${listing.id}`}
                >
                  <div>
                    <div className="flex-1 flex flex-col pb-2 items-center">
                      <MediaRenderer
                        className="w-44"
                        src={listing.asset.image}
                      />
                    </div>
                    <div className="pt-2 space-y-4">
                      <div>
                        <h2 className="text-lg truncate">
                          {listing.asset.name}
                        </h2>
                        <hr />
                        <p className="truncate text-sm text-gray-600 mt-2">
                          {listing.asset.description}
                        </p>
                      </div>
                      <p>
                        <span className="font-bold mr-2">
                          Price:{" "}
                          {listing.buyoutCurrencyValuePerToken.displayValue}
                        </span>
                        {listing.buyoutCurrencyValuePerToken.symbol}
                      </p>
                      <div
                        className={`flex items-center space-x-1 justify-end text-xs border w-fit ml-auto p-2 rounded-lg text-white ${
                          listing.type === ListingType.Direct
                            ? "bg-[#6D285F]"
                            : "bg-[#EF85D1]"
                        }`}
                      >
                        <p>
                          {listing.type === ListingType.Direct
                            ? lang === "cz"
                              ? "Koupit"
                              : "Buy now"
                            : lang === "cz"
                            ? "Aukce"
                            : "Auction"}
                        </p>
                        {listing.type === ListingType.Direct ? (
                          <BanknotesIcon className="h-4" />
                        ) : (
                          <ClockIcon className="h-4" />
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Home;
