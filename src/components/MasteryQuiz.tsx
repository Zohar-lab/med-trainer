import React, { useState } from "react";
import { QUIZ_QUESTIONS } from "../data";
import { Sparkles, Trophy, Award, RefreshCw, ChevronLeft, CheckCircle, XCircle } from "lucide-react";

interface QuizState {
  index: number;
  selectedOption: string | null;
  score: number;
  isFinished: boolean;
  studentName: string;
}

export default function MasteryQuiz() {
  const [state, setState] = useState<QuizState>({
    index: 0,
    selectedOption: null,
    score: 0,
    isFinished: false,
    studentName: ""
  });

  const activeQuestion = QUIZ_QUESTIONS[state.index];

  const handleOptionClick = (option: string) => {
    if (state.selectedOption) return; // Prevent double selection

    const isCorrect = option === activeQuestion.correctAnswer;
    setState(s => ({
      ...s,
      selectedOption: option,
      score: isCorrect ? s.score + 1 : s.score
    }));
  };

  const handleNext = () => {
    if (state.index === QUIZ_QUESTIONS.length - 1) {
      setState(s => ({ ...s, isFinished: true }));
    } else {
      setState(s => ({
        ...s,
        index: s.index + 1,
        selectedOption: null
      }));
    }
  };

  const restartQuiz = () => {
    setState({
      index: 0,
      selectedOption: null,
      score: 0,
      isFinished: false,
      studentName: ""
    });
  };

  const currentProgressPercent = Math.round(((state.index + 1) / QUIZ_QUESTIONS.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4" id="mastery-quiz">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-natural-dark-text flex items-center justify-center gap-2">
          <span>📝 בוחן שליטה מסכם בתרופות</span>
        </h2>
        <p className="text-natural-medium-text mt-1 text-sm md:text-base">
          העמידו את הידע שלכם למבחן! ענו על {QUIZ_QUESTIONS.length} השאלות וקבלו תעודת שליטה קלינית רשמית.
        </p>
      </div>

      {!state.isFinished ? (
        <div className="bg-white rounded-3xl border border-natural-border p-6 shadow-md space-y-6">
          {/* Progress Header */}
          <div className="flex justify-between items-center border-b border-natural-bg pb-3">
            <span className="text-xs font-bold text-natural-light-text">
              שאלה {state.index + 1} מתוך {QUIZ_QUESTIONS.length}
            </span>
            <div className="w-32 h-2 bg-natural-bg rounded-full overflow-hidden border border-natural-border">
              <div 
                className="h-full bg-natural-header transition-all duration-300"
                style={{ width: `${currentProgressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-natural-dark-text leading-snug text-right">
              {activeQuestion.question}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3">
            {activeQuestion.options.map((opt) => {
              const isSelected = state.selectedOption === opt;
              const isCorrect = opt === activeQuestion.correctAnswer;
              const hasSelected = state.selectedOption !== null;

              let buttonStyle = "bg-white border-natural-border hover:border-natural-medium-text hover:bg-natural-bg text-natural-dark-text";
              if (hasSelected) {
                if (isCorrect) {
                  buttonStyle = "bg-natural-accent/10 border-natural-accent text-natural-header font-bold";
                } else if (isSelected) {
                  buttonStyle = "bg-rose-50 border-natural-secondary text-natural-secondary font-bold";
                } else {
                  buttonStyle = "bg-white border-natural-bg text-natural-light-text opacity-60";
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleOptionClick(opt)}
                  disabled={hasSelected}
                  className={`w-full text-right p-4 rounded-2xl border-2 transition-all duration-150 text-sm md:text-base flex justify-between items-center ${buttonStyle}`}
                  id={`quiz-opt-${opt.replace(/\s+/g, "-")}`}
                >
                  <span className="leading-relaxed">{opt}</span>
                  {hasSelected && isCorrect && <CheckCircle size={18} className="text-natural-accent flex-shrink-0" />}
                  {hasSelected && isSelected && !isCorrect && <XCircle size={18} className="text-natural-secondary flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanatory notes once selected */}
          {state.selectedOption && (
            <div className="bg-natural-header text-natural-cream p-5 rounded-2xl border border-natural-header/30 animate-fade-in space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-natural-accent uppercase tracking-wider">
                <Sparkles size={14} />
                <span>הסבר קליני ומדעי</span>
              </div>
              <p className="text-natural-cream/95 text-sm leading-relaxed">
                {activeQuestion.explanation}
              </p>
              
              <div className="pt-3 flex justify-end">
                <button
                  onClick={handleNext}
                  className="bg-white text-natural-header font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-1 hover:opacity-90 transition-all shadow"
                  id="btn-quiz-next"
                >
                  <span>{state.index === QUIZ_QUESTIONS.length - 1 ? "סיום בוחן" : "שאלה הבאה"}</span>
                  <ChevronLeft size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Certificate & Quiz Finished view */
        <div className="bg-white rounded-3xl border border-natural-border p-8 shadow-md text-center space-y-6 animate-fade-in">
          <div className="flex justify-center">
            <div className="bg-natural-cream p-4 rounded-full border border-natural-border">
              <Trophy className="text-natural-accent animate-bounce" size={54} />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-3xl font-extrabold text-natural-dark-text">הבוחן הושלם בהצלחה!</h3>
            <p className="text-natural-medium-text text-base">
              עניתם נכונה על <strong className="text-natural-header font-extrabold">{state.score}</strong> מתוך <strong className="text-natural-header font-extrabold">{QUIZ_QUESTIONS.length}</strong> שאלות בוחן השליטה.
            </p>
          </div>

          {state.score >= 4 ? (
            <div className="space-y-6 max-w-lg mx-auto bg-natural-cream p-6 rounded-2xl border border-natural-border" id="certificate-panel">
              <div className="space-y-2">
                <label className="text-xs font-bold text-natural-medium-text block">הזינו את שמכם להפקת תעודת השליטה:</label>
                <input
                  type="text"
                  value={state.studentName}
                  onChange={(e) => setState(s => ({ ...s, studentName: e.target.value }))}
                  placeholder="השם שלכם בעברית..."
                  className="w-full text-center p-3 rounded-xl border-2 border-natural-border focus:border-natural-header focus:outline-none font-bold text-base bg-white text-natural-dark-text"
                  id="input-student-name"
                />
              </div>

              {state.studentName.trim() && (
                <div className="border-4 border-double border-natural-secondary bg-white p-6 rounded-xl shadow-inner relative overflow-hidden animate-fade-in text-center space-y-4">
                  {/* Decorative stamp */}
                  <div className="absolute -bottom-8 -right-8 opacity-5 text-natural-header">
                    <Award size={160} />
                  </div>

                  <div className="flex justify-center">
                    <Award className="text-natural-secondary animate-pulse" size={40} />
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-serif font-extrabold text-xl text-natural-header uppercase tracking-widest">תעודת שליטה קלינית</h4>
                    <p className="text-[10px] text-natural-medium-text font-mono">CRASH CART MEDICATION MASTERY</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-natural-medium-text">תעודה זו מוענקת בגאווה ל-</p>
                    <p className="text-xl font-extrabold text-natural-dark-text border-b border-dashed border-natural-border pb-1 inline-block px-8">
                      {state.studentName}
                    </p>
                    <p className="text-xs text-natural-medium-text mt-2">
                      על השגת רמת מומחיות יוצאת מן הכלל בשליטה בתרופות עגלת החייאה, מנגנוני הפעולה הקליניים, צורות הופעה והתוויות לשימוש במקרי חירום.
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-natural-light-text pt-4 border-t border-natural-bg">
                    <div>
                      <span>ציון: </span>
                      <strong className="text-natural-dark-text">{Math.round((state.score / QUIZ_QUESTIONS.length) * 100)}%</strong>
                    </div>
                    <div>
                      <span>תאריך הפקה: </span>
                      <strong className="text-natural-dark-text">{new Date().toLocaleDateString("he-IL")}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-natural-bg p-4 rounded-2xl border border-natural-border text-natural-medium-text text-center text-sm">
              נראה שחסר לכם עוד קצת ביטחון בחומר כדי להפיק תעודת שליטה! מומלץ לחזור על כרטיסיות הזיכרון ומשחק ההתאמה ולנסות שוב.
            </div>
          )}

          <div className="pt-4">
            <button
              onClick={restartQuiz}
              className="bg-natural-header border border-natural-header text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow mx-auto"
              id="btn-quiz-restart"
            >
              <RefreshCw size={16} />
              <span>מבחן מחדש</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
