import { useState, useRef } from 'react';
import { Download, Edit2, Check, X, Trash2 } from 'lucide-react';
import html2canvas from 'html2canvas';
export function VocabTab({
  lang,
  topics,
  savedData,
  onEditWord,
  onDeleteWord
}) {
  const [editingInfo, setEditingInfo] = useState(null);
  const exportRef = useRef(null);
  const handleEditSave = () => {
    if (!editingInfo) return;
    const {
      topicId,
      oldWord,
      value
    } = editingInfo;
    onEditWord(topicId, oldWord, value);
    setEditingInfo(null);
  };
  const handleDeleteWord = (topicId, word) => {
    onDeleteWord(topicId, word);
  };
  const handleExport = async () => {
    if (!exportRef.current) return;
    try {
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#f8fafc',
        // slate-50
        scale: 2
      });
      const link = document.createElement('a');
      link.download = 'french-vocab.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Failed to export image", err);
    }
  };
  const hasWords = savedData.some(d => d.word.length > 0);
  return <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800">My Unknown Words</h2>
        <button onClick={handleExport} disabled={!hasWords} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-xl font-medium shadow-sm transition-all active:scale-95">
          <Download size={18} />
          Export to Image
        </button>
      </div>

      {!hasWords ? <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm">
          No unknown words saved yet. Start practicing and add some!
        </div> : <div ref={exportRef} className="bg-slate-50 p-4 sm:p-6 rounded-2xl">
          <div className="space-y-6">
            {savedData.filter(d => d.word.length > 0).map(topicData => {
          const topic = topics.find(t => t.id === topicData.text);
          const topicTitle = topic ? topic.title : `Topic ${topicData.text}`;
          return <div key={topicData.text} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-indigo-700 mb-3 border-b border-slate-100 pb-2">
                    {topicTitle}
                  </h3>
                  <ul className="space-y-2">
                    {topicData.word.map((w, idx) => {
                const isEditing = editingInfo?.topicId === topicData.text && editingInfo?.oldWord === w;
                return <li key={idx} className="flex items-center justify-between group p-2 hover:bg-slate-50 rounded-lg transition-colors">
                          {isEditing ? <div className="flex items-center gap-2 w-full">
                              <input type="text" value={editingInfo.value} onChange={e => setEditingInfo({
                      ...editingInfo,
                      value: e.target.value
                    })} className="flex-grow p-1.5 px-3 rounded border border-indigo-300 focus:ring-2 focus:ring-indigo-500 outline-none" autoFocus onKeyDown={e => e.key === 'Enter' && handleEditSave()} />
                              <button onClick={handleEditSave} className="text-emerald-600 hover:bg-emerald-100 p-1.5 rounded">
                                <Check size={18} />
                              </button>
                              <button onClick={() => setEditingInfo(null)} className="text-slate-400 hover:bg-slate-200 p-1.5 rounded">
                                <X size={18} />
                              </button>
                            </div> : <>
                              <span className="flex items-center gap-2 text-slate-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>
                                {w}
                              </span>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" data-html2canvas-ignore>
                                <button onClick={() => setEditingInfo({
                        topicId: topicData.text,
                        oldWord: w,
                        value: w
                      })} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded transition-colors" title="Edit">
                                  <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDeleteWord(topicData.text, w)} className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors" title="Delete">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </>}
                        </li>;
              })}
                  </ul>
                </div>;
        })}
          </div>
        </div>}
    </div>;
}