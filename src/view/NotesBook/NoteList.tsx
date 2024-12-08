import React from 'react';
import { X, Clipboard } from 'lucide-react'; // Import Clipboard icon
import { toast } from 'react-toastify'; // Import toast from react-toastify
import { CATEGORIES } from './page';
import { Note } from '../../types/';

interface NotesListProps {
  notes: Note[];
  onDelete: (id: string) => void;
}

const NotesList: React.FC<NotesListProps> = ({ notes, onDelete }) => {
  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address)
      .then(() => {
        toast.success('Address copied to clipboard!', {
          position: "top-center",
          autoClose: 2000,
        });
      })
      .catch(() => {
        toast.error('Failed to copy the address. Please try again.', {
          position: "top-center",
          autoClose: 2000,
        });
      });
  };

  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
      {notes.map((note) => (
        <div key={note.id} className="bg-black/60 border border-red-500/20 p-4 rounded-lg shadow-md group">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {CATEGORIES.find(c => c.value === note.category)?.icon}
                <span className="text-sm text-gray-200">
                  {CATEGORIES.find(c => c.value === note.category)?.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm text-gray-100 truncate">{note.address}</p>
                <button
                  onClick={() => handleCopy(note.address)}
                  className="p-1 hover:bg-red-500/20 rounded-lg"
                  title="Copy Address"
                >
                  <Clipboard className="w-4 h-4 text-gray-100" />
                </button>
              </div>
              <p className="mt-2 text-gray-200">{note.note}</p>
              <p className="mt-2 text-xs text-gray-400">
                {new Date(note.timestamp).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => onDelete(note.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded-lg"
            >
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotesList;