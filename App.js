import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
const ABI = [
  "function mint() public payable",
  "function totalSupply() public view returns (uint256)",
  "function MAX_SUPPLY() public view returns (uint256)"
];

function App() {
  const [account, setAccount] = useState(null);
  const [supply, setSupply] = useState(0);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    }
  };

  const handleMint = async () => {
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      
      const tx = await contract.mint({ value: ethers.parseEther("0.01") });
      await tx.wait();
      alert("Mint Successful!");
    } catch (err) {
      console.error(err);
      alert("Minting failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>NFT Minter</h1>
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {account.substring(0,6)}...{account.slice(-4)}</p>
          <button disabled={loading} onClick={handleMint}>
            {loading ? "Minting..." : "Mint NFT (0.01 ETH)"}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
