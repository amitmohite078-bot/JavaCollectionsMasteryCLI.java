import React, { useState, useEffect } from 'react';
import { useMasteryStore } from '../../store/useMasteryStore';
import { TOPICS_DATA } from '../../data/topicsData';
import { Trophy, Timer, RotateCcw, CheckCircle, XCircle, Award, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuizTab: React.FC = () => {
  const { activeTopic, quizProgress, submitQuizAnswer, resetQuiz } = useMasteryStore();
  const data = TOPICS_DATA[activeTopic];
  const progress = quizProgress[activeTopic] || { answered: 0, correct: 0, answers: {}, completed: false };

  // 15-minute countdown timer (900 seconds)
  const [timeLeft, setTimeLeft] = useState<number>(900);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [showScoreModal, setShowScoreModal] = useState<boolean>(false);

  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          setShowScoreModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: number, selectedLetter: string, correctLetter: string) => {
    if (progress.answers[questionId]) return; // already answered
    submitQuizAnswer(activeTopic, questionId, selectedLetter, correctLetter);

    if (progress.answered + 1 >= 20) {
      setIsTimerRunning(false);
      setShowScoreModal(true);
      if ((progress.correct + (selectedLetter === correctLetter ? 1 : 0)) >= 14) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleReset = () => {
    resetQuiz(activeTopic);
    setTimeLeft(900);
    setIsTimerRunning(true);
    setShowScoreModal(false);
  };

  const scorePercent = Math.round((progress.correct / (progress.answered || 1)) * 100);

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden relative">
      {/* Quiz Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#131c31] border border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Gamified Mastery Evaluation &amp; Quiz Engine
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-normal">
                20 Questions ({data.title})
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              7 Easy + 7 Medium + 6 Hard questions with instant mechanical feedback.
            </p>
          </div>
        </div>

        {/* Live Score & Countdown Timer */}
        <div className="flex items-center gap-3">
          {/* Timer Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0b1120] border border-white/10 text-xs font-mono text-cyan-300">
            <Timer className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-sm">{formatTime(timeLeft)}</span>
          </div>

          {/* Score Counter */}
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-300 font-bold">
            Score: {progress.correct} / {progress.answered} ({progress.answered > 0 ? scorePercent : 0}%)
          </div>

          {/* Reset Quiz Button */}
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all"
            title="Reset Quiz"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Questions Scrollable List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        {data.quizzes.map((q, idx) => {
          const ansState = progress.answers[q.id];
          const isAnswered = Boolean(ansState);

          return (
            <div
              key={q.id}
              className={`p-5 rounded-xl border transition-all ${
                isAnswered
                  ? ansState.isCorrect
                    ? 'bg-emerald-950/15 border-emerald-500/40'
                    : 'bg-rose-950/15 border-rose-500/40'
                  : 'bg-[#131c31] border-white/10 hover:border-cyan-500/30'
              }`}
            >
              {/* Question Header Line */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-slate-400">
                  Question #{idx + 1} of 20
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    q.difficulty === 'Easy'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : q.difficulty === 'Medium'
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                  }`}
                >
                  {q.difficulty} Tier
                </span>
              </div>

              {/* Question Text */}
              <h4 className="text-base font-bold text-white mb-4 leading-relaxed">
                {q.question}
              </h4>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                {q.options.map((opt) => {
                  const optLetter = opt.trim().charAt(0);
                  const isSelected = ansState?.selected === optLetter;
                  const isCorrect = q.correctOption === optLetter;

                  let btnStyle = 'bg-[#0b1120] border-white/10 hover:border-cyan-400/60 text-slate-200';
                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-900/40 border-emerald-400 text-emerald-200 font-bold shadow-glow-emerald';
                    } else if (isSelected && !ansState.isCorrect) {
                      btnStyle = 'bg-rose-900/40 border-rose-400 text-rose-200';
                    } else {
                      btnStyle = 'bg-[#0b1120] border-white/5 opacity-50 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectOption(q.id, optLetter, q.correctOption)}
                      disabled={isAnswered}
                      className={`p-3 rounded-lg border text-xs font-mono text-left transition-all flex items-start gap-2.5 ${btnStyle}`}
                    >
                      <span className="font-bold text-cyan-400 shrink-0">{optLetter})</span>
                      <span>{opt.substring(3)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Step-by-Step Explanation Banner */}
              {isAnswered && (
                <div className="mt-3 p-3.5 rounded-lg bg-[#0b1120] border border-white/10 text-xs font-mono text-slate-300 leading-relaxed animate-fade-in flex items-start gap-2.5">
                  {ansState.isCorrect ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <strong className="text-white block mb-1">
                      {ansState.isCorrect ? 'Correct! ' : `Incorrect (Correct Option: ${q.correctOption}). `}
                      Explanation:
                    </strong>
                    <p className="text-slate-300 font-sans text-sm">{q.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Scorecard Modal */}
      {showScoreModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131c31] border border-cyan-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scale-in text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center shadow-glow-amber">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-1">Quiz Evaluation Complete</h3>
              <p className="text-xs text-slate-400 font-mono">Topic: {data.title}</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0b1120] border border-white/10 space-y-2">
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                {progress.correct} / 20
              </div>
              <div className="text-sm font-semibold text-white">
                Accuracy: <span className="text-cyan-400">{Math.round((progress.correct / 20) * 100)}%</span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {progress.correct >= 16
                  ? 'Mastery Level: FAANG+ Principal Grade'
                  : progress.correct >= 12
                  ? 'Mastery Level: Senior Enterprise Engineer'
                  : 'Mastery Level: Recommended to Review Architecture Deep-Dives'}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowScoreModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold"
              >
                Review Answers
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
