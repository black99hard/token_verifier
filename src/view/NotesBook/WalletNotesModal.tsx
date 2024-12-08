import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { X, Plus, Tag, Search, Wallet, Code, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

type NoteCategory = 'wallet' | 'token' | 'contract';
type Note = {
  id: string;
  address: string;
  note: string;
  category: NoteCategory;
  timestamp: number;
};

interface WalletNotesModalProps {
  onClose: () => void;
}

const CATEGORIES: { value: NoteCategory; label: string; icon: React.ReactNode }[] = [
  { value: 'wallet', label: 'Wallet Address', icon: <Wallet className="w-4 h-4" /> },
  { value: 'token', label: 'Token Address', icon: <Tag className="w-4 h-4" /> },
  { value: 'contract', label: 'Smart Contract', icon: <Code className="w-4 h-4" /> },
];

const WalletNotesModal: React.FC<WalletNotesModalProps> = ({ onClose }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<NoteCategory>('wallet');
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const savedNotes = Cookies.get('walletNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const saveNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    Cookies.set('walletNotes', JSON.stringify(updatedNotes), { expires: 365 });
  };

  const addNote = () => {
    if (address && note) {
      const newNote: Note = {
        id: Date.now().toString(),
        address,
        note,
        category,
        timestamp: Date.now(),
      };
      saveNotes([...notes, newNote]);
      setAddress('');
      setNote('');
    }
  };

  const deleteNote = (id: string) => {
    saveNotes(notes.filter(note => note.id !== id));
  };

  const filteredNotes = notes.filter(note => 
    note.address.toLowerCase().includes(search.toLowerCase()) ||
    note.note.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-black/60 border border-red-500/20 w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl animate-glow">
        <div className="p-6 border-b border-red-500/20">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] bg-clip-text text-transparent">
              Wallet Notes
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
              <X className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Add Note Form */}
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
                    {CATEGORIES.find(c => c.value === category)?.icon}
                    <span>{CATEGORIES.find(c => c.value === category)?.label}</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-black/60 border border-red-500/20 rounded-lg overflow-hidden z-10">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => {
                          setCategory(cat.value);
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
              
              <button onClick={addNote} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors">
                <Plus className="w-4 h-4" />
                Add Note
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 bg-black/40 border border-red-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-gray-100 placeholder-slate-400 pl-12"
            />
          </div>

          {/* Notes List */}
          <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
            {filteredNotes.map((note) => (
              <div key={note.id} className="bg-black/60 border border-red-500/20 p-4 rounded-lg shadow-md group">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {CATEGORIES.find(c => c.value === note.category)?.icon}
                      <span className="text-sm text-gray-200">
                        {CATEGORIES.find(c => c.value === note.category)?.label}
                      </span>
                    </div>
                    <p className="font-mono text-sm text-gray-100 truncate">{note.address}</p>
                    <p className="mt-2 text-gray-200">{note.note}</p>
                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(note.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded-lg"
                  >
                    <X className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletNotesModal;