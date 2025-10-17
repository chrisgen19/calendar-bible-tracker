'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Book, Check, X, Plus, LogOut, Trash2 } from 'lucide-react';
import { useAuth } from './context/AuthContext';

export default function BibleCalendar() {
  const { user, logout, loading } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [readingData, setReadingData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [bibleBook, setBibleBook] = useState('');
  const [chapters, setChapters] = useState('');
  const [verses, setVerses] = useState('');
  const [dateRead, setDateRead] = useState('');
  const [currentReadingId, setCurrentReadingId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showBookSuggestions, setShowBookSuggestions] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [lastUsedBook, setLastUsedBook] = useState('');
  const [isBookFieldTouched, setIsBookFieldTouched] = useState(false);

  const bibleBooks = [
    // Old Testament
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
    '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
    'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
    'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
    'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
    'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
    'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
    // New Testament
    'Matthew', 'Mark', 'Luke', 'John', 'Acts',
    'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
    'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
    '1 Timothy', '2 Timothy', 'Titus', 'Philemon',
    'Hebrews', 'James', '1 Peter', '2 Peter',
    '1 John', '2 John', '3 John', 'Jude', 'Revelation'
  ];

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

  // Fetch readings when user or month changes
  useEffect(() => {
    if (user) {
      fetchReadings();
    }
  }, [user, currentDate]);

  const fetchReadings = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `/api/readings?userId=${user.id}&month=${currentDate.getMonth()}&year=${currentDate.getFullYear()}`
      );
      const data = await response.json();

      const readingsMap = {};
      data.forEach(reading => {
        const date = new Date(reading.dateRead);
        const key = formatDateKey(date);
        readingsMap[key] = {
          id: reading.id,
          reading: `${reading.bibleBook} ${reading.chapters}${reading.verses ? ':' + reading.verses : ''}`,
          book: reading.bibleBook,
          chapters: reading.chapters,
          verses: reading.verses,
          dateRead: reading.dateRead,
          completed: reading.completed
        };
      });

      setReadingData(readingsMap);
    } catch (error) {
      console.error('Error fetching readings:', error);
    }
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getPHDate = () => {
    const now = new Date();
    const phDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
    return phDate.toISOString().split('T')[0];
  };

  const getLastUsedBook = () => {
    // Get the most recent reading's book name
    const readings = Object.values(readingData);
    if (readings.length > 0) {
      // Sort by dateRead to get the most recent
      const sortedReadings = readings.sort((a, b) =>
        new Date(b.dateRead) - new Date(a.dateRead)
      );
      return sortedReadings[0].book || '';
    }
    return '';
  };

  const handleBookInputChange = (value) => {
    setBibleBook(value);
    setSelectedSuggestionIndex(-1);
    if (value.trim()) {
      const filtered = bibleBooks.filter(book =>
        book.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredBooks(filtered);
      setShowBookSuggestions(filtered.length > 0);
    } else {
      setShowBookSuggestions(false);
      setFilteredBooks([]);
    }
  };

  const handleBookInputFocus = () => {
    if (!isBookFieldTouched && bibleBook === lastUsedBook) {
      // Clear the field when user clicks on it for the first time
      setBibleBook('');
      setShowBookSuggestions(false);
      setFilteredBooks([]);
    }
    setIsBookFieldTouched(true);
  };

  const selectBook = (book) => {
    setBibleBook(book);
    setShowBookSuggestions(false);
    setFilteredBooks([]);
    setSelectedSuggestionIndex(-1);
  };

  const handleBookKeyDown = (e) => {
    if (!showBookSuggestions || filteredBooks.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev =>
          prev < filteredBooks.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          selectBook(filteredBooks[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowBookSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
      default:
        break;
    }
  };

  const openModal = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateKey = formatDateKey(date);
    const existingData = readingData[dateKey] || {};

    setSelectedDate(date);
    setBibleBook(existingData.book || '');
    setChapters(existingData.chapters || '');
    setVerses(existingData.verses || '');
    setCurrentReadingId(existingData.id || null);
    setIsEditMode(!!existingData.id);
    setShowBookSuggestions(false);
    setFilteredBooks([]);

    // Format the date properly for the date input (YYYY-MM-DD)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const formattedDate = `${year}-${month}-${dayStr}`;

    setDateRead(formattedDate);
    setShowModal(true);
  };

  const openAddReadingModal = () => {
    const phDate = getPHDate();
    const lastBook = getLastUsedBook();
    setSelectedDate(new Date(phDate + 'T00:00:00'));
    setBibleBook(lastBook);
    setLastUsedBook(lastBook);
    setIsBookFieldTouched(false);
    setChapters('');
    setVerses('');
    setDateRead(phDate);
    setCurrentReadingId(null);
    setIsEditMode(false);
    setShowBookSuggestions(false);
    setFilteredBooks([]);
    setShowModal(true);
  };

  const saveReading = async () => {
    if (!user || !dateRead || !bibleBook || !chapters) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      if (isEditMode && currentReadingId) {
        // Update existing reading
        const response = await fetch(`/api/readings/${currentReadingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bibleBook,
            chapters,
            verses,
            dateRead,
            completed: true
          })
        });

        if (!response.ok) throw new Error('Failed to update reading');
      } else {
        // Create new reading
        const response = await fetch('/api/readings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            bibleBook,
            chapters,
            verses,
            dateRead,
            completed: true
          })
        });

        if (!response.ok) throw new Error('Failed to create reading');
      }

      // Refresh readings
      await fetchReadings();

      // Close modal and reset
      setShowModal(false);
      setBibleBook('');
      setChapters('');
      setVerses('');
      setDateRead('');
      setCurrentReadingId(null);
      setIsEditMode(false);
    } catch (error) {
      console.error('Error saving reading:', error);
      alert('Failed to save reading');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteReading = async () => {
    if (!currentReadingId) return;

    if (!confirm('Are you sure you want to delete this reading?')) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/readings/${currentReadingId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete reading');

      // Refresh readings
      await fetchReadings();

      // Close modal and reset
      setShowModal(false);
      setBibleBook('');
      setChapters('');
      setVerses('');
      setDateRead('');
      setCurrentReadingId(null);
      setIsEditMode(false);
    } catch (error) {
      console.error('Error deleting reading:', error);
      alert('Failed to delete reading');
    } finally {
      setIsDeleting(false);
    }
  };

  const getMonthStats = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const today = new Date();
    let daysRead = 0;
    let daysMissed = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateKey = formatDateKey(date);
      const dayData = readingData[dateKey] || {};
      const isToday = date.getDate() === today.getDate() &&
                      date.getMonth() === today.getMonth() &&
                      date.getFullYear() === today.getFullYear();
      const isPastDay = date < today && !isToday;

      if (dayData.completed) {
        daysRead++;
      } else if (isPastDay) {
        daysMissed++;
      }
    }

    return { daysRead, daysMissed };
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
      const isPastDay = date < today && !isToday;
      const isMissed = isPastDay && !dayData.completed;

      days.push(
        <div
          key={day}
          className={`aspect-square border md:rounded-lg p-1 md:p-2 cursor-pointer transition-all hover:shadow-md ${
            isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
          style={{
            backgroundColor: dayData.completed
              ? 'var(--color-green-100)'
              : isMissed
              ? 'var(--color-red-50)'
              : undefined
          }}
          onClick={() => openModal(day)}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-start">
              <span
                className={`text-xs md:text-sm font-semibold ${
                  isToday ? 'text-blue-600' : ''
                }`}
                style={{
                  color: isToday
                    ? undefined
                    : dayData.completed
                    ? 'var(--color-green-800)'
                    : isMissed
                    ? 'var(--color-red-600)'
                    : undefined
                }}
              >
                {day}
              </span>
              {dayData.completed && (
                <Check className="w-3 h-3 md:w-4 md:h-4" style={{ color: 'var(--color-green-800)' }} />
              )}
            </div>
            {dayData.reading && (
              <div className="mt-0.5 md:mt-1 flex-1 overflow-hidden">
                <Book
                  className="w-2 h-2 md:w-3 md:h-3 mb-0.5 md:mb-1 hidden md:block"
                  style={{
                    color: dayData.completed ? 'var(--color-green-800)' : undefined
                  }}
                />
                <p
                  className="text-[10px] md:text-xs line-clamp-3 md:line-clamp-2 leading-tight"
                  style={{
                    color: dayData.completed ? 'var(--color-green-800)' : undefined
                  }}
                >
                  {dayData.reading}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will be redirected by AuthContext
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
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
                onClick={openAddReadingModal}
                className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm md:text-base"
              >
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                Add Reading
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold text-sm md:text-base"
              >
                <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                Logout
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
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
                onClick={previousMonth}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-0 md:gap-2 mb-1 md:mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 text-xs md:text-sm py-1 md:py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0 md:gap-2">
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
              Completed days show in dark green with a checkmark
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              Missed read days (past days without reading) show in red
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

            <div className="space-y-4 mb-4">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bible Book
                </label>
                <input
                  type="text"
                  value={bibleBook}
                  onChange={(e) => handleBookInputChange(e.target.value)}
                  onFocus={handleBookInputFocus}
                  onKeyDown={handleBookKeyDown}
                  placeholder="e.g., Genesis, Psalm, Matthew"
                  disabled={isSaving || isDeleting}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  autoComplete="off"
                />
                {showBookSuggestions && filteredBooks.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredBooks.map((book, index) => (
                      <div
                        key={book}
                        onClick={() => selectBook(book)}
                        className={`px-3 py-2 cursor-pointer transition-colors text-gray-700 ${
                          index === selectedSuggestionIndex
                            ? 'bg-indigo-100'
                            : 'hover:bg-indigo-50'
                        }`}
                      >
                        {book}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Chapters
                  </label>
                  <input
                    type="text"
                    value={chapters}
                    onChange={(e) => setChapters(e.target.value)}
                    placeholder="e.g., 1-3, 5"
                    disabled={isSaving || isDeleting}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Verses
                  </label>
                  <input
                    type="text"
                    value={verses}
                    onChange={(e) => setVerses(e.target.value)}
                    placeholder="e.g., 1-10"
                    disabled={isSaving || isDeleting}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date Read
                </label>
                <input
                  type="date"
                  value={dateRead}
                  onChange={(e) => setDateRead(e.target.value)}
                  disabled={isSaving || isDeleting}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex gap-3">
              {isEditMode && (
                <button
                  onClick={deleteReading}
                  disabled={isSaving || isDeleting}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                disabled={isSaving || isDeleting}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={saveReading}
                disabled={isSaving || isDeleting}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {isEditMode ? 'Updating...' : 'Saving...'}
                  </span>
                ) : (
                  isEditMode ? 'Update' : 'Save'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
