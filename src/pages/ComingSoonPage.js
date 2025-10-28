import React from 'react';

const ComingSoonPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center">
        {/* Changed text-indigo-700 to text-[#228B22] for Forest Green */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-[#228B22] mb-4 animate-pulse">
          Page Coming Soon
        </h1>
        <p className="text-xl md:text-2xl text-gray-600">
          We're working hard to bring you something great!
        </p>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse {
          animation: pulse 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ComingSoonPage;