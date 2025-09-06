
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-800" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM6.5 10a.5.5 0 000 1h11a.5.5 0 000-1h-11zm-2 4a.5.5 0 000 1h15a.5.5 0 000-1H4.5zM12 8a.5.5 0 00-.5.5v7a.5.5 0 001 0v-7A.5.5 0 0012 8zm-4.5 1a.5.5 0 000 1h2a.5.5 0 000-1h-2zm9 0a.5.5 0 000 1h2a.5.5 0 000-1h-2z" clipRule="evenodd" />
            </svg>
            <div>
                <h1 className="text-2xl font-bold text-orange-900">Handloom Weaver's Showcase</h1>
                <p className="text-sm text-gray-600">Empowering Artisans, Weaving Futures.</p>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
