import React from 'react';
import { ChevronRight } from 'lucide-react';

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
}

interface UserInfoFormProps {
  userInfo: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
  onSubmit: () => void;
  loading: boolean;
  onViewResults: () => void;
  onViewAnalysis?: () => void;
}

export const UserInfoForm: React.FC<UserInfoFormProps> = ({
  userInfo,
  setUserInfo,
  onSubmit,
  loading,
  onViewResults,
  onViewAnalysis
}) => {
  const handleSubmit = () => {
    const validateEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    if (!userInfo.firstName || !userInfo.lastName || !userInfo.email) {
      alert('Please fill in all fields');
      return;
    }
    
    if (!validateEmail(userInfo.email)) {
      alert('Please enter a valid email address');
      return;
    }

    onSubmit();
  };

  return (
    <div className="max-w-sm sm:max-w-md mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Political Survey</h1>
          <p className="text-gray-300 text-sm sm:text-base">Help us understand your political views.</p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={userInfo.firstName}
              onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
              className="w-full p-3 sm:p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all text-base"
              placeholder="Enter your first name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={userInfo.lastName}
              onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
              className="w-full p-3 sm:p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all text-base"
              placeholder="Enter your last name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              className="w-full p-3 sm:p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all text-base"
              placeholder="Enter your email address"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-lg cursor-pointer disabled:cursor-not-allowed text-base"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Start Survey</span>
                <ChevronRight size={20} />
              </>
            )}
          </button>
          
          <div className="text-center mt-4 space-y-2">
            <button
              onClick={onViewResults}
              className="block text-gray-300 hover:text-white text-sm transition-colors underline"
            >
              Already took the survey? Click to see results
            </button>
            {onViewAnalysis && (
              <button
                onClick={onViewAnalysis}
                className="block text-gray-300 hover:text-white text-sm transition-colors underline"
              >
                View aggregate survey analysis
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};