import React, { useState } from "react";
import { DEFINITIONS } from "../data";
import { Definition } from "../types";
import { HelpCircle, Info, ShieldAlert, Layers, Flame, FileText, Activity } from "lucide-react";

export default function VisualDefinitions() {
  const [selectedDef, setSelectedDef] = useState<Definition | null>(DEFINITIONS[0]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-natural-border max-w-5xl mx-auto" id="visual-definitions">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-natural-dark-text flex items-center justify-center gap-2">
          <span>📚 מושגי יסוד ומידות בעולם ההחייאה</span>
        </h2>
        <p className="text-natural-medium-text mt-1 text-sm md:text-base">
          לחצו על כל מושג כדי לראות את ההסבר הגרפי והמדריכים המעשיים לשאיבה נכונה
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Grid of concepts */}
        <div className="lg:col-span-5 space-y-3">
          {DEFINITIONS.map((def) => {
            const isSelected = selectedDef?.term === def.term;
            return (
              <button
                key={def.term}
                onClick={() => setSelectedDef(def)}
                className={`w-full text-right p-4 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                  isSelected
                    ? "bg-natural-header border-natural-header text-white shadow-md transform -translate-x-1"
                    : "bg-natural-callout border-natural-border text-natural-dark-text hover:bg-natural-cream"
                }`}
                id={`btn-def-${def.term.replace(/\s+/g, "-")}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isSelected ? "bg-natural-header/40 text-natural-accent" : "bg-white border border-natural-border/40 text-natural-medium-text"}`}>
                    {def.visualIcon === "vial" && <Layers size={20} />}
                    {def.visualIcon === "glass" && <Flame size={20} />}
                    {def.visualIcon === "droplets" && <Activity size={20} />}
                    {def.visualIcon === "scale" && <Info size={20} />}
                    {def.visualIcon === "weight" && <HelpCircle size={20} />}
                    {def.visualIcon === "activity" && <FileText size={20} />}
                  </div>
                  <div>
                    <div className="font-bold text-base">{def.term}</div>
                    {def.translation && (
                      <div className={`text-xs ${isSelected ? "text-natural-cream/80" : "text-natural-light-text"} font-mono`}>
                        {def.translation}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs font-medium">
                  {isSelected ? "📖 פתוח" : "לחצו לקריאה"}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed graphic and tips */}
        <div className="lg:col-span-7 bg-natural-cream rounded-2xl p-6 border border-natural-border flex flex-col justify-between">
          {selectedDef ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-start justify-between border-b border-natural-border/40 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-natural-dark-text">{selectedDef.term}</h3>
                  {selectedDef.translation && (
                    <span className="text-sm font-mono text-natural-medium-text bg-natural-callout px-2 py-0.5 rounded">
                      {selectedDef.translation}
                    </span>
                  )}
                </div>
                <div className="bg-natural-header text-natural-cream px-3 py-1 rounded-full text-xs font-mono">
                  {selectedDef.visualIcon.toUpperCase()}
                </div>
              </div>

              {/* Graphic Representation */}
              <div className="flex justify-center py-4 bg-white rounded-xl border border-natural-border shadow-inner relative overflow-hidden">
                <div className="absolute top-2 right-2 flex items-center gap-1 text-[11px] text-natural-light-text font-mono">
                  <span className="w-2 h-2 rounded-full bg-natural-accent animate-ping"></span>
                  <span>ייצוג חזותי קליני</span>
                </div>

                {selectedDef.visualIcon === "vial" && (
                  <div className="flex flex-col items-center py-4">
                    {/* Bottle/Vial drawing */}
                    <div className="relative w-20 h-32 bg-natural-cream border-4 border-natural-border rounded-b-xl rounded-t-lg flex flex-col items-center justify-between shadow-md">
                      {/* Rubber seal top */}
                      <div className="w-12 h-4 bg-natural-medium-text rounded-t border-b-2 border-natural-border flex justify-center items-center">
                        <div className="w-6 h-1 bg-rose-500 rounded-full"></div>
                      </div>
                      {/* Neck */}
                      <div className="w-8 h-2 bg-natural-border"></div>
                      {/* Liquid inside */}
                      <div className="w-full h-16 bg-natural-accent/20 border-t border-natural-accent/40 mt-auto flex items-center justify-center rounded-b-lg">
                        <span className="text-[10px] font-bold text-natural-header font-mono">VACUUM</span>
                      </div>
                    </div>
                    {/* Pink Needle representation */}
                    <div className="mt-4 flex items-center gap-2 text-xs text-natural-secondary font-bold bg-natural-bg px-3 py-1 rounded-lg border border-natural-secondary/40">
                      <span className="w-3 h-3 bg-pink-400 rounded-full inline-block border border-pink-600"></span>
                      <span>חובה להשתמש במחט ורודה (פילטר)!</span>
                    </div>
                  </div>
                )}

                {selectedDef.visualIcon === "glass" && (
                  <div className="flex flex-col items-center py-4">
                    {/* Ampoule drawing */}
                    <div className="relative w-16 h-36 flex flex-col items-center">
                      {/* Tip */}
                      <div className="w-6 h-10 bg-amber-50 border-2 border-amber-500 rounded-t-full relative">
                        <div className="absolute bottom-2 left-1.5 w-2 h-2 rounded-full bg-red-600"></div> {/* Cut line dot */}
                      </div>
                      {/* Snapping neck */}
                      <div className="w-4 h-3 bg-amber-50 border-x-2 border-amber-500 border-y border-amber-600/50"></div>
                      {/* Body */}
                      <div className="w-14 h-20 bg-amber-50 border-2 border-amber-500 rounded-b-2xl flex items-center justify-center shadow-md">
                        <span className="text-[10px] font-bold text-amber-700 font-mono">1 mg / 1cc</span>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-amber-700 font-bold bg-amber-50/50 px-3 py-1 rounded-lg border border-amber-200">
                      <span>שבירה בטוחה בנקודת הסימון האדומה 🔴</span>
                    </div>
                  </div>
                )}

                {selectedDef.visualIcon === "droplets" && (
                  <div className="flex flex-col items-center py-4 px-6 w-full">
                    {/* Syringe/Volume drawing */}
                    <div className="w-full max-w-xs flex items-center gap-1 bg-natural-bg p-3 rounded-lg border border-natural-border">
                      <span className="text-xs font-bold text-natural-dark-text">1 סמ״ק (cc)</span>
                      <div className="flex-1 h-6 bg-natural-callout rounded relative overflow-hidden flex items-center px-1 border border-natural-border">
                        <div className="h-full bg-natural-header/80 w-full rounded-l transition-all duration-500"></div>
                        <span className="absolute left-2 text-[10px] font-mono font-bold text-natural-dark-text">1.0 mL (נפח זהה לחלוטין)</span>
                      </div>
                    </div>
                    <p className="text-xs text-natural-medium-text mt-3 text-center">
                      במדע וברפואה דחופה, סמ״ק (cc) ומיליליטר (ml) הן יחידות נפח זהות לחלוטין.
                    </p>
                  </div>
                )}

                {selectedDef.visualIcon === "scale" && (
                  <div className="flex flex-col items-center py-4 px-6 w-full">
                    {/* Unit conversions */}
                    <div className="grid grid-cols-3 gap-4 w-full text-center">
                      <div className="bg-natural-callout p-2 rounded border border-natural-border shadow-sm">
                        <div className="font-mono font-bold text-natural-dark-text text-sm">1 גרם (gr)</div>
                        <div className="text-[10px] text-natural-light-text mt-1">יחידת בסיס</div>
                      </div>
                      <div className="bg-natural-bg p-2 rounded border border-natural-secondary/40 shadow-sm flex flex-col justify-center">
                        <div className="font-mono font-bold text-natural-secondary text-sm">1,000 מ״ג</div>
                        <div className="text-[10px] text-natural-light-text mt-1">= 1 גרם</div>
                      </div>
                      <div className="bg-natural-cream p-2 rounded border border-natural-accent shadow-sm flex flex-col justify-center">
                        <div className="font-mono font-bold text-natural-header text-sm">1,000,000 מק״ג</div>
                        <div className="text-[10px] text-natural-light-text mt-1">= 1 גרם</div>
                      </div>
                    </div>
                    <p className="text-xs text-natural-medium-text mt-3 text-center">
                      מזער שגיאות מינון חמורות! זכור תמיד: <strong className="text-natural-dark-text">1 מ״ג (mg) = 1,000 מיקרוגרם (mcg)</strong>.
                    </p>
                  </div>
                )}

                {selectedDef.visualIcon === "weight" && (
                  <div className="flex flex-col items-center py-4 px-6 w-full">
                    {/* Weight warning */}
                    <div className="bg-natural-bg p-4 rounded-xl border border-natural-secondary/40 flex items-center gap-3 w-full max-w-sm">
                      <ShieldAlert className="text-natural-secondary flex-shrink-0 animate-bounce" size={24} />
                      <div className="text-right">
                        <div className="font-bold text-natural-dark-text text-sm">הבדל קריטי: מגנזיום!</div>
                        <div className="text-xs text-natural-medium-text mt-1">
                          מגנזיום מעגלת החייאה מגיע בגרמים (5 גרם בתוך 10 סמ״ק)! אל תטעה לחשוב שמדובר במילגרמים!
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedDef.visualIcon === "activity" && (
                  <div className="flex flex-col items-center py-4 px-6 w-full">
                    {/* Biological Activity */}
                    <div className="bg-natural-callout p-3 rounded-lg border border-natural-border text-center w-full max-w-sm">
                      <div className="text-sm font-bold text-natural-dark-text mb-1">מדד לפעילות ביולוגית ולא משקל יבש</div>
                      <p className="text-xs text-natural-medium-text leading-relaxed">
                        יחידות בינלאומיות (iu) נקבעות לפי האפקט הביולוגי המבוקש של החומר, ולא לפי המשקל הפיזי של התרופה, כדי ליצור סטנדרטיזציה עולמית.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Text Meaning */}
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-natural-dark-text text-sm">הגדרה קלינית:</h4>
                  <p className="text-natural-medium-text text-sm md:text-base leading-relaxed bg-white p-3 rounded-xl border border-natural-border/30">
                    {selectedDef.meaning}
                  </p>
                </div>

                {selectedDef.details && (
                  <div className="bg-natural-header text-natural-cream p-4 rounded-xl border border-natural-header/30">
                    <h4 className="font-bold text-natural-accent text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Info size={14} />
                      <span>דגשים קליניים ושיטות עבודה מעשיות</span>
                    </h4>
                    <p className="text-natural-cream/90 text-xs md:text-sm leading-relaxed">
                      {selectedDef.details}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-natural-light-text py-12">
              <Layers size={40} className="mb-2 text-natural-accent" />
              <span>בחר מושג מהרשימה כדי לצפות בפרטים</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
