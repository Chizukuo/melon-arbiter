import { AnalysisResult } from '../services/geminiService';
import { Clock, ShieldAlert, CheckCircle2, XCircle, FileSearch, Scale, Gavel } from 'lucide-react';

export function ResultsDashboard({ result }: { result: AnalysisResult }) {
  if (!result) return null;

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Conclusion Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-8 transform transition-all hover:-translate-y-1 hover:shadow-md">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-cheese-100 p-2 rounded-xl text-cheese-600">
            <Scale className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-stone-800">仲裁结论</h2>
        </div>
        <p className="text-stone-600 leading-relaxed text-lg whitespace-pre-wrap mb-8">
          {result.conclusion}
        </p>

        {/* Responsibility Allocation (Mercy Court) */}
        {result.responsibility_allocation && result.responsibility_allocation.length > 0 && (
          <div className="mt-6 pt-6 border-t border-stone-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-rose-50 p-2 rounded-xl text-rose-500">
                <Gavel className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-stone-800">法庭责任划分</h3>
            </div>
            
            <div className="space-y-6">
              {result.responsibility_allocation.map((alloc, idx) => (
                <div key={idx} className="bg-stone-50 rounded-2xl p-5 border border-stone-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-2">
                    <span className="font-bold text-stone-800 text-lg">{alloc.party}</span>
                    <div className="flex items-center space-x-3">
                      <div className="text-sm text-stone-500 font-medium">责任占比</div>
                      <div className="text-2xl font-black text-rose-500">{alloc.percentage}%</div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-stone-200 rounded-full h-2.5 mb-4 overflow-hidden">
                    <div 
                      className="bg-rose-400 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${alloc.percentage}%` }}
                    ></div>
                  </div>
                  
                  <p className="text-stone-600 text-sm leading-relaxed bg-white p-3 rounded-xl border border-stone-100">
                    <span className="font-semibold text-stone-700 mr-2">判定依据:</span>
                    {alloc.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Timeline */}
        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-blue-50 p-2 rounded-xl text-blue-500">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-800">时间线</h3>
          </div>
          <div className="relative border-l-2 border-stone-100 ml-4 space-y-6">
            {result.timeline.map((item, idx) => (
              <div key={idx} className="relative pl-6">
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white bg-blue-400 shadow-sm" />
                <div className="text-sm font-semibold text-blue-500 mb-1">{item.time}</div>
                <div className="text-stone-700 bg-stone-50 rounded-xl p-3 border border-stone-100">{item.event}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Fallacies */}
        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-orange-50 p-2 rounded-xl text-orange-500">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-800">逻辑谬误</h3>
          </div>
          <div className="space-y-4">
            {result.fallacies.length > 0 ? result.fallacies.map((item, idx) => {
              const severityColor = 
                item.severity === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                item.severity === 'medium' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                'bg-yellow-50 text-yellow-700 border-yellow-200';
              
              const severityLabel = item.severity === 'high' ? '严重' : item.severity === 'medium' ? '中等' : '轻微';

              return (
                <div key={idx} className={`p-4 rounded-2xl border ${severityColor}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold">{item.type}</span>
                    <span className="text-xs uppercase px-2 py-1 bg-white/50 rounded-full font-semibold tracking-wide">
                      {severityLabel}
                    </span>
                  </div>
                  <p className="text-sm opacity-90">{item.description}</p>
                </div>
              );
            }) : (
              <div className="text-stone-500 italic p-4 bg-stone-50 rounded-2xl border border-stone-100">
                未检测到重大逻辑谬误。
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Evidence Check */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-teal-50 p-2 rounded-xl text-teal-600">
            <FileSearch className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-stone-800">证据核对</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-stone-100">
                <th className="pb-3 text-stone-500 font-semibold w-1/3">相关主张 / 言论</th>
                <th className="pb-3 text-stone-500 font-semibold w-24 text-center">状态</th>
                <th className="pb-3 text-stone-500 font-semibold">附注</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {result.evidence_check.map((item, idx) => (
                <tr key={idx} className="group hover:bg-stone-50 transition-colors">
                  <td className="py-4 pr-4 align-top">
                    <p className="text-stone-800 font-medium">{item.claim}</p>
                  </td>
                  <td className="py-4 px-2 align-top text-center">
                    {item.evidenceFound ? (
                      <div className="inline-flex items-center space-x-1 text-teal-600 bg-teal-50 px-2 py-1 rounded-lg break-keep whitespace-nowrap">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-bold">已证实</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center space-x-1 text-red-500 bg-red-50 px-2 py-1 rounded-lg break-keep whitespace-nowrap">
                        <XCircle className="w-4 h-4" />
                        <span className="text-xs font-bold">未证实</span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 pl-4 align-top">
                    <p className="text-stone-600 text-sm leading-relaxed">{item.notes}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
