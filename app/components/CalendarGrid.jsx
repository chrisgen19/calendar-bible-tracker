'use client';

import CalendarDay from './CalendarDay';

export default function CalendarGrid({ currentDate, readingData, onDayClick }) {
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const formatDateKey = (date) => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const today = new Date();

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isToday = (day) => {
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
        {weekDays.map(day => (
          <div
            key={day}
            className="text-center text-xs md:text-sm font-semibold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDay }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {/* Actual days */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const dateKey = formatDateKey(date);
          const readings = readingData[dateKey] || [];

          return (
            <CalendarDay
              key={day}
              day={day}
              isToday={isToday(day)}
              readings={readings}
              onClick={onDayClick}
            />
          );
        })}
      </div>
    </div>
  );
}
