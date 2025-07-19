import React from 'react';
import { ChevronRight, User } from 'lucide-react';

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
}

export const UserInfoForm: React.FC<UserInfoFormProps> = ({
  userInfo,
  setUserInfo,
  onSubmit,
  loading
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
    <div className="max-w-sm mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <div className="bg-blue-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-blue-300" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Political Survey</h1>
          <p className="text-gray-300 text-base">Help us understand your political views</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={userInfo.firstName}
              onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
              className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all"
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
              className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all"
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
              className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all"
              placeholder="Enter your email address"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-lg cursor-pointer disabled:cursor-not-allowed"
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
        </div>
      </div>
    </div>
  );
};