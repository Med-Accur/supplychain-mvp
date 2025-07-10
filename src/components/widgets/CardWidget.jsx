import React from 'react';

const CardWidget = (() => (
   <div className="w-full h-full flex flex-col justify-between rounded-xl p-4">
      <div className="text-sm text-gray-500">Total des ventes</div>
      <div className="text-3xl font-semibold text-gray-800 mt-2">€8,530.00</div>
      <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
        <span className="text-gray-400"></span>
        <span className="text-green-600 font-medium">+12.5%</span>
      </div>
    </div>
));

export default CardWidget;