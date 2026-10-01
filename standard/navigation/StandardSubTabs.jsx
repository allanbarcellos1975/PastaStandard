import React from 'react';

export default function StandardSubTabs({ items = [], activeValue, onChange, rightActions }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200">
      <div className="flex items-center gap-6 overflow-x-auto">
        {items.map((item) => {
          const isActive = item.value === activeValue;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              className={`inline-flex h-12 items-center border-b-2 px-1 text-sm font-medium transition-colors ${isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {rightActions && (
        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-200">
          {rightActions}
        </div>
      )}
    </div>
  );
}