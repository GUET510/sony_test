import React, { useState } from 'react';
import InputForm from './components/InputForm';
import PlanCard from './components/PlanCard';
import { ShootingPlan, UserInput, LoadingState } from './types';
import { generateShootingPlans } from './services/gemini';
import { Camera, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [plans, setPlans] = useState<ShootingPlan[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (input: UserInput) => {
    setLoadingState(LoadingState.GENERATING_TEXT);
    setError(null);
    setPlans([]);

    try {
      const generatedPlans = await generateShootingPlans(input);
      setPlans(generatedPlans);
      setLoadingState(LoadingState.COMPLETE);
    } catch (err) {
      console.error(err);
      setError("生成方案失败。请检查您的 API Key 并重试。");
      setLoadingState(LoadingState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 selection:bg-orange-500/30">
      
      {/* Header */}
      <header className="border-b border-neutral-900 bg-neutral-950 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-600 p-2 rounded-lg shadow-lg shadow-orange-900/20">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Sony <span className="text-orange-500">Alpha</span> 导师
                <span className="bg-neutral-800 text-neutral-400 text-[10px] px-2 py-0.5 rounded-full font-normal tracking-wide hidden sm:inline-block">新手保姆级</span>
              </h1>
              <p className="text-xs text-neutral-500 font-mono tracking-wider">A7R3 + 24-70mm F4 出片指南</p>
            </div>
          </div>
          <div className="hidden sm:block text-right">
             <div className="text-xs text-neutral-500">AI 驱动</div>
             <div className="text-[10px] text-neutral-600 font-mono">Gemini 2.5 Flash</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        
        {/* Intro Text */}
        <div className="text-center mb-10 space-y-4">
          <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight">
            让小白也能拍出<span className="font-serif italic text-orange-500">大片</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            专为 <span className="text-white font-medium">Zeiss 24-70mm F4</span> 设计。
            一次生成 <span className="text-white font-bold">6 组</span>方案（3组竖屏 + 3组横屏）。
            提供精确的<span className="text-orange-400">引导话术</span>、<span className="text-orange-400">傻瓜式构图</span>和<span className="text-orange-400">站位指导</span>。
          </p>
        </div>

        {/* Input Form */}
        <InputForm onSubmit={handleGenerate} loadingState={loadingState} />

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-900/20 border border-red-900/50 rounded-lg flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Results Grid */}
        {plans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {plans.map((plan, index) => (
              <PlanCard key={index} plan={plan} index={index} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-neutral-900 bg-black py-8 text-center text-neutral-600 text-xs">
        <p>&copy; {new Date().getFullYear()} Sony Alpha Guide. AI 生成内容，仅供参考。</p>
      </footer>
    </div>
  );
};

export default App;