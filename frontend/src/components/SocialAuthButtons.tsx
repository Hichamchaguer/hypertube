import React from "react";
import { FaGoogle } from "react-icons/fa";

interface SocialAuthButtonsProps {
  isLoading?: boolean;
  onGoogleAuth: () => void;
}

const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  isLoading = false,
  onGoogleAuth,
}) => {
  return (
    <div className="space-y-3">
      

      <button
        onClick={onGoogleAuth}
        disabled={isLoading}
        className="w-full flex items-center justify-center px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaGoogle className="text-xl mr-3 text-red-500" />
        <span>Continue with Google</span>
      </button>
    </div>
  );
};

export default SocialAuthButtons;
