import React from 'react';
import { Shield } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="text-center space-y-4">
      <div className="inline-block p-2 glass-card rounded-full animate-glow mb-6">
        <Shield className="w-12 h-12 text-red-400" />
      </div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] bg-clip-text text-transparent">
        Yaks Token Verifier
      </h1>
      <p className="text-slate-400 max-w-2xl mx-auto">
        Verify and analyze tokens across multiple networks with real-time data and comprehensive insights
      </p>
    </div>
  );
};
