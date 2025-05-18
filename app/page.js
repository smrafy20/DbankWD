"use client"
import { useEffect, useState } from "react"
import {ethers} from "ethers"
import abi from "./dbank.json";
import Header from "./components/header";


export default function Page(){
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(0);
  const [contract, setContract] = useState(null);
  const [bankBalance, setBankBalance] = useState(0);
  const [formData, setFormData] = useState({
    depositAmount: "",
    withdrawAmount: "",
    transferAddress: "",
    transferAmount: "",
  });
  const contractAddress = "0xF78a2b72e07919a5CE1852674b7522DdC22191fE";

  useEffect(() => {
    async function initializeContract() {
      if (typeof window.ethereum !== "undefined") {
        // Check if an account is connected (handled by RainbowKit, but good to have a fallback check)
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            setAddress(accounts[0]); // Update address state if needed here, though RainbowKit handles it
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const userAddress = await signer.getAddress(); // Redundant if using accounts[0]
            setAddress(userAddress);
            const userEthBalance = await provider.getBalance(userAddress);
            setBalance(ethers.utils.formatEther(userEthBalance));
            const dbankContract = new ethers.Contract(contractAddress, abi, signer);
            setContract(dbankContract);
        } else {
            // No accounts connected, RainbowKit's ConnectButton will handle prompting connection.
            console.log("No accounts connected initially.");
        }
      } else {
        console.log("MetaMask not detected. RainbowKit will guide user.");
      }
    }
    initializeContract();
  }, []); // Consider re-running if wallet connection status changes, Wagmi hooks are better for this

  useEffect(() => {
    async function fetchBankBalance() {
      if (contract) {
        try {
            const currentBankBalance = await contract.getBalance();
            // Assuming getBalance() returns a BigNumber, convert to a user-friendly format
            setBankBalance(ethers.utils.formatEther(currentBankBalance)); 
            console.log("DBank Balance:", ethers.utils.formatEther(currentBankBalance));
        } catch (error) {
            console.error("Error fetching DBank balance:", error);
            // setBankBalance("Error"); // Or handle error display appropriately
        }
      }
    }
    fetchBankBalance();
  }, [contract]);

  async function handleDeposit() {
    if (contract && formData.depositAmount) {
      try {
        const tx = await contract.deposit({
          value: ethers.utils.parseEther(formData.depositAmount),
        });
        await tx.wait();
        const updatedBankBalance = await contract.getBalance();
        setBankBalance(ethers.utils.formatEther(updatedBankBalance));
        setFormData((prev) => ({ ...prev, depositAmount: "" }));
        console.log("Deposit successful:", tx);
      } catch (error) {
        console.error("Deposit error:", error);
      }
    }
  }

  async function handleWithdraw() {
    if (contract && formData.withdrawAmount) {
      try {
        const tx = await contract.withdraw(ethers.utils.parseEther(formData.withdrawAmount));
        await tx.wait();
        const updatedBankBalance = await contract.getBalance();
        setBankBalance(ethers.utils.formatEther(updatedBankBalance));
        setFormData((prev) => ({ ...prev, withdrawAmount: "" }));
        console.log("Withdrawal successful:", tx);
      } catch (error) {
        console.error("Withdrawal error:", error);
      }
    }
  }

  async function handleTransfer() {
    if (contract && formData.transferAddress && formData.transferAmount) {
      try {
        const tx = await contract.transferTo(
          formData.transferAddress,
          ethers.utils.parseEther(formData.transferAmount)
        );
        await tx.wait();
        const updatedBankBalance = await contract.getBalance();
        setBankBalance(ethers.utils.formatEther(updatedBankBalance));
        setFormData((prev) => ({ ...prev, transferAddress: "", transferAmount: "" }));
        console.log("Transfer successful:", tx);
      } catch (error) {
        console.error("Transfer error:", error);
      }
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  return(
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center ">
      <Header />
      <main className="w-full max-w-5xl p-4 md:p-8 flex-grow">
        <div className="text-center my-6 md:my-8">
          <p className="text-xl md:text-2xl lg:text-3xl text-sky-600 dark:text-sky-400">
            Welcome!
          </p>
          <p className="text-lg md:text-xl lg:text-2xl text-emerald-600 dark:text-emerald-400 mt-2">
            DBank Contract Balance:{" "}
            <span className="font-semibold">{bankBalance} ETH</span>
          </p>
          {address && (
            <p className="text-sm md:text-md text-gray-600 dark:text-gray-400 mt-1">
              Your Wallet: <span className="font-mono">{`${address.slice(0, 6)}...${address.slice(-4)}`}</span> | ETH Balance: {balance}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Deposit Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl ring-1 ring-gray-200 dark:ring-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-center text-sky-700 dark:text-sky-300">
              Deposit
            </h2>
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 outline-none placeholder-gray-400 dark:placeholder-gray-500"
                name="depositAmount"
                placeholder="Amount in ETH"
                value={formData.depositAmount}
                onChange={handleChange}
              />
              <button
                className="bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 text-white font-semibold rounded-lg px-4 py-3 transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-gray-800"
                onClick={handleDeposit}
                disabled={!contract || !formData.depositAmount}
              >
                Deposit Funds
              </button>
            </div>
          </div>

          {/* Withdraw Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl ring-1 ring-gray-200 dark:ring-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700 dark:text-blue-300">
              Withdraw
            </h2>
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none placeholder-gray-400 dark:placeholder-gray-500"
                name="withdrawAmount"
                placeholder="Amount in ETH"
                value={formData.withdrawAmount}
                onChange={handleChange}
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-3 transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                onClick={handleWithdraw}
                disabled={!contract || !formData.withdrawAmount}
              >
                Withdraw Funds
              </button>
            </div>
          </div>

          {/* Transfer Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl ring-1 ring-gray-200 dark:ring-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-center text-emerald-700 dark:text-emerald-300">
              Transfer
            </h2>
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 outline-none placeholder-gray-400 dark:placeholder-gray-500"
                name="transferAddress"
                placeholder="Recipient Address"
                value={formData.transferAddress}
                onChange={handleChange}
              />
              <input
                type="text"
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 outline-none placeholder-gray-400 dark:placeholder-gray-500"
                name="transferAmount"
                placeholder="Amount in ETH"
                value={formData.transferAmount}
                onChange={handleChange}
              />
              <button
                className="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold rounded-lg px-4 py-3 transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-gray-800"
                onClick={handleTransfer}
                disabled={!contract || !formData.transferAddress || !formData.transferAmount}
              >
                Transfer Funds
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}