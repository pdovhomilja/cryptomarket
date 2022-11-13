import React from "react";
import {
  ConnectWallet,
  useAddress,
  useMetamask,
  useDisconnect,
} from "@thirdweb-dev/react";

type Props = {};

function Header({}: Props) {
  const connetWithMetamask = useMetamask();
  const address = useAddress();
  const disconnect = useDisconnect();

  return (
    <div>
      <nav>
        <div>
          {address ? (
            <button onClick={disconnect} className="connectWalletBtn">
              Hi, {address}
            </button>
          ) : (
            <button
              onClickCapture={connetWithMetamask}
              className="connectWalletBtn"
            >
              Connect Your Wallet
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Header;
