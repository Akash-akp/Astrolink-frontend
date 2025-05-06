import React, { createContext, useState, useContext } from 'react';
import { processPayment } from '../services/api';
import { useAuth } from './AuthContext';

const PaymentContext = createContext(undefined);

export const PaymentProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Process registration payment (₹500)
  const processRegistrationPayment = async () => {
    if (!currentUser) {
      throw new Error('User not logged in');
    }

    setIsProcessing(true);
    try {
      const payment = await processPayment(currentUser.id, 500, 'registration');
      setPaymentHistory(prev => [...prev, payment]);
      return payment;
    } finally {
      setIsProcessing(false);
    }
  };

  // Process payment for additional astrologers (₹300)
  const processAdditionalAstrologersPayment = async () => {
    if (!currentUser) {
      throw new Error('User not logged in');
    }

    setIsProcessing(true);
    try {
      const payment = await processPayment(currentUser.id, 300, 'additional_astrologers');
      setPaymentHistory(prev => [...prev, payment]);
      return payment;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        paymentHistory,
        isProcessing,
        processRegistrationPayment,
        processAdditionalAstrologersPayment
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};