import React, { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { CATEGORIES } from './page';
import { Note, NoteCategory } from '../../types/';

interface NoteFormProps {
  onSubmit: (note: Omit<Note, 'id' | 'timestamp'>) => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ onSubmit }) => {
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<NoteCategory>('wallet');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSubmit = () => {
    if (address && note) {
      onSubmit({ address, note, category });
      setAddress('');
      setNote('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Enter address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-4 py-3 bg-black/40 border border-red-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-gray-100 placeholder-slate-400"
        />
      </div>

      <div className="relative">
        <textarea
          placeholder="Write your note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full px-4 py-3 bg-black/40 border border-red-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-gray-100 placeholder-slate-400 min-h-[100px] resize-none"
        />
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full px-4 py-3 bg-black/40 border border-red-500/20 rounded-lg flex items-center justify-between text-gray-100"
          >
            <div className="flex items-center gap-2">
              {CATEGORIES.find((c) => c.value === category)?.icon}
              <span>{CATEGORIES.find((c) => c.value === category)?.label}</span>
            </div>
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-black/60 border border-red-500/20 rounded-lg overflow-hidden z-10">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    if (cat.value) {
                      setCategory(cat.value as NoteCategory);
                    }
                    setShowDropdown(false);
                  }}
                  className={clsx(
                    "w-full px-4 py-3 flex items-center gap-2 hover:bg-red-500/20 transition-colors",
                    category === cat.value && "bg-red-500/20"
                  )}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button onClick={handleSubmit} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Add Note
        </button>
      </div>
    </div>
  );
}

export default NoteForm;