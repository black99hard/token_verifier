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
          className="input-field"
        />
      </div>

      <div className="relative">
        <textarea
          placeholder="Write your note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="input-field min-h-[100px] resize-none"
        />
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="input-field flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              {CATEGORIES.find((c: { value: any; }) => c.value === category)?.icon}
              <span>{CATEGORIES.find((c: { value: any; }) => c.value === category)?.label}</span>
            </div>
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-lg overflow-hidden z-10">
              {CATEGORIES.map((cat: { value: React.Key | null | undefined; icon: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; label: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    if (cat.value) {
                      setCategory(cat.value as NoteCategory);
                    }
                    setShowDropdown(false);
                  }}
                  className={clsx(
                    "w-full px-4 py-3 flex items-center gap-2 hover:bg-slate-700/50 transition-colors",
                    category === cat.value && "bg-slate-700/50"
                  )}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button onClick={handleSubmit} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
         
        </button>
      </div>
    </div>
  );
}

export default NoteForm;