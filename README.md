# DBank Blockchain Project

This is a Next.js application that provides a user interface for interacting with a "DBank" smart contract. Users can connect their Ethereum wallets, view balances, and perform deposit, withdrawal, and transfer operations.

## Key Features

*   **Wallet Integration**: Connect to Ethereum wallets using RainbowKit (supports MetaMask, WalletConnect, Coinbase Wallet, etc.).
*   **Smart Contract Interaction (DBank)**:
    *   View current balance held in the DBank smart contract.
    *   Deposit ETH into the DBank contract.
    *   Withdraw ETH from the DBank contract.
    *   Transfer ETH to another address through the DBank contract.
*   **Responsive Design**: The user interface is designed to work seamlessly across various devices (desktops, tablets, and mobile phones).
*   **Light/Dark Mode**: Toggle between light and dark themes for optimal viewing comfort.
*   **Modern Tech Stack**: Built with Next.js (React framework), Tailwind CSS for styling, and Ethers.js for Ethereum interactions.

## Main Dependencies

*   [Next.js](https://nextjs.org/): React framework for server-rendered applications.
*   [React](https://reactjs.org/): JavaScript library for building user interfaces.
*   [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework for rapid UI development.
*   [Ethers.js](https://docs.ethers.io/): Library for interacting with the Ethereum blockchain and its ecosystem.
*   [RainbowKit](https://www.rainbowkit.com/): React library for adding wallet connection to your dapp.
*   [Wagmi](https://wagmi.sh/): React Hooks for Ethereum.

For a full list of dependencies, please see the `package.json` file.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v16.x or later recommended)
*   npm, yarn, or pnpm (package manager)
*   An Ethereum wallet extension in your browser (e.g., MetaMask).

### Installation & Setup

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <https://github.com/smrafy20/DbankWD.git>
    cd <DbankWD>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```


```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

The page auto-updates as you edit files in the `app` directory.




## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
