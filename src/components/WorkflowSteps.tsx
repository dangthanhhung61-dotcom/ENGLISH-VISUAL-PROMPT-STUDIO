import React from 'react';
import { BookOpen, Layers, Edit3, Wand2 } from 'lucide-react';

interface WorkflowStepsProps {
  currentStep?: number;
  activeStep?: number;
  onStepClick?: (stepNumber: number) => void;
}

export const WorkflowSteps: React.FC<WorkflowStepsProps> = ({ currentStep, activeStep, onStepClick }) => {
  const stepValue = activeStep ?? currentStep ?? 1;
  const steps = [
    { number: 1, title: 'CHƯƠNG TRÌNH', icon: BookOpen, desc: 'Khối lớp & Sách' },
    { number: 2, title: 'DẠNG HỌC LIỆU', icon: Layers, desc: '6 định dạng Canva' },
    { number: 3, title: 'NỘI DUNG', icon: Edit3, desc: 'Từ vựng & Mẫu câu' },
    { number: 4, title: 'PROMPT CANVA', icon: Wand2, desc: 'Xem & Sao chép' },
  ];

  return (
    <nav aria-label="Workflow progress" className="bg-white border-b border-slate-200 py-2 sm:py-2.5 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <ol className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCurrent = stepValue === step.number;
            const isCompleted = stepValue > step.number;

            return (
              <li
                key={step.number}
                id={`workflow-step-${step.number}`}
                onClick={() => onStepClick && onStepClick(step.number)}
                className={`flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/20'
                    : isCompleted
                    ? 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100'
                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? '✓' : step.number}
                </div>
                <div className="min-w-0">
                  <div
                    className={`text-xs font-bold tracking-wider truncate ${
                      isCurrent ? 'text-blue-900' : isCompleted ? 'text-slate-800' : 'text-slate-500'
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate hidden sm:block leading-tight">
                    {step.desc}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
