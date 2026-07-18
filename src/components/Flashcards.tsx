import React, { useState } from "react";
import { MEDICATIONS } from "../data";
import { Medication } from "../types";
import { Sparkles, ArrowRight, ArrowLeft, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

interface CardState {
  index: number;
  isFlipped: boolean;
  score: { mastered: number; review: number };
  masteredList: string[]; // med ids
  mode: "indication" | "mechanism" | "presentation";
}

export default function Flashcards() {
  const [state, setState] = useState<CardState>({
    index: 0,
    isFlipped: false,
    score: { mastered: 0, review: 0 },
    masteredList: [],
    mode: "indication"
  });

  const activeMed: Medication = MEDICATIONS[state.index];

  const handleFlip = () => {
    setState(s => ({ ...s, isFlipped: !s.isFlipped }));
  };

  const handleNext = () => {
    setState(s => ({
      ...s,
      isFlipped: false,
      index: (s.index + 1) % MEDICATIONS.length
    }));
  };

  const handlePrev = () => {
    setState(s => ({
      ...s,
      isFlipped: false,
      index: s.index === 0 ? MEDICATIONS.length - 1 : s.index - 1
    }));
  };

  const markMastered = (mastered: boolean) => {
    setState(s => {
      const isAlreadyInList = s.masteredList.includes(activeMed.id);
      let newMasteredList = [...s.masteredList];
      
      if (mastered && !isAlreadyInList) {
        newMasteredList.push(activeMed.id);
      } else if (!mastered && isAlreadyInList) {
        newMasteredList = newMasteredList.filter(id => id !== activeMed.id);
      }

      return {
        ...s,
        masteredList: newMasteredList,
        isFlipped: false,
        index: (s.index + 1) % MEDICATIONS.length
      };
    });
  };

  const resetProgress = () => {
    setState(s => ({
      ...s,
      index: 0,
      isFlipped: false,
      masteredList: []
    }));
  };

  const changeMode = (mode: "indication" | "mechanism" | "presentation") => {
    setState(s => ({ ...s, mode, isFlipped: false }));
  };

  // Content helper
  const getFrontContent = () => {
    if (state.mode === "indication") {
      return (
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-natural-header bg-natural-accent/20 px-3 py-1 rounded-full">
            התוויות קליניות (למי שייך הטיפול?)
          </span>
          <div className="space-y-2 mt-4 text-natural-dark-text">
            {activeMed.indications.map((ind, i) => (
              <div key={i} className="font-bold text-lg md:text-xl text-center bg-natural-bg border border-natural-border/30 p-2 rounded-xl">
                • {ind}
              </div>
            ))}
          </div>
        </div>
      );
    } else if (state.mode === "mechanism") {
      return (
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-natural-header bg-natural-accent/20 px-3 py-1 rounded-full">
            מנגנון פעולה (איך פועל בגוף?)
          </span>
          <p className="font-bold text-lg md:text-xl text-natural-dark-text leading-relaxed text-center mt-6">
            {activeMed.mechanism}
          </p>
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-natural-header bg-natural-accent/20 px-3 py-1 rounded-full">
            צורת הופעה ומינון בעגלה
          </span>
          <p className="font-mono font-extrabold text-3xl md:text-4xl text-natural-dark-text text-center mt-10">
            {activeMed.presentation}
          </p>
          <p className="text-xs text-natural-light-text text-center">איזו תרופה מוגשת במינון זה?</p>
        </div>
      );
    }
  };

  const masteryPercentage = Math.round((state.masteredList.length / MEDICATIONS.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4" id="flashcards">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-natural-dark-text flex items-center justify-center gap-2">
          <span>🧠 כרטיסיות זיכרון ואחזור פעיל</span>
        </h2>
        <p className="text-natural-medium-text mt-1 text-sm md:text-base">
          בחרו סגנון כרטיסיה, נסו לזכור את שם התרופה, הפכו את הכרטיס כדי לבדוק את עצמכם וסמנו את רמת השליטה!
        </p>
      </div>

      {/* Mode selectors */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => changeMode("indication")}
          className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-bold border transition-all ${
            state.mode === "indication"
              ? "bg-natural-header border-natural-header text-white shadow-sm"
              : "bg-white border-natural-border text-natural-medium-text hover:bg-natural-bg"
          }`}
          id="btn-mode-indication"
        >
          לפי התוויות קליניות
        </button>
        <button
          onClick={() => changeMode("mechanism")}
          className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-bold border transition-all ${
            state.mode === "mechanism"
              ? "bg-natural-header border-natural-header text-white shadow-sm"
              : "bg-white border-natural-border text-natural-medium-text hover:bg-natural-bg"
          }`}
          id="btn-mode-mechanism"
        >
          לפי מנגנון פעולה
        </button>
        <button
          onClick={() => changeMode("presentation")}
          className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-bold border transition-all ${
            state.mode === "presentation"
              ? "bg-natural-header border-natural-header text-white shadow-sm"
              : "bg-white border-natural-border text-natural-medium-text hover:bg-natural-bg"
          }`}
          id="btn-mode-presentation"
        >
          לפי צורת הופעה
        </button>
      </div>

      {/* Mastered Progress Bar */}
      <div className="bg-white rounded-2xl border border-natural-border p-4 mb-6 shadow-sm">
        <div className="flex justify-between items-center mb-1 text-xs md:text-sm">
          <span className="font-bold text-natural-dark-text">מדד שליטה פעיל: {state.masteredList.length} מתוך {MEDICATIONS.length}</span>
          <span className="font-mono font-bold text-natural-header">{masteryPercentage}% שליטה</span>
        </div>
        <div className="w-full h-3 bg-natural-bg rounded-full overflow-hidden border border-natural-border">
          <div 
            className="h-full bg-gradient-to-r from-natural-accent to-natural-accent-hover transition-all duration-300"
            style={{ width: `${masteryPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Interactive 3D Flip Card */}
      <div 
        onClick={handleFlip}
        className="cursor-pointer flip-card w-full h-[360px] md:h-[400px] mb-6 focus:outline-none"
        id="flashcard-container"
      >
        <div className={`relative w-full h-full flip-card-inner rounded-3xl shadow-md border border-natural-border transition-all duration-500 ${state.isFlipped ? "flip-card-flipped" : ""}`}>
          
          {/* Card Front */}
          <div className="absolute inset-0 bg-white rounded-3xl p-6 flex flex-col justify-between flip-card-front">
            <div className="flex justify-between items-center border-b border-natural-bg pb-3">
              <span className="text-xs text-natural-light-text font-bold">כרטיסיה {state.index + 1} / {MEDICATIONS.length}</span>
              <span className="text-[11px] font-bold text-natural-medium-text flex items-center gap-1 bg-natural-callout px-2 py-0.5 rounded">
                <RefreshCw size={10} className="animate-spin text-natural-accent" />
                <span>לחצו להפיכת הכרטיס</span>
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center py-4">
              {getFrontContent()}
            </div>

            <div className="text-center text-xs text-natural-light-text border-t border-natural-bg pt-3">
              לחצו בכל מקום על גבי הכרטיס כדי לראות את התשובה
            </div>
          </div>

          {/* Card Back */}
          <div className="absolute inset-0 bg-natural-header text-natural-cream rounded-3xl p-6 flex flex-col justify-between flip-card-back">
            <div className="flex justify-between items-center border-b border-natural-header/30 pb-3">
              <span className="text-xs text-natural-cream/70 font-bold">פתרון קליני</span>
              <span className="text-[11px] font-bold text-natural-secondary flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded">
                <Sparkles size={10} />
                <span>שליטה מלאה!</span>
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center py-4">
              <span className="w-4 h-4 rounded-full bg-natural-accent mb-2 shadow"></span>
              <h3 className="text-3xl font-extrabold text-natural-secondary tracking-tight">{activeMed.name}</h3>
              <p className="text-natural-cream/80 font-mono text-sm mt-1">{activeMed.englishName}</p>

              <div className="mt-4 bg-white/10 rounded-xl p-3 max-w-md border border-white/10">
                <span className="text-[10px] font-mono font-bold text-natural-secondary uppercase tracking-wider block mb-1">צורת הופעה</span>
                <span className="font-mono text-base font-bold text-natural-cream">{activeMed.presentation}</span>
              </div>
            </div>

            <div className="text-center text-xs text-natural-cream/70 border-t border-natural-header/30 pt-3">
              לחצו להפיכה חזרה
            </div>
          </div>

        </div>
      </div>

      {/* Control Buttons & Active Recall assessment */}
      <div className="space-y-4">
        {state.isFlipped ? (
          <div className="grid grid-cols-2 gap-3 animate-fade-in">
            <button
              onClick={(e) => { e.stopPropagation(); markMastered(false); }}
              className="bg-natural-bg border border-natural-border text-natural-dark-text p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-natural-cream transition-all shadow-sm"
              id="btn-recall-review"
            >
              <AlertCircle size={20} className="text-natural-secondary" />
              <span>צריך חזרה (לא ידעתי)</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); markMastered(true); }}
              className="bg-natural-header border border-natural-header text-natural-cream p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-sm"
              id="btn-recall-mastered"
            >
              <CheckCircle size={20} className="text-natural-accent" />
              <span>ידעתי היטב! 🎉</span>
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrev}
              className="bg-white border border-natural-border p-3 rounded-xl text-natural-dark-text font-bold flex items-center gap-1.5 hover:bg-natural-bg transition-all text-xs md:text-sm"
              id="btn-card-prev"
            >
              <ArrowRight size={16} />
              <span>הקודם</span>
            </button>
            <button
              onClick={resetProgress}
              className="text-natural-light-text hover:text-natural-dark-text text-xs font-bold transition-all"
              id="btn-card-reset"
            >
              איפוס שליטה
            </button>
            <button
              onClick={handleNext}
              className="bg-white border border-natural-border p-3 rounded-xl text-natural-dark-text font-bold flex items-center gap-1.5 hover:bg-natural-bg transition-all text-xs md:text-sm"
              id="btn-card-next"
            >
              <span>הבא</span>
              <ArrowLeft size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
