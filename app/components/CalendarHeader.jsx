'use client';

import { ChevronLeft, ChevronRight, Plus, LogOut, Book, Check, X } from 'lucide-react';

export default function CalendarHeader({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onAddReading,
  onLogout,
  user,
  readingData
}) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const formatDateKey = (date) => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };

  const getMonthStats = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const today = new Date();
    let daysRead = 0;
    let daysMissed = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateKey = formatDateKey(date);
      const dayReadings = readingData[dateKey] || [];
      const isToday = date.getDate() === today.getDate() &&
                      date.getMonth() === today.getMonth() &&
                      date.getFullYear() === today.getFullYear();
      const isPastDay = date < today && !isToday;

      if (dayReadings.length > 0) {
        daysRead++;
      } else if (isPastDay) {
        daysMissed++;
      }
    }

    return { daysRead, daysMissed };
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center justify-center md:justify-start gap-2">
            <Book className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
            Bible Reading Calendar
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Welcome, {user.firstName} {user.lastName} - Track your daily scripture reading
          </p>
        </div>
        <div className="flex gap-2 justify-center md:justify-end flex-wrap">
          <button
            onClick={onAddReading}
            className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm md:text-base"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            Add Reading
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold text-sm md:text-base"
          >
            <LogOut className="w-4 h-4 md:w-5 md:h-5" />
            Logout
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <Book className="w-6 h-6 text-indigo-600" />
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2 text-sm flex-wrap mt-2">
            <span
              className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap gap-1 transition-colors"
              style={{
                color: 'var(--color-green-600)',
                borderColor: 'var(--color-green-600)',
                borderWidth: '1px'
              }}
            >
              <Check className="h-3 w-3" />
              {getMonthStats().daysRead} days read
            </span>
            <span
              className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap gap-1 transition-colors"
              style={{
                color: 'var(--color-gray-600)',
                borderColor: 'var(--color-gray-600)',
                borderWidth: '1px'
              }}
            >
              <X className="h-3 w-3" />
              {getMonthStats().daysMissed} days missed
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPreviousMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={onNextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
