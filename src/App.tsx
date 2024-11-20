import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import TokenVerifier from './view/TokenVerifier/page';
import AddressVerifier from './view/AddressVerifier/page';

export default function App() {
  const [currentView, setCurrentView] = useState<'token' | 'address'>('token');

  return (
    <div className="App min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setCurrentView('token')}
            className={`btn ${currentView === 'token' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Token Verifier
          </button>
          <button
            onClick={() => setCurrentView('address')}
            className={`btn ${currentView === 'address' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Address Verifier
          </button>
        </div>

        {currentView === 'token' && <TokenVerifier />}
        {currentView === 'address' && <AddressVerifier />}
      </div>

      <Analytics />
      <SpeedInsights />
      <ToastContainer />
    </div>
  );
}