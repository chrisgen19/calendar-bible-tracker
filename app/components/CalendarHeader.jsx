'use client';

import { ChevronLeft, ChevronRight, Plus, LogOut } from 'lucide-react';

export default function CalendarHeader({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onAddReading,
  onLogout,
  user
}) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* User Info */}
        <div className="flex items-center justify-between md:justify-start gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Bible Reading Calendar</h1>
            {user && (
              <p className="text-sm text-gray-600">
                Welcome, {user.firstName} {user.lastName}
              </p>
            )}
          </div>
          <button
            onClick={onLogout}
            className="md:hidden p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onAddReading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add Reading
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={onPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={onNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Mobile Add Reading Button */}
      <div className="md:hidden mt-4">
        <button
          onClick={onAddReading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add Reading
        </button>
      </div>
    </div>
  );
}
