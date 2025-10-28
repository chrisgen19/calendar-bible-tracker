'use client';

import { Check } from 'lucide-react';

export default function CalendarDay({ day, isToday, readings, onClick }) {
  const allCompleted = readings.length > 0 && readings.every(r => r.completed);
  const isPast = new Date() > new Date(new Date().setDate(day));
  const isMissed = isPast && readings.length === 0 && !isToday;

  return (
    <div
      onClick={() => onClick(day)}
      className={`aspect-square border md:rounded-lg p-1 md:p-2 cursor-pointer transition-all hover:shadow-md ${
        isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      }`}
      style={{
        backgroundColor: allCompleted
          ? 'var(--color-green-100)'
          : isMissed
          ? 'var(--color-red-50)'
          : undefined
      }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-1">
          <span className={`text-xs md:text-sm font-semibold ${
            isToday ? 'text-blue-600' : 'text-gray-700'
          }`}>
            {day}
          </span>
          {allCompleted && (
            <Check className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
          )}
        </div>
        {readings.length > 0 && (
          <div className="flex-1 overflow-hidden">
            <div className="space-y-0.5">
              {readings.slice(0, 2).map((reading, idx) => (
                <div
                  key={idx}
                  className="text-[10px] md:text-xs text-gray-600 truncate leading-tight"
                >
                  {reading.reading}
                </div>
              ))}
              {readings.length > 2 && (
                <div className="text-[10px] md:text-xs text-indigo-600 font-medium">
                  +{readings.length - 2} more
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
