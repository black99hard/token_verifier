import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Plus, Tag, Search, Wallet, Code, HelpCircle, X } from 'lucide-react';
import clsx from 'clsx';
import NoteForm from './NoteForm';
import NotesList from './NoteList';
import { Note, NoteCategory } from '../../types/';
import { Tooltip } from '../../components/Tooltip';

interface NotesBookProps {
  className?: string;
}

export const CATEGORIES = [
  { value: 'wallet' as NoteCategory, label: 'Wallet Address', icon: <Wallet className="w-4 h-4" /> },
  { value: 'token' as NoteCategory, label: 'Token Address', icon: <Tag className="w-4 h-4" /> },
  { value: 'contract' as NoteCategory, label: 'Smart Contract', icon: <Code className="w-4 h-4" /> },
];

const NotesBook: React.FC<NotesBookProps> = ({ className }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState('');

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

  const handleAddNote = (newNote: Omit<Note, 'id' | 'timestamp'>) => {
    const noteWithMeta: Note = {
      ...newNote,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    saveNotes([...notes, noteWithMeta]);
  };

  const handleDeleteNote = (id: string) => {
    saveNotes(notes.filter(note => note.id !== id));
  };

  const filteredNotes = notes.filter(note => 
    note.address.toLowerCase().includes(search.toLowerCase()) ||
    note.note.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={clsx("max-w-7xl mx-auto space-y-10", className)}>
      <div className="glass-card p-8 rounded-2xl animate-glow">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] bg-clip-text text-transparent mb-8">
            Notes Book
          </h1>
          <Tooltip
          content="The NotesBook allows you to store and manage wallet addresses along with notes. You can add new addresses, write notes for each address, and delete them when no longer needed. Use the copy button to quickly copy the address to your clipboard."
          direction="left"
          >
            <button className="text-slate-400 hover:text-slate-300 transition-colors duration-200">
              <HelpCircle size={20} />
            </button>
          </Tooltip>
        </div>

        <div className="space-y-8">
          <NoteForm onSubmit={handleAddNote} />

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-12"
            />
          </div>

          <NotesList
            notes={filteredNotes}
            onDelete={handleDeleteNote}
          />
        </div>
      </div>
    </div>
  );
};

export default NotesBook;