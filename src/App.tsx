import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import TokenVerifier from './view/TokenVerifier/page';
import AddressVerifier from './view/AddressVerifier/page';
import { motion } from 'framer-motion';
import { Coins, Wallet } from 'lucide-react';


export default function App() {
  const [currentView, setCurrentView] = useState<'token' | 'address'>('token');

  const tabVariants = {
    active: { 
      backgroundColor: 'rgba(255, 255, 255, 0.1)', 
      color: '#ffffff',
      transition: { duration: 0.3 }
    },
    inactive: { 
      backgroundColor: 'transparent', 
      color: '#94a3b8',
      transition: { duration: 0.3 }
    }
  };

  const contentVariants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="App min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <nav className="flex justify-center mb-8">
          <div className="bg-gray-800 p-1 rounded-full flex space-x-1">
            <motion.button
              variants={tabVariants}
              animate={currentView === 'token' ? 'active' : 'inactive'}
              onClick={() => setCurrentView('token')}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-full transition-all duration-300 ${
                currentView === 'token'
                  ? 'bg-red-500/20 text-red-400 shadow-lg shadow-red-500/10'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <Coins size={20} />
              <span>Token</span>
            </motion.button>
            <motion.button
              variants={tabVariants}
              animate={currentView === 'address' ? 'active' : 'inactive'}
              onClick={() => setCurrentView('address')}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-full transition-all duration-300 ${
                currentView === 'address'
                  ? 'bg-red-500/20 text-red-400 shadow-lg shadow-red-500/10'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <Wallet size={20} />
              <span>Address</span>
            </motion.button>
          </div>
        </nav>

        <motion.div
          key={currentView}
          variants={contentVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {currentView === 'token' && <TokenVerifier />}
          {currentView === 'address' && <AddressVerifier />}
        </motion.div>
      </div>

      <Analytics />
      <SpeedInsights />
      <ToastContainer />
    </div>
  );
}