import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePayment } from '../../contexts/PaymentContext';
import LoadingSpinner from '../common/LoadingSpinner';
import proxyService from '../../utils/proxyService';
import { toast } from 'react-toast';

const RegistrationForm = ({ initialRole }) => {
  const { processRegistrationPayment, isProcessing } = usePayment();
  const navigate = useNavigate();

  const [role] = useState(initialRole); // Role is set based on the initialRole prop
  const [showPayment] = useState(initialRole === 'client'); // Show payment only for clients

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // For clients, process payment first
      // if (role === 'client') {
      //   await processRegistrationPayment();
      // }

      let roleData;
      if (role === 'client') {
        roleData = 'USER';
      } else if (role === 'astrologer') {
        roleData = 'ASTROLOGER';
      }

      // Then register the user
      const registrationData = { ...formData, role:roleData };

      const response = await proxyService.post('/auth/register', {
          ...registrationData
      })

      if (response.status == 201) {
        toast.success('Registration successful!');
      }

      // Redirect based on role
      if (role === 'client') {
        navigate('/client/dashboard');
      } else {
        navigate('/astrologer/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error('Invalid input. Please check your details.');
      }
      else if (error.response && error.response.status === 409) {
        toast.error('Email already exists. Please use a different email.');
      }
      else if (error.response && error.response.status === 500) {
        toast.error('Server error. Please try again later.');
      }
      else if (error.response && error.response.status === 403) {
        toast.error('You do not have permission to access this resource.');
      }
      console.error('Registration error:', error);
      // Handle error (show message, etc.)
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            pattern="[0-9]{10}"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            onInvalid={(e) => e.target.setCustomValidity("Please enter a 10-digit phone number")}
            required
          />
        </div>

        {/* Payment Section (for clients only) */}
        {showPayment && (
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Payment Information</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Client registration requires a one-time payment of ₹500.
            </p>
            <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                For demo purposes, payment will be simulated. No actual payment will be processed.
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={ isProcessing}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            { isProcessing ? (
              <LoadingSpinner size="small" />
            ) : (
              role === 'client' ? 'Pay & Register' : 'Register'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;