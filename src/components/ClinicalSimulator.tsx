import React, { useState } from "react";
import { CLINICAL_SCENARIOS, MEDICATIONS } from "../data";
import { ClinicalScenario } from "../types";
import { Sparkles, HeartPulse, ShieldAlert, Check, X, RefreshCw, Activity, Zap, ChevronLeft } from "lucide-react";
import { generateScenario } from "../services/gemini";

export default function ClinicalSimulator() {
  const [index, setIndex] = useState<number>(0);
  const [selectedDrugId, setSelectedDrugId] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [solvedScenarios, setSolvedScenarios] = useState<string[]>([]); // Scenario ids

  // AI Scenario States
  const [isAiMode, setIsAiMode] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiScenario, setAiScenario] = useState<{
    scenario: string;
    correctDrug: string;
    explanation: string;
    options: string[];
  } | null>(null);
  const [aiSelectedDrug, setAiSelectedDrug] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Active Static Scenario
  const activeScen: ClinicalScenario = CLINICAL_SCENARIOS[index];

  const handleStaticSelect = (drugId: string) => {
    if (selectedDrugId) return; // Prevent double selecting
    setSelectedDrugId(drugId);

    const isCorrect = drugId === activeScen.correctDrugId;
    if (isCorrect) {
      setScore(s => s + 15);
      setSolvedScenarios(prev => [...prev, activeScen.id]);
    }
  };

  const handleNextStatic = () => {
    setSelectedDrugId(null);
    setIndex(prev => (prev + 1) % CLINICAL_SCENARIOS.length);
  };

  const handleAiSelect = (drugName: string) => {
    if (aiSelectedDrug || !aiScenario) return;
    setAiSelectedDrug(drugName);

    const isCorrect = drugName === aiScenario.correctDrug;
    if (isCorrect) {
      setScore(s => s + 25); // Higher score reward for AI cases!
    }
  };

  const generateNewAiScenario = async () => {
    setAiLoading(true);
    setAiError(null);
    setAiSelectedDrug(null);
    setAiScenario(null);

    try {
      const data = await generateScenario();

      // Generate options containing correct drug + 3 random other drugs
      const correctDrugName = data.correctDrug;
      const otherDrugNames = MEDICATIONS
        .map(m => m.name)
        .filter(name => name !== correctDrugName)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const options = [correctDrugName, ...otherDrugNames].sort(() => 0.5 - Math.random());

      setAiScenario({
        scenario: data.scenario,
        correctDrug: correctDrugName,
        explanation: data.explanation || "הסבר קליני מפורט",
        options
      });
    } catch (err: any) {
      console.error(err);
      setAiError("לא הצלחנו ליצור תרחיש AI כרגע. אנא ודאו שמפתח ה-Gemini מוגדר כראוי או שהרשת זמינה.");
    } finally {
      setAiLoading(false);
    }
  };

  const toggleMode = (ai: boolean) => {
    setIsAiMode(ai);
    if (ai && !aiScenario) {
      generateNewAiScenario();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4" id="clinical-simulator">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-natural-dark-text flex items-center justify-center gap-2">
          <HeartPulse className="text-natural-secondary animate-pulse" size={28} />
          <span>סימולטור מקרי חירום קליניים</span>
        </h2>
        <p className="text-natural-medium-text mt-1 text-sm md:text-base">
          התנסו בפתרון מקרי חירום אמיתיים מהשטח! בחרו בתרופה ובמינון המתאים להצלת חיי המטופל.
        </p>
      </div>

      {/* Simulator Mode switcher */}
      <div className="flex justify-center gap-3 mb-6">
        <button
          onClick={() => toggleMode(false)}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold border transition-all ${
            !isAiMode
              ? "bg-natural-header border-natural-header text-white shadow"
              : "bg-white border-natural-border text-natural-medium-text hover:bg-natural-bg"
          }`}
          id="btn-sim-static"
        >
          🗂️ תרחישי אימון מובנים ({CLINICAL_SCENARIOS.length})
        </button>
        <button
          onClick={() => toggleMode(true)}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold border transition-all flex items-center gap-1.5 ${
            isAiMode
              ? "bg-natural-header border-natural-header text-white shadow-md"
              : "bg-white border-natural-border text-natural-header hover:bg-natural-bg"
          }`}
          id="btn-sim-ai"
        >
          <Sparkles size={14} className="text-natural-accent" />
          <span>מחולל תרחישי AI קליניים</span>
        </button>
      </div>

      {/* Main Simulation Stage */}
      <div className="bg-natural-header text-white rounded-3xl p-6 md:p-8 shadow-md border border-natural-header/30 relative overflow-hidden">
        {/* Background visual cues */}
        <div className="absolute top-4 left-4 flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-[10px] md:text-xs font-mono">
          <Activity className="text-natural-accent animate-pulse" size={14} />
          <span>שליטה קלינית פעילה</span>
        </div>

        {/* Score indicator */}
        <div className="absolute bottom-4 left-4 text-xs text-natural-cream bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
          <span>ניקוד סימולטור: </span>
          <strong className="text-natural-secondary font-extrabold text-sm">{score}</strong>
        </div>

        {!isAiMode ? (
          /* Static Mode Scenario */
          <div className="space-y-6 animate-fade-in" key={activeScen.id}>
            {/* Scenario Header info */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs font-bold text-natural-cream/90 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                תרחיש {index + 1} מתוך {CLINICAL_SCENARIOS.length}
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                activeScen.difficulty === "קל" 
                  ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300" 
                  : activeScen.difficulty === "בינוני" 
                    ? "bg-amber-500/20 border-amber-500/30 text-amber-300" 
                    : "bg-rose-500/20 border-rose-500/30 text-rose-300"
              }`}>
                רמת קושי: {activeScen.difficulty}
              </span>
            </div>

            {/* Emergency Case Text Box */}
            <div className="bg-black/15 p-5 rounded-2xl border border-white/5 shadow-inner">
              <p className="text-base md:text-lg font-bold leading-relaxed text-right text-natural-cream">
                {activeScen.scenario}
              </p>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {activeScen.options.map((opt) => {
                const med = MEDICATIONS.find(m => m.name === opt);
                const medId = med?.id || "";
                const isSelected = selectedDrugId === medId;
                const isCorrect = medId === activeScen.correctDrugId;
                const hasSelected = selectedDrugId !== null;

                let btnStyle = "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10 text-natural-cream";
                if (hasSelected) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold";
                  } else if (isSelected) {
                    btnStyle = "bg-rose-500/20 border-rose-400 text-rose-200 font-bold";
                  } else {
                    btnStyle = "bg-white/5 border-white/5 text-white/30 opacity-40";
                  }
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleStaticSelect(medId)}
                    disabled={hasSelected}
                    className={`w-full text-right p-4 rounded-xl border-2 transition-all duration-150 flex justify-between items-center text-sm md:text-base ${btnStyle}`}
                    id={`sim-opt-${medId}`}
                  >
                    <span>{opt} {med ? `(${med.presentation})` : ""}</span>
                    {hasSelected && isCorrect && <Check size={18} className="text-emerald-400 flex-shrink-0" />}
                    {hasSelected && isSelected && !isCorrect && <X size={18} className="text-rose-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Clinical Feedback box */}
            {selectedDrugId && (
              <div className="bg-black/15 border border-white/10 p-5 rounded-2xl animate-fade-in space-y-3">
                <div className="flex items-center gap-2">
                  {selectedDrugId === activeScen.correctDrugId ? (
                    <span className="text-natural-accent font-extrabold flex items-center gap-1 bg-natural-accent/15 border border-natural-accent/25 px-3 py-1 rounded-full text-xs">
                      ✓ מענה נכון ומציל חיים! +15 נקודות
                    </span>
                  ) : (
                    <span className="text-rose-300 font-extrabold flex items-center gap-1 bg-rose-500/20 border border-rose-500/30 px-3 py-1 rounded-full text-xs">
                      ✗ שגיאה בבחירה קלינית!
                    </span>
                  )}
                </div>
                <p className="text-natural-cream/90 text-xs md:text-sm leading-relaxed">
                  {activeScen.explanation}
                </p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNextStatic}
                    className="bg-white text-natural-header font-bold px-4 py-2 rounded-xl text-xs md:text-sm flex items-center gap-1 hover:opacity-90 transition-all shadow"
                    id="btn-sim-next"
                  >
                    <span>הבא בתור</span>
                    <ChevronLeft size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* AI Powered Dynamic Scenario */
          <div className="space-y-6 animate-fade-in">
            {/* Header info */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-natural-secondary bg-natural-secondary/15 px-2.5 py-1 rounded-lg border border-natural-secondary/25 flex items-center gap-1">
                <Sparkles size={12} className="animate-pulse" />
                <span>תרחיש מחולל AI דינמי</span>
              </span>
              <button
                onClick={generateNewAiScenario}
                disabled={aiLoading}
                className="text-xs text-natural-cream/80 hover:text-white flex items-center gap-1 bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl transition-all"
                id="btn-sim-regenerate"
              >
                <RefreshCw size={12} className={aiLoading ? "animate-spin" : ""} />
                <span>צור מקרה אחר</span>
              </button>
            </div>

            {aiLoading && (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 border-4 border-natural-accent border-t-transparent rounded-full animate-spin"></div>
                <p className="text-natural-cream/95 text-sm font-bold">
                  הבינה המלאכותית מחוללת מקרה חירום רפואי ייחודי...
                </p>
              </div>
            )}

            {aiError && (
              <div className="p-5 bg-rose-950/40 border border-rose-500/30 rounded-2xl flex items-start gap-3">
                <ShieldAlert className="text-rose-400 flex-shrink-0 mt-0.5" size={20} />
                <div className="text-right">
                  <h4 className="font-bold text-rose-300 text-sm">שגיאה במחולל ה-AI</h4>
                  <p className="text-xs text-rose-400 mt-1 leading-relaxed">{aiError}</p>
                </div>
              </div>
            )}

            {aiScenario && (
              <div className="space-y-6 animate-fade-in">
                {/* Emergency Case Text Box */}
                <div className="bg-black/15 p-5 rounded-2xl border border-white/5 shadow-inner">
                  <p className="text-base md:text-lg font-bold leading-relaxed text-right text-natural-cream">
                    {aiScenario.scenario}
                  </p>
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {aiScenario.options.map((opt) => {
                    const isSelected = aiSelectedDrug === opt;
                    const isCorrect = opt === aiScenario.correctDrug;
                    const hasSelected = aiSelectedDrug !== null;

                    let btnStyle = "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10 text-natural-cream";
                    if (hasSelected) {
                      if (isCorrect) {
                        btnStyle = "bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold";
                      } else if (isSelected) {
                        btnStyle = "bg-rose-500/20 border-rose-400 text-rose-200 font-bold";
                      } else {
                        btnStyle = "bg-white/5 border-white/5 text-white/30 opacity-40";
                      }
                    }

                    return (
                      <button
                        key={opt}
                        onClick={() => handleAiSelect(opt)}
                        disabled={hasSelected}
                        className={`w-full text-right p-4 rounded-xl border-2 transition-all duration-150 flex justify-between items-center text-sm md:text-base ${btnStyle}`}
                        id={`sim-ai-opt-${opt.replace(/\s+/g, "-")}`}
                      >
                        <span>{opt}</span>
                        {hasSelected && isCorrect && <Check size={18} className="text-emerald-400 flex-shrink-0" />}
                        {hasSelected && isSelected && !isCorrect && <X size={18} className="text-rose-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* AI Feedback */}
                {aiSelectedDrug && (
                  <div className="bg-black/15 border border-white/10 p-5 rounded-2xl animate-fade-in space-y-3">
                    <div className="flex items-center gap-2">
                      {aiSelectedDrug === aiScenario.correctDrug ? (
                        <span className="text-natural-accent font-extrabold flex items-center gap-1 bg-natural-accent/15 border border-natural-accent/25 px-3 py-1 rounded-full text-xs">
                          ✓ ביצוע מעולה ומקצועי! +25 נקודות
                        </span>
                      ) : (
                        <span className="text-rose-300 font-extrabold flex items-center gap-1 bg-rose-500/20 border border-rose-500/30 px-3 py-1 rounded-full text-xs">
                          ✗ שגיאה רפואית! התרופה המתאימה היא: {aiScenario.correctDrug}
                        </span>
                      )}
                    </div>
                    <p className="text-natural-cream/90 text-xs md:text-sm leading-relaxed">
                      {aiScenario.explanation}
                    </p>
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={generateNewAiScenario}
                        className="bg-white text-natural-header font-bold px-4 py-2 rounded-xl text-xs md:text-sm flex items-center gap-1.5 hover:opacity-90 transition-all shadow"
                        id="btn-sim-ai-next"
                      >
                        <RefreshCw size={14} />
                        <span>ייצר מקרה חירום נוסף</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
