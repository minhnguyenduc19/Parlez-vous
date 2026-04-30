import { useState, useMemo } from 'react';
import { CheckCircle, Circle, Shuffle, Play, Filter } from 'lucide-react';
export function PracticeTab({
  onSelectTopic,
  practicedTopics,
  togglePracticed,
  topics
}) {
  const [hidePracticed, setHidePracticed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = useMemo(() => {
    const cats = Array.from(new Set(topics.map(t => t.category).filter(Boolean)));
    return ['All', ...cats.sort()];
  }, [topics]);
  const displayedTopics = topics.filter(t => {
    if (hidePracticed && practicedTopics.includes(t.id)) return false;
    if (selectedCategory !== 'All' && t.category !== selectedCategory) return false;
    return true;
  });
  const handleRandomTopic = () => {
    if (displayedTopics.length === 0) return;
    const randomIndex = Math.floor(Math.random() * displayedTopics.length);
    onSelectTopic(displayedTopics[randomIndex]);
  };
  return <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium whitespace-nowrap">
            <input type="checkbox" checked={hidePracticed} onChange={e => setHidePracticed(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            Hide practiced
          </label>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={18} className="text-slate-400" />
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full sm:w-auto bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium">
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
        
        <button onClick={handleRandomTopic} disabled={displayedTopics.length === 0} className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl font-medium shadow-sm transition-all active:scale-95 w-full sm:w-auto">
          <Shuffle size={18} />
          Pick Random Topic
        </button>
      </div>

      {displayedTopics.length === 0 ? <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm">
          No topics available matching your criteria.
        </div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedTopics.map(topic => {
        const isPracticed = practicedTopics.includes(topic.id);
        return <div key={topic.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-32 bg-cover bg-center relative" style={{
            backgroundImage: `url('${topic.imageUrl}')`
          }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  <div className="absolute top-3 left-3 z-10 flex gap-2">
                    <span className="px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-lg text-xs font-bold text-white border border-white/20 shadow-sm">
                      {topic.level}
                    </span>
                    {topic.category && <span className="px-2.5 py-1 bg-indigo-600/80 backdrop-blur-md rounded-lg text-xs font-bold text-white border border-indigo-400/30 shadow-sm">
                        {topic.category}
                      </span>}
                  </div>

                  <button onClick={() => togglePracticed(topic.id)} className={`absolute top-3 right-3 flex-shrink-0 transition-colors drop-shadow-md z-10 ${isPracticed ? 'text-emerald-400' : 'text-white/80 hover:text-white'}`} title={isPracticed ? "Mark as unpracticed" : "Mark as practiced"}>
                    {isPracticed ? <CheckCircle size={24} /> : <Circle size={24} />}
                  </button>
                  <div className="absolute bottom-3 left-4 right-4 z-10">
                    <h3 className="text-lg font-bold text-white leading-tight drop-shadow-md">{topic.title}</h3>
                  </div>
                </div>
                <div className="p-5 flex flex-col justify-between gap-4 flex-grow">
                  <p className="text-slate-500 text-sm">{topic.titleEn}</p>
                  <button onClick={() => onSelectTopic(topic)} className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 hover:bg-indigo-50 text-indigo-600 rounded-xl font-medium transition-colors border border-slate-200 hover:border-indigo-200 mt-auto">
                    <Play size={18} />
                    Discuss
                  </button>
                </div>
              </div>;
      })}
        </div>}
    </div>;
}