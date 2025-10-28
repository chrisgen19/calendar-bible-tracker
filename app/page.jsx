'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import CalendarHeader from './components/CalendarHeader';
import CalendarGrid from './components/CalendarGrid';
import CalendarLegend from './components/CalendarLegend';
import ReadingModal from './components/ReadingModal';

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
  const [selectedDateReadings, setSelectedDateReadings] = useState([]);
  const [modalOpenedFrom, setModalOpenedFrom] = useState(null); // 'calendar' or 'add-button'
  const [showNotesForm, setShowNotesForm] = useState(false);
  const [notesContent, setNotesContent] = useState('');
  const [tempNotes, setTempNotes] = useState('');
  const [hasNotes, setHasNotes] = useState(false);

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
        const readingEntry = {
          id: reading.id,
          reading: `${reading.bibleBook} ${reading.chapters}${reading.verses ? ':' + reading.verses : ''}`,
          book: reading.bibleBook,
          chapters: reading.chapters,
          verses: reading.verses,
          dateRead: reading.dateRead,
          completed: reading.completed
        };

        // Support multiple readings per date - store as array
        if (!readingsMap[key]) {
          readingsMap[key] = [];
        }
        readingsMap[key].push(readingEntry);
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
    const allReadings = Object.values(readingData).flat();
    if (allReadings.length > 0) {
      // Sort by dateRead to get the most recent
      const sortedReadings = allReadings.sort((a, b) =>
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
    const existingReadings = readingData[dateKey] || [];

    setSelectedDate(date);
    setSelectedDateReadings(existingReadings);
    setModalOpenedFrom('calendar'); // Track that modal was opened from calendar click

    // Always start in "add new reading" mode
    const lastBook = getLastUsedBook();
    setBibleBook(lastBook);
    setLastUsedBook(lastBook);
    setChapters('');
    setVerses('');
    setCurrentReadingId(null);
    setIsEditMode(false);
    setIsBookFieldTouched(false); // Allow clearing on focus
    setShowBookSuggestions(false);
    setFilteredBooks([]);
    setNotesContent('');
    setTempNotes('');
    setShowNotesForm(false);
    setHasNotes(false);

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
    const date = new Date(phDate + 'T00:00:00');
    const dateKey = formatDateKey(date);
    const existingReadings = readingData[dateKey] || [];

    setSelectedDate(date);
    setSelectedDateReadings(existingReadings);
    setModalOpenedFrom('add-button'); // Track that modal was opened from Add Reading button
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
    setNotesContent('');
    setTempNotes('');
    setShowNotesForm(false);
    setHasNotes(false);
    setShowModal(true);
  };

  const editReading = async (reading) => {
    setBibleBook(reading.book || '');
    setChapters(reading.chapters || '');
    setVerses(reading.verses || '');
    setCurrentReadingId(reading.id);
    setIsEditMode(true);
    setIsBookFieldTouched(true);

    // Fetch existing notes for this reading
    try {
      const response = await fetch(`/api/notes?bibleReadingId=${reading.id}`);
      if (response.ok) {
        const notes = await response.json();
        if (notes && notes.length > 0) {
          // Load the most recent note
          const latestNote = notes[0];
          setNotesContent(latestNote.content);
          setTempNotes(latestNote.content);
          setHasNotes(true);
        } else {
          setNotesContent('');
          setTempNotes('');
          setHasNotes(false);
        }
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const cancelEdit = () => {
    const lastBook = getLastUsedBook();
    setBibleBook(lastBook);
    setLastUsedBook(lastBook);
    setChapters('');
    setVerses('');
    setCurrentReadingId(null);
    setIsEditMode(false);
    setIsBookFieldTouched(false);
  };

  const openNotesForm = () => {
    setShowNotesForm(true);
  };

  const saveNotes = () => {
    // Store notes temporarily until the reading is saved
    setTempNotes(notesContent);
    setHasNotes(notesContent && notesContent.trim() !== '');
    setShowNotesForm(false);
  };

  const cancelNotes = () => {
    setNotesContent(tempNotes); // Restore previous notes if cancelled
    setShowNotesForm(false);
  };

  const saveReading = async () => {
    if (!user || !dateRead || !bibleBook || !chapters) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      let readingId = currentReadingId;

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

        const data = await response.json();
        readingId = data.id;
      }

      // If there are temporary notes, save them
      if (tempNotes && tempNotes.trim() !== '') {
        const notesResponse = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bibleReadingId: readingId,
            content: tempNotes
          })
        });

        if (!notesResponse.ok) throw new Error('Failed to save notes');
      }

      // Refresh readings
      await fetchReadings();

      // Close modal after saving (both for new readings and edits)
      setShowModal(false);
      setBibleBook('');
      setChapters('');
      setVerses('');
      setDateRead('');
      setCurrentReadingId(null);
      setIsEditMode(false);
      setModalOpenedFrom(null);
      setIsBookFieldTouched(false);
      setNotesContent('');
      setTempNotes('');
      setShowNotesForm(false);
      setHasNotes(false);
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

      // Update the selected date readings list
      const date = new Date(dateRead);
      const dateKey = formatDateKey(date);
      const updatedReadings = readingData[dateKey] || [];
      setSelectedDateReadings(updatedReadings);

      // Reset form to add new reading mode
      const lastBook = getLastUsedBook();
      setBibleBook(lastBook);
      setLastUsedBook(lastBook);
      setChapters('');
      setVerses('');
      setCurrentReadingId(null);
      setIsEditMode(false);
      setIsBookFieldTouched(false);
    } catch (error) {
      console.error('Error deleting reading:', error);
      alert('Failed to delete reading');
    } finally {
      setIsDeleting(false);
    }
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
      <div className="max-w-6xl mx-auto space-y-6">
        <CalendarHeader
          currentDate={currentDate}
          onPreviousMonth={previousMonth}
          onNextMonth={nextMonth}
          onAddReading={openAddReadingModal}
          onLogout={logout}
          user={user}
        />

        <CalendarGrid
          currentDate={currentDate}
          readingData={readingData}
          onDayClick={openModal}
        />

        <CalendarLegend />
      </div>

      <ReadingModal
        showModal={showModal}
        selectedDate={selectedDate}
        selectedDateReadings={selectedDateReadings}
        currentReadingId={currentReadingId}
        isEditMode={isEditMode}
        isSaving={isSaving}
        isDeleting={isDeleting}
        showNotesForm={showNotesForm}
        hasNotes={hasNotes}
        bibleBook={bibleBook}
        chapters={chapters}
        verses={verses}
        dateRead={dateRead}
        notesContent={notesContent}
        showBookSuggestions={showBookSuggestions}
        filteredBooks={filteredBooks}
        selectedSuggestionIndex={selectedSuggestionIndex}
        onClose={() => setShowModal(false)}
        onEditReading={editReading}
        onCancelEdit={cancelEdit}
        onDeleteReading={deleteReading}
        onSaveReading={saveReading}
        onBookInputChange={handleBookInputChange}
        onBookInputFocus={handleBookInputFocus}
        onBookKeyDown={handleBookKeyDown}
        onSelectBook={selectBook}
        onChaptersChange={setChapters}
        onVersesChange={setVerses}
        onDateChange={setDateRead}
        onOpenNotesForm={openNotesForm}
        onSaveNotes={saveNotes}
        onCancelNotes={cancelNotes}
        onNotesContentChange={setNotesContent}
      />
    </div>
  );
}
