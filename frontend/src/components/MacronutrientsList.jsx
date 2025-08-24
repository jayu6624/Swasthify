import React, { useState, useEffect } from 'react';

const MacronutrientsList = ({ userData }) => {
    const macros = [
      { name: 'Protein', current: userData.macros.protein.current, goal: userData.macros.protein.goal, color: 'bg-green-600' },
      { name: 'Carbs', current: userData.macros.carbs.current, goal: userData.macros.carbs.goal, color: 'bg-red-500' },
      { name: 'Fat', current: userData.macros.fat.current, goal: userData.macros.fat.goal, color: 'bg-yellow-500' },
      { name: 'Fiber', current: userData.macros.fiber.current, goal: userData.macros.fiber.goal, color: 'bg-green-500' }
    ];
  
    return (
      <div className="ml-8 flex-1">
        <h3 className="text-sm font-medium mb-3">Macronutrients Breakdown</h3>
        
        {macros.map((macro, index) => (
          <div className="mb-2" key={index}>
            <div className="flex justify-between text-sm">
              <span>{macro.name}</span>
              <span>{macro.current} / {macro.goal}g</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className={`${macro.color} h-2 rounded-full`}
                style={{ width: `${(macro.current / macro.goal) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };
  export default MacronutrientsList;