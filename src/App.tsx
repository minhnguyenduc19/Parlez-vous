import { useState, useEffect, useMemo } from 'react';
import { Topic, topics as topicsFr } from './data/topics';
import { topicsDe } from './data/topicsDe';
import { TopicCard } from './components/TopicCard';
import { PracticeTab } from './components/PracticeTab';
import { VocabTab } from './components/VocabTab';
import { AuthModal } from './components/AuthModal';
import { MessageCircle, List, BookA, Globe, LogIn, LogOut, User } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<'fr' | 'de'>('fr');
  const [activeTab, setActiveTab] = useState<'practice' | 'vocab'>('practice');
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [practicedTopics, setPracticedTopics] = useState<number[]>([]);
  const [missingWords, setMissingWords] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const currentTopics = lang === 'fr' ? topicsFr : topicsDe;
  const langStr = lang === 'fr' ? 'french' : 'german';
  const practicedStorageKey = lang === 'fr' ? 'french-practiced-topics' : 'german-practiced-topics';
  const missingWordsStorageKey = lang === 'fr' ? 'french-missing-words-data' : 'german-missing-words-data';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          const res = await fetch(`${API_BASE}/userdata`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language: langStr }),
            credentials: 'include'
          });
          if (res.ok) {
            const data = await res.json();
            setPracticedTopics(data[`${langStr}_practiced_topics`] || []);
            setMissingWords(data[`${langStr}_missing_words`] || []);
          }
        } catch (e) {
          console.error('Failed to fetch user data', e);
        }
      };
      fetchUserData();
    } else {
      // Fallback to local storage if not logged in
      const storedPracticed = localStorage.getItem(practicedStorageKey);
      if (storedPracticed) {
        try { setPracticedTopics(JSON.parse(storedPracticed)); } catch(e) {}
      } else {
        setPracticedTopics([]);
      }

      const storedMissing = localStorage.getItem(missingWordsStorageKey);
      if (storedMissing) {
        try { 
          const parsed = JSON.parse(storedMissing);
          // Convert from [{text: 1, word: ['a']}] to ["1:a"]
          const converted: string[] = [];
          parsed.forEach((d: any) => {
            d.word.forEach((w: string) => converted.push(`${d.text}:${w}`));
          });
          setMissingWords(converted);
        } catch(e) {}
      } else {
        setMissingWords([]);
      }
    }
  }, [user, lang, practicedStorageKey, missingWordsStorageKey, langStr]);

  const updateUserDataAPI = async (dataType: string, action: string, data: any) => {
    if (!user) return;
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await fetch(`${API_BASE}/updateuserdata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: langStr, dataType, action, data }),
        credentials: 'include'
      });
    } catch (e) {
      console.error('Failed to update user data', e);
    }
  };

  const togglePracticed = async (id: number) => {
    const isPracticed = practicedTopics.includes(id);
    const action = isPracticed ? 'remove' : 'add';
    
    const next = isPracticed ? practicedTopics.filter(t => t !== id) : [...practicedTopics, id];
    setPracticedTopics(next);
    
    if (user) {
      await updateUserDataAPI('practiced_topics', action, id);
    } else {
      localStorage.setItem(practicedStorageKey, JSON.stringify(next));
    }
  };

  const addMissingWord = async (topicId: number, word: string) => {
    const dataStr = `${topicId}:${word}`;
    if (missingWords.includes(dataStr)) return;
    
    const next = [...missingWords, dataStr];
    setMissingWords(next);
    
    if (user) {
      await updateUserDataAPI('missing_words', 'add', dataStr);
    } else {
      saveMissingWordsToLocal(next);
    }
  };

  const removeMissingWord = async (topicId: number, word: string) => {
    const dataStr = `${topicId}:${word}`;
    const next = missingWords.filter(w => w !== dataStr);
    setMissingWords(next);
    
    if (user) {
      await updateUserDataAPI('missing_words', 'remove', dataStr);
    } else {
      saveMissingWordsToLocal(next);
    }
  };

  const editMissingWord = async (topicId: number, oldWord: string, newWord: string) => {
    await removeMissingWord(topicId, oldWord);
    if (newWord.trim()) {
      await addMissingWord(topicId, newWord.trim());
    }
  };

  const saveMissingWordsToLocal = (wordsArray: string[]) => {
    const map = new Map<number, string[]>();
    wordsArray.forEach(mw => {
      const [idStr, ...wordParts] = mw.split(':');
      const id = parseInt(idStr, 10);
      const word = wordParts.join(':');
      if (!map.has(id)) map.set(id, []);
      map.get(id)!.push(word);
    });
    const parsed = Array.from(map.entries()).map(([text, word]) => ({ text, word }));
    localStorage.setItem(missingWordsStorageKey, JSON.stringify(parsed));
  };

  const savedData = useMemo(() => {
    const map = new Map<number, string[]>();
    missingWords.forEach(mw => {
      const [idStr, ...wordParts] = mw.split(':');
      const id = parseInt(idStr, 10);
      const word = wordParts.join(':');
      if (!map.has(id)) map.set(id, []);
      map.get(id)!.push(word);
    });
    return Array.from(map.entries()).map(([text, word]) => ({ text, word }));
  }, [missingWords]);

  const handleLangChange = (newLang: 'fr' | 'de') => {
    setLang(newLang);
    setCurrentTopic(null);
  };

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify({username: userData.username}));
  };

  const handleLogout = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await fetch(`${API_BASE}/logout`, { method: 'POST', credentials: 'include' });
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      setPracticedTopics([]);
      setMissingWords([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <header className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
              <MessageCircle size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Parlez-vous ?</h1>
              <p className="text-slate-500 text-sm hidden sm:block">
                {lang === 'fr' ? 'French' : 'German'} Conversation Topics
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            {!currentTopic && (
              <>
                <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
                  <button
                    onClick={() => handleLangChange('fr')}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      lang === 'fr' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🇫🇷 FR
                  </button>
                  <button
                    onClick={() => handleLangChange('de')}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      lang === 'de' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🇩🇪 DE
                  </button>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
                  <button
                    onClick={() => setActiveTab('practice')}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                      activeTab === 'practice' 
                        ? 'bg-white text-indigo-700 shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <List size={18} />
                    Practice
                  </button>
                  <button
                    onClick={() => setActiveTab('vocab')}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                      activeTab === 'vocab' 
                        ? 'bg-white text-indigo-700 shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <BookA size={18} />
                    Vocab
                  </button>
                </div>
              </>
            )}

            <div className="flex items-center gap-2 border-l border-slate-200 pl-4 ml-2">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
                    <User size={16} className="text-indigo-600" />
                    {user.username}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-medium transition-colors"
                >
                  <LogIn size={18} />
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTopic ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TopicCard 
              topic={currentTopic} 
              onBack={() => setCurrentTopic(null)}
              isPracticed={practicedTopics.includes(currentTopic.id)}
              togglePracticed={togglePracticed}
              lang={lang}
              savedData={savedData}
              onAddWord={addMissingWord}
              onRemoveWord={removeMissingWord}
            />
          </div>
        ) : (
          activeTab === 'practice' ? (
            <PracticeTab 
              onSelectTopic={setCurrentTopic} 
              practicedTopics={practicedTopics}
              togglePracticed={togglePracticed}
              topics={currentTopics}
            />
          ) : (
            <VocabTab 
              lang={lang} 
              topics={currentTopics} 
              savedData={savedData}
              onEditWord={editMissingWord}
              onDeleteWord={removeMissingWord}
            />
          )
        )}
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />
    </div>
  );
}
