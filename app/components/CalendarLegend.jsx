'use client';

export default function CalendarLegend() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Tips</h3>
      <ul className="space-y-2 text-gray-600">
        <li className="flex items-start gap-2">
          <span className="text-indigo-600 font-bold">•</span>
          Click any day to add or edit your Bible reading
        </li>
        <li className="flex items-start gap-2">
          <span className="text-indigo-600 font-bold">•</span>
          You can add multiple readings to the same day
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
  );
}
