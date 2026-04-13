import { useState } from 'react';
import { Topic } from '../data/topics';
import { BookOpen, Lightbulb, PenTool, X, MessageSquarePlus, ArrowLeft, CheckCircle, Circle } from 'lucide-react';

interface SavedData {
  text: number;
  word: string[];
}

interface TopicCardProps {
  topic: Topic;
  onBack: () => void;
  isPracticed: boolean;
  togglePracticed: (id: number) => void;
  lang: 'fr' | 'de';
  savedData: SavedData[];
  onAddWord: (topicId: number, word: string) => void;
  onRemoveWord: (topicId: number, word: string) => void;
}

export function TopicCard({ topic, onBack, isPracticed, togglePracticed, lang, savedData, onAddWord, onRemoveWord }: TopicCardProps) {
  const [newWord, setNewWord] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const topicData = savedData.find(d => d.text === topic.id);
  const words = topicData ? topicData.word : [];

  const handleAddWord = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newWord.trim();
    if (!trimmed) return;

    onAddWord(topic.id, trimmed);
    setNewWord('');
    
    // Close modal on mobile after submitting
    if (isModalOpen) {
      setIsModalOpen(false);
    }
  };

  const handleRemoveWord = (wordToRemove: string) => {
    onRemoveWord(topic.id, wordToRemove);
  };

  const renderMissingWordsContent = (isMobile: boolean) => (
    <>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <PenTool className="text-blue-500" />
          My Missing Words
        </h3>
        {isMobile && (
          <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        )}
      </div>
      <p className="text-sm text-slate-500 mb-4">
        Note down words or phrases you wanted to say but didn't know in {lang === 'fr' ? 'French' : 'German'}.
      </p>
      
      <div className="flex-grow flex flex-col gap-4 min-h-[200px]">
        <ul className="space-y-2 flex-grow overflow-y-auto max-h-[300px] pr-2">
          {words.length === 0 ? (
            <li className="text-slate-400 italic text-sm">No words added yet.</li>
          ) : (
            words.map((w, idx) => (
              <li key={idx} className="flex items-center justify-between bg-white p-2 px-3 rounded border border-slate-200 shadow-sm">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                  <span className="text-slate-700 break-words">{w}</span>
                </span>
                <button
                  onClick={() => handleRemoveWord(w)}
                  className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
                  aria-label="Remove word"
                >
                  <X size={16} />
                </button>
              </li>
            ))
          )}
        </ul>

        <form onSubmit={handleAddWord} className="flex gap-2 mt-auto pt-4 border-t border-slate-200">
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            placeholder="Add a missing word..."
            className="flex-grow p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            autoFocus={isMobile}
          />
          <button
            type="submit"
            disabled={!newWord.trim()}
            className="flex items-center justify-center p-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-lg transition-colors font-medium"
          >
            Add
          </button>
        </form>
      </div>
    </>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div 
        className="p-6 text-white relative bg-cover bg-center min-h-[200px] flex flex-col justify-end"
        style={{ backgroundImage: `url('${topic.imageUrl}')` }}
      >
        {/* Subtle gradient just at the bottom to ensure text is readable, without tinting the whole image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <button 
          onClick={onBack}
          className="absolute top-6 right-6 text-white hover:text-white transition-colors flex items-center gap-2 bg-black/30 hover:bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium z-10"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="relative z-10">
          <div className="mb-2">
            <span className="inline-block px-2.5 py-1 bg-indigo-600/80 backdrop-blur-md rounded-lg text-xs font-bold text-white border border-white/20 shadow-sm">
              Niveau {topic.level}
            </span>
          </div>
          <div className="flex items-center gap-4 mb-2 pr-24">
            <h2 className="text-3xl font-bold drop-shadow-md">{topic.title}</h2>
            <button
              onClick={() => togglePracticed(topic.id)}
              className={`flex-shrink-0 transition-colors drop-shadow-md ${isPracticed ? 'text-emerald-400' : 'text-white/80 hover:text-white'}`}
              title={isPracticed ? "Mark as unpracticed" : "Mark as practiced"}
            >
              {isPracticed ? <CheckCircle size={28} /> : <Circle size={28} />}
            </button>
          </div>
          <p className="text-white/90 text-lg drop-shadow-md">{topic.titleEn}</p>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Lightbulb className="text-amber-500" />
              Points & Ideas
            </h3>
            <ul className="space-y-3">
              {topic.ideas.map((idea, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-600">
                  <span className="bg-indigo-100 text-indigo-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-medium mt-0.5">
                    {index + 1}
                  </span>
                  <span>{idea}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <BookOpen className="text-emerald-500" />
              Key Vocabulary
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {topic.vocabulary.map((vocab, index) => (
                <div key={index} className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center">
                  <span className="font-medium text-slate-800">{vocab.fr || vocab.de}</span>
                  <span className="text-slate-500 text-sm">{vocab.en}</span>
                </div>
              ))}
            </div>
          </section>
          
          {/* Mobile Button to open Missing Words Modal */}
          <div className="md:hidden pt-4 border-t border-slate-100">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-medium transition-colors border border-blue-200"
            >
              <MessageSquarePlus size={20} />
              Missing Words ({words.length})
            </button>
          </div>
        </div>

        {/* Desktop Missing Words Section */}
        <div className="hidden md:flex bg-slate-50 p-6 rounded-xl border border-slate-200 flex-col h-full">
          {renderMissingWordsContent(false)}
        </div>
      </div>

      {/* Mobile Missing Words Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 md:hidden">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-8 duration-200">
            {renderMissingWordsContent(true)}
          </div>
        </div>
      )}
    </div>
  );
}
