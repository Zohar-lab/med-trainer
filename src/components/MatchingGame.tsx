import React, { useState, useEffect } from "react";
import { MEDICATIONS } from "../data";
import { Medication } from "../types";
import { Sparkles, RefreshCw, Star } from "lucide-react";

interface MatchItem {
  id: string; // Drug ID
  text: string;
  type: "drug" | "target";
}

export default function MatchingGame() {
  const [items, setItems] = useState<{ drugs: MatchItem[]; targets: MatchItem[] }>({ drugs: [], targets: [] });
  const [selectedDrug, setSelectedDrug] = useState<MatchItem | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<MatchItem | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]); // Drug IDs
  const [wrongMatch, setWrongMatch] = useState<{ drugId: string; targetId: string } | null>(null);
  const [gameMode, setGameMode] = useState<"presentation" | "indication">("presentation");
  const [score, setScore] = useState<number>(0);

  const initGame = (mode: "presentation" | "indication" = gameMode) => {
    // Select 5 random medications from the 11
    const shuffledMeds = [...MEDICATIONS].sort(() => 0.5 - Math.random());
    const selectedMeds = shuffledMeds.slice(0, 5);

    // Create drug columns
    const drugItems: MatchItem[] = selectedMeds.map(m => ({
      id: m.id,
      text: m.name,
      type: "drug" as const
    }));

    // Create target columns
    const targetItems: MatchItem[] = selectedMeds.map(m => ({
      id: m.id,
      text: mode === "presentation" ? m.presentation : m.indications[0],
      type: "target" as const
    })).sort(() => 0.5 - Math.random()); // Shuffle targets separately

    setItems({ drugs: drugItems, targets: targetItems });
    setMatchedPairs([]);
    setSelectedDrug(null);
    setSelectedTarget(null);
    setWrongMatch(null);
  };

  useEffect(() => {
    initGame();
  }, [gameMode]);

  const handleDrugClick = (item: MatchItem) => {
    if (matchedPairs.includes(item.id)) return;
    setSelectedDrug(item);

    // If target was already selected, check match
    if (selectedTarget) {
      checkMatch(item, selectedTarget);
    }
  };

  const handleTargetClick = (item: MatchItem) => {
    if (matchedPairs.includes(item.id)) return;
    setSelectedTarget(item);

    // If drug was already selected, check match
    if (selectedDrug) {
      checkMatch(selectedDrug, item);
    }
  };

  const checkMatch = (drug: MatchItem, target: MatchItem) => {
    if (drug.id === target.id) {
      // Correct!
      setMatchedPairs(prev => [...prev, drug.id]);
      setSelectedDrug(null);
      setSelectedTarget(null);
      setScore(s => s + 10);
    } else {
      // Wrong match
      setWrongMatch({ drugId: drug.id, targetId: target.id });
      setScore(s => Math.max(0, s - 5));
      setTimeout(() => {
        setWrongMatch(null);
        setSelectedDrug(null);
        setSelectedTarget(null);
      }, 1000);
    }
  };

  const isCompleted = matchedPairs.length === 5;

  return (
    <div className="max-w-4xl mx-auto px-4" id="matching-game">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-natural-dark-text flex items-center justify-center gap-2">
          <span>🧩 משחק התאמה קליני</span>
        </h2>
        <p className="text-natural-medium-text mt-1 text-sm md:text-base">
          התאימו בין שם התרופה למאפיין הקליני שלה על ידי לחיצה על כרטיס מכל עמודה!
        </p>
      </div>

      {/* Game Mode switch */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => { setGameMode("presentation"); }}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold border transition-all ${
            gameMode === "presentation"
              ? "bg-natural-header border-natural-header text-white shadow-md"
              : "bg-white border-natural-border text-natural-medium-text hover:bg-natural-bg"
          }`}
          id="btn-match-mode-presentation"
        >
          התאמה לפי צורת הופעה / מינון
        </button>
        <button
          onClick={() => { setGameMode("indication"); }}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold border transition-all ${
            gameMode === "indication"
              ? "bg-natural-header border-natural-header text-white shadow-md"
              : "bg-white border-natural-border text-natural-medium-text hover:bg-natural-bg"
          }`}
          id="btn-match-mode-indication"
        >
          התאמה לפי התוויה קלינית ראשית
        </button>
      </div>

      {/* Match columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch relative">
        {/* Drug names column */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-natural-medium-text text-right pr-2">💊 שם התרופה:</h3>
          {items.drugs.map((item) => {
            const isMatched = matchedPairs.includes(item.id);
            const isSelected = selectedDrug?.id === item.id;
            const isWrong = wrongMatch?.drugId === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleDrugClick(item)}
                disabled={isMatched || !!wrongMatch}
                className={`w-full text-right p-4 rounded-xl border-2 transition-all duration-200 font-bold text-sm md:text-base ${
                  isMatched
                    ? "bg-natural-accent/10 border-natural-accent text-natural-header opacity-60 cursor-not-allowed"
                    : isWrong
                      ? "bg-rose-50 border-natural-secondary text-natural-secondary animate-shake"
                      : isSelected
                        ? "bg-natural-bg border-natural-header text-natural-dark-text shadow-md ring-2 ring-natural-accent/30"
                        : "bg-white border-natural-border hover:border-natural-medium-text hover:bg-natural-bg text-natural-dark-text"
                }`}
                id={`match-drug-${item.id}`}
              >
                <div className="flex justify-between items-center">
                  <span>{item.text}</span>
                  {isMatched && <span className="text-xs bg-natural-accent/20 text-natural-header px-2 py-0.5 rounded-full">✓ הושלם</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Target parameters column */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-natural-medium-text text-right pr-2">
            {gameMode === "presentation" ? "📦 מינון / צורת הופעה:" : "📋 התוויה קלינית מוגדרת:"}
          </h3>
          {items.targets.map((item) => {
            const isMatched = matchedPairs.includes(item.id);
            const isSelected = selectedTarget?.id === item.id;
            const isWrong = wrongMatch?.targetId === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleTargetClick(item)}
                disabled={isMatched || !!wrongMatch}
                className={`w-full text-right p-4 rounded-xl border-2 transition-all duration-200 text-xs md:text-sm ${
                  isMatched
                    ? "bg-natural-accent/10 border-natural-accent text-natural-header opacity-60 cursor-not-allowed font-bold"
                    : isWrong
                      ? "bg-rose-50 border-natural-secondary text-natural-secondary animate-shake"
                      : isSelected
                        ? "bg-natural-bg border-natural-header text-natural-dark-text shadow-md ring-2 ring-natural-accent/30 font-bold"
                        : "bg-white border-natural-border hover:border-natural-medium-text hover:bg-natural-bg text-natural-dark-text font-medium"
                }`}
                id={`match-target-${item.id}`}
              >
                <div className="flex justify-between items-center gap-2">
                  <span className="leading-relaxed">{item.text}</span>
                  {isMatched && <span className="text-xs bg-natural-accent/20 text-natural-header px-2 py-0.5 rounded-full flex-shrink-0">✓ הושלם</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Celebrations and Reset */}
      <div className="mt-8 text-center bg-white rounded-2xl border border-natural-border p-6 shadow-md max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-natural-dark-text">ניקוד מצטבר:</span>
          <span className="bg-natural-cream border border-natural-border text-natural-header px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1">
            <Star size={14} className="fill-natural-accent text-natural-accent" />
            <span>{score} נקודות</span>
          </span>
        </div>

        {isCompleted ? (
          <div className="space-y-4 animate-fade-in">
            <div className="text-natural-header font-extrabold text-lg flex items-center justify-center gap-1.5">
              <Sparkles size={20} className="text-natural-accent" />
              <span>כל הכבוד! התאמה מושלמת! 🎉</span>
            </div>
            <p className="text-natural-medium-text text-sm">
              שלטתם בהצלחה בסט התרופות הנוכחי. מוכנים לנסות סט ממוין מחדש?
            </p>
            <button
              onClick={() => initGame()}
              className="w-full bg-natural-header border border-natural-header text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow"
              id="btn-match-play-again"
            >
              <RefreshCw size={16} />
              <span>שחקו שוב עם תרופות חדשות</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => initGame()}
            className="w-full bg-natural-callout border border-natural-border text-natural-dark-text py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-1.5 hover:bg-natural-bg transition-all"
            id="btn-match-reset"
          >
            <RefreshCw size={14} />
            <span>ערבב מחדש</span>
          </button>
        )}
      </div>
    </div>
  );
}
