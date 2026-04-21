import { Scale } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full py-8 mb-4">
      <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-cheese-400 rounded-2xl flex items-center justify-center transform -rotate-6 shadow-sm border border-cheese-500">
            <Scale className="w-6 h-6 text-stone-900" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              吃瓜仲裁器
            </h1>
            <p className="text-sm font-medium text-stone-500 tracking-wider uppercase">
              Cheese Arbiter
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
