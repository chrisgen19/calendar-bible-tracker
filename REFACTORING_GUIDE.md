# Calendar Component Refactoring Guide

## ✅ Components Created

I've created the following reusable components in `/app/components/`:

1. **CalendarHeader.jsx** - Header with user info, navigation, and action buttons
2. **CalendarGrid.jsx** - Calendar grid layout and week day headers
3. **CalendarDay.jsx** - Individual day cell with readings
4. **ReadingModal.jsx** - Complete modal for adding/editing readings and notes
5. **CalendarLegend.jsx** - Quick tips and legend section

## 📦 Component Structure

```
app/
├── components/
│   ├── CalendarHeader.jsx    ← Top header with navigation
│   ├── CalendarGrid.jsx       ← Calendar grid wrapper
│   ├── CalendarDay.jsx        ← Individual day cell
│   ├── ReadingModal.jsx       ← Reading/Notes modal
│   └── CalendarLegend.jsx     ← Tips section
├── page.jsx                   ← Main page (to be refactored)
└── ...
```

## 🔄 How to Use the Components

### Option 1: Gradual Refactoring (Recommended)

Gradually replace sections of `page.jsx` with the new components:

#### Step 1: Replace Calendar Header

In `page.jsx`, replace lines 590-677 (the header section) with:

```jsx
import CalendarHeader from './components/CalendarHeader';

// In the return statement:
<CalendarHeader
  currentDate={currentDate}
  onPreviousMonth={previousMonth}
  onNextMonth={nextMonth}
  onAddReading={openAddReadingModal}
  onLogout={logout}
  user={user}
/>
```

#### Step 2: Replace Calendar Grid

Replace the calendar rendering section (lines 666-676) with:

```jsx
import CalendarGrid from './components/CalendarGrid';

<CalendarGrid
  currentDate={currentDate}
  readingData={readingData}
  onDayClick={openModal}
/>
```

#### Step 3: Replace Reading Modal

Replace the modal section (lines 710-958) with:

```jsx
import ReadingModal from './components/ReadingModal';

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
```

#### Step 4: Replace Legend Section

Replace the tips section (lines 679-707) with:

```jsx
import CalendarLegend from './components/CalendarLegend';

<CalendarLegend />
```

### Option 2: Complete Refactoring

Create a new simplified `page.jsx` that uses all components. The file would look like:

```jsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import CalendarHeader from './components/CalendarHeader';
import CalendarGrid from './components/CalendarGrid';
import CalendarLegend from './components/CalendarLegend';
import ReadingModal from './components/ReadingModal';

export default function BibleCalendar() {
  const { user, logout, loading } = useAuth();

  // All your state variables...
  // All your helper functions...
  // All your handlers...

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
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

        <ReadingModal
          // ... all props
        />
      </div>
    </div>
  );
}
```

## 🎯 Benefits of This Refactoring

1. **Better Code Organization** - Each component has a single responsibility
2. **Reusability** - Components can be used in other pages
3. **Easier Maintenance** - Changes to UI are localized to specific components
4. **Better Testing** - Each component can be tested independently
5. **Improved Readability** - Main page becomes much cleaner
6. **Type Safety** - Can add PropTypes or TypeScript later

## 📝 Next Steps

1. **Test each component** - Verify they work correctly
2. **Add PropTypes** - For better type checking (optional)
3. **Extract more components** - Loading screen, stats badges, etc.
4. **Add Storybook** - For component documentation (optional)

## ⚠️ Important Notes

- The original `page.jsx` is backed up as `page.jsx.backup`
- Test thoroughly after each refactoring step
- All functionality should remain the same
- State management stays in the main page
- Consider using Context API for deeply nested props

## 🚀 Quick Start

To see the components in action immediately:

1. Keep your current `page.jsx` as is
2. Create a new test page `/app/calendar-test/page.jsx`
3. Import and use the new components there
4. Compare and verify everything works
5. Then gradually migrate the main page

This way you can test without breaking your production page!
