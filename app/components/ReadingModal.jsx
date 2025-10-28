'use client';

import { X, Check, Trash2, FileText } from 'lucide-react';

export default function ReadingModal({
  showModal,
  selectedDate,
  selectedDateReadings,
  currentReadingId,
  isEditMode,
  isSaving,
  isDeleting,
  showNotesForm,
  hasNotes,
  bibleBook,
  chapters,
  verses,
  dateRead,
  notesContent,
  showBookSuggestions,
  filteredBooks,
  selectedSuggestionIndex,
  onClose,
  onEditReading,
  onCancelEdit,
  onDeleteReading,
  onSaveReading,
  onBookInputChange,
  onBookInputFocus,
  onBookKeyDown,
  onSelectBook,
  onChaptersChange,
  onVersesChange,
  onDateChange,
  onOpenNotesForm,
  onSaveNotes,
  onCancelNotes,
  onNotesContentChange
}) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
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
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Existing Readings List */}
        {selectedDateReadings.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              {selectedDateReadings.length} Reading{selectedDateReadings.length > 1 ? 's' : ''} on this day
            </h4>
            <div className="space-y-2">
              {selectedDateReadings.map((reading) => (
                <div
                  key={reading.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    currentReadingId === reading.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{reading.reading}</p>
                      {reading.completed && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                          <Check className="w-3 h-3" />
                          Completed
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => onEditReading(reading)}
                      disabled={isSaving || isDeleting}
                      className="ml-2 px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-100 rounded transition-colors disabled:opacity-50"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                {isEditMode ? 'Edit Reading' : 'Add Another Reading'}
              </p>
              {isEditMode && (
                <button
                  onClick={onCancelEdit}
                  disabled={isSaving || isDeleting}
                  className="mb-2 text-xs text-gray-600 hover:text-gray-800 underline disabled:opacity-50"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>
        )}

        {/* Conditional Form Display */}
        {!showNotesForm ? (
          <>
            {/* Reading Form */}
            <div className="space-y-4 mb-4">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bible Book
                </label>
                <input
                  type="text"
                  value={bibleBook}
                  onChange={(e) => onBookInputChange(e.target.value)}
                  onFocus={onBookInputFocus}
                  onKeyDown={onBookKeyDown}
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
                        onClick={() => onSelectBook(book)}
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
                    onChange={(e) => onChaptersChange(e.target.value)}
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
                    onChange={(e) => onVersesChange(e.target.value)}
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
                  onChange={(e) => onDateChange(e.target.value)}
                  disabled={isSaving || isDeleting}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Add/Edit Notes Button */}
            <button
              onClick={onOpenNotesForm}
              disabled={isSaving || isDeleting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed mb-3"
            >
              <FileText className="w-4 h-4" />
              {hasNotes ? 'Edit Notes' : 'Add Notes'}
            </button>

            {/* Reading Form Buttons */}
            <div className="flex gap-3">
              {isEditMode && (
                <button
                  onClick={onDeleteReading}
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
                onClick={onClose}
                disabled={isSaving || isDeleting}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {selectedDateReadings.length > 0 ? 'Close' : 'Cancel'}
              </button>
              <button
                onClick={onSaveReading}
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
          </>
        ) : (
          <>
            {/* Notes Form */}
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={notesContent}
                  onChange={(e) => onNotesContentChange(e.target.value)}
                  placeholder="Write your notes here..."
                  rows={8}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Notes Form Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onCancelNotes}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={onSaveNotes}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                Save Note
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
