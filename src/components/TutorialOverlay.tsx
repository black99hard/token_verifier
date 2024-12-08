import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialStep {
  target: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  image: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    target: '.nav-tabs',
    content:
      'Caution: As a newbie, be careful when trading on decentralized exchanges (DEX) and investing in meme tokens. They can be volatile and risky. Always do your research!',
    position: 'bottom',
    image: '/images/dex.jpg', // Example image path
  },
    {
      target: '.nav-tabs',
      content: 'Welcome to Brat Token Verifier! Use these tabs to switch between verifying tokens and addresses.',
      position: 'bottom',
      image: '/images/step1.png', // Example image path
    },
    {
      target: '.network-buttons',
      content: 'Select the blockchain network you want to verify tokens or addresses on. We support multiple networks like Tron, Solana, and Ton.',
      position: 'bottom',
      image: '/images/step2.png', // Example image path
    },
    {
      target: '.input-field',
      content: 'Enter the contract address of the token or the blockchain address you want to verify here.',
      position: 'top',
      image: '/images/step3.png', // Example image path
    },
    {
      target: '.verify-button',
      content: 'Click this button to verify the entered address or token. The app will fetch and display detailed information.',
      position: 'left',
      image: '/images/setp4.png', // Example image path
    },
    {
      target: '.recent-tokens',
      content: 'Here you can see a list of recently updated tokens. Click on any token to view its details.',
      position: 'top',
      image: '/images/step5.png', // Example image path
    },
    {
      target: '.watchlist-button',
      content: 'Add tokens to your watchlist for quick access and monitoring. Click here to view or manage your watchlist.',
      position: 'left',
      image: '/images/step6.png', // Example image path
    },
    {
      target: '.address-input-field',
      content: 'Enter the blockchain address you want to verify here.',
      position: 'top',
      image: '/images/step7.png', // Example image path
    },
    {
      target: '.address-verify-button',
      content: 'Click this button to verify the entered address. The app will fetch and display detailed information.',
      position: 'left',
      image: '/images/step8.png', // Example image path
    },
    {
      target: '.address-info',
      content: 'Here you can see detailed information about the verified address, including balance, transactions, and token holdings.',
      position: 'top',
      image: '/images/step9.png', // Example image path
    },
    
  ];




  

interface TutorialOverlayProps {
  onComplete: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const currentTutorialStep = tutorialSteps[currentStep];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
      >
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-6 max-w-md w-full rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-semibold text-slate-100 mb-4">
            Welcome to Brat Token Verifier
          </h2>
          <div className="mb-4 relative h-40 w-full">
            <img
              src={currentTutorialStep.image}
              alt={`Tutorial step ${currentStep + 1}`}
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
          <p className="text-slate-200 mb-6">{currentTutorialStep.content}</p>
          <div className="flex justify-between">
            <button
              onClick={handleSkip}
              className="btn-secondary"
            >
              Skip Tutorial
            </button>
            <button
              onClick={handleNext}
              className="btn-primary"
            >
              {currentStep < tutorialSteps.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TutorialOverlay;