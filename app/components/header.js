"use client"
import '@rainbow-me/rainbowkit/styles.css';
import {
    ConnectButton,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
polygonMumbai
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { useTheme } from '../contexts/ThemeContext';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

const { chains, publicClient } = configureChains(
  [polygonMumbai],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID || '' }),
    publicProvider()
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'My DBank App',
  projectId: process.env.NEXT_PUBLIC_RAINBOW_PROJECT_ID || 'YOUR_DEFAULT_PROJECT_ID',
  chains
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

export default function Header(){
    const { theme, toggleTheme } = useTheme();

    return(
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains} modalSize="compact">
            <header className="w-full bg-gray-100 dark:bg-gray-800 shadow-md sticky top-0 z-50">
              <div className="container mx-auto max-w-7xl flex items-center justify-between py-4 md:py-5 px-4 sm:px-6 lg:px-8">
                <p className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">DBank</p>
                <div className="flex items-center space-x-3 md:space-x-4">
                  <ConnectButton />
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
                    aria-label="Toggle theme"
                  >
                    {theme === 'light' ? (
                      <MoonIcon className="h-5 w-5 md:h-6 md:w-6" />
                    ) : (
                      <SunIcon className="h-5 w-5 md:h-6 md:w-6" />
                    )}
                  </button>
                </div>
              </div>
            </header>
          </RainbowKitProvider>
        </WagmiConfig>
    )

}