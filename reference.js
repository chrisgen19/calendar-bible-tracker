import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Book, Check, X } from 'lucide-react';

export default function BibleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [readingData, setReadingData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalReading, setModalReading] = useState('');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const openModal = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateKey = formatDateKey(date);
    setSelectedDate(date);
    setModalReading(readingData[dateKey]?.reading || '');
    setShowModal(true);
  };

  const saveReading = () => {
    if (selectedDate) {
      const dateKey = formatDateKey(selectedDate);
      setReadingData({
        ...readingData,
        [dateKey]: {
          reading: modalReading,
          completed: modalReading.trim() !== ''
        }
      });
    }
    setShowModal(false);
    setModalReading('');
  };

  const toggleComplete = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateKey = formatDateKey(date);
    const current = readingData[dateKey] || {};
    
    setReadingData({
      ...readingData,
      [dateKey]: {
        reading: current.reading || '',
        completed: !current.completed
      }
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const today = new Date();
    const isCurrentMonth = currentDate.getMonth() === today.getMonth() && 
                          currentDate.getFullYear() === today.getFullYear();

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateKey = formatDateKey(date);
      const dayData = readingData[dateKey] || {};
      const isToday = isCurrentMonth && day === today.getDate();

      days.push(
        <div
          key={day}
          className={`aspect-square border rounded-lg p-2 cursor-pointer transition-all hover:shadow-md ${
            isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          } ${dayData.completed ? 'bg-green-50' : ''}`}
          onClick={() => openModal(day)}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-start">
              <span className={`text-sm font-semibold ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                {day}
              </span>
              {dayData.completed && (
                <Check className="w-4 h-4 text-green-600" />
              )}
            </div>
            {dayData.reading && (
              <div className="mt-1 flex-1">
                <Book className="w-3 h-3 text-gray-400 mb-1" />
                <p className="text-xs text-gray-600 line-clamp-2">{dayData.reading}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const getTotalCompleted = () => {
    return Object.values(readingData).filter(d => d.completed).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Book className="w-8 h-8 text-indigo-600" />
                Bible Reading Calendar
              </h1>
              <p className="text-gray-600 mt-1">Track your daily scripture reading</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Days Completed</p>
              <p className="text-3xl font-bold text-indigo-600">{getTotalCompleted()}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <button
              onClick={previousMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {renderCalendar()}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Tips</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              Click any day to add or edit your Bible reading
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              Mark days complete by adding what you read
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              Today's date is highlighted in blue
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              Completed days show in green with a checkmark
            </li>
          </ul>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Bible Reading</h3>
                <p className="text-gray-600">
                  {selectedDate && selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                What did you read today?
              </label>
              <textarea
                value={modalReading}
                onChange={(e) => setModalReading(e.target.value)}
                placeholder="e.g., Psalm 23, Matthew 5-7, Genesis 1-3"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                rows="4"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={saveReading}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}