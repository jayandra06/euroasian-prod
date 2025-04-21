// app/page.jsx
'use client'; // <-- THIS IS REQUIRED for using onClick, toast, etc.

import toast from 'react-hot-toast';

export default function HomePage() {
  return (
    <div className="p-10">
      <button
        onClick={() => toast.success('Toast is working 🎉')}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Show Toast
      </button>
    </div>
  );
}
