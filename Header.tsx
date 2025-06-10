
import React from 'react';
import { AGI_TITLE_VERSION, AGI_NAME } from '../constants';
import { AgiIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 p-4 shadow-md flex items-center space-x-3 sticky top-0 z-50">
      <AgiIcon className="w-10 h-10 text-purple-400" />
      <div>
        <h1 className="text-xl font-semibold text-gray-100">{AGI_TITLE_VERSION}</h1>
        <p className="text-xs text-purple-300">{AGI_NAME} - Chat Interface</p>
      </div>
    </header>
  );
};

export default Header;
