import React, { useState } from "react";
import { MEDICATIONS } from "../data";
import { Medication } from "../types";
import { 
  Heart, 
  Activity, 
  Shield, 
  Flame, 
  Droplet, 
  Zap, 
  Sparkles, 
  CornerDownLeft,
  ChevronLeft,
  BriefcaseMedical,
  Brain,
  Wind
} from "lucide-react";

interface Drawer {
  name: string;
  color: string;
  icon: string;
  category: string;
  meds: Medication[];
}

export default function MedicationCart() {
  const [selectedMed, setSelectedMed] = useState<Medication | null>(MEDICATIONS[0]);
  const [activeDrawer, setActiveDrawer] = useState<string>("all");

  const DRAWERS: Drawer[] = [
    {
      name: "מערכת סימפטטית והחייאה",
      color: "border-natural-secondary/60 bg-natural-cream/60 hover:bg-natural-cream",
      icon: "flame",
      category: "sympathetic",
      meds: MEDICATIONS.filter(m => m.system === "sympathetic")
    },
    {
      name: "מערכת פאראסימפטטית ונשימה",
      color: "border-natural-accent/60 bg-natural-bg hover:bg-natural-cream",
      icon: "shield",
      category: "parasympathetic",
      meds: MEDICATIONS.filter(m => m.system === "parasympathetic")
    },
    {
      name: "קצב לב והולכה חשמלית",
      color: "border-natural-secondary/60 bg-natural-bg hover:bg-natural-cream",
      icon: "heart",
      category: "cardiac",
      meds: MEDICATIONS.filter(m => m.system === "cardiac")
    },
    {
      name: "חומציות, נוזלים ואלקטרוליטים",
      color: "border-natural-border bg-natural-bg hover:bg-natural-cream",
      icon: "droplet",
      category: "electrolyte",
      meds: MEDICATIONS.filter(m => m.system === "acid-base" || m.system === "muscular")
    },
    {
      name: "סטרואידים ושיכוך כאבים",
      color: "border-natural-accent/60 bg-natural-cream hover:bg-natural-cream/80",
      icon: "zap",
      category: "other",
      meds: MEDICATIONS.filter(m => m.system === "steroid" || m.system === "opioid")
    }
  ];

  const filteredMeds = activeDrawer === "all" 
    ? MEDICATIONS 
    : activeDrawer === "electrolyte"
      ? MEDICATIONS.filter(m => m.system === "acid-base" || m.system === "muscular")
      : activeDrawer === "other"
        ? MEDICATIONS.filter(m => m.system === "steroid" || m.system === "opioid")
        : MEDICATIONS.filter(m => m.system === activeDrawer);

  return (
    <div className="max-w-7xl mx-auto px-4" id="medication-cart">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-natural-dark-text tracking-tight flex items-center justify-center gap-2">
          <BriefcaseMedical className="text-natural-header" size={32} />
          <span>עגלת החייאה אינטראקטיבית</span>
        </h2>
        <p className="text-natural-medium-text mt-2 text-base max-w-2xl mx-auto">
          חוקרים את מגירות עגלת ההחייאה! לחצו על מגירה כדי לסנן תרופות, ובחרו תרופה כדי לחקור את מנגנון הפעולה וההתוויות עם ייצוג חזותי של השפעתה בגוף.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Crash Cart Drawers & Drug List */}
        <div className="xl:col-span-5 space-y-6">
          {/* Virtual Crash Cart Drawers Visual Representation */}
          <div className="bg-natural-callout border-4 border-natural-border rounded-3xl p-4 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-natural-header"></div>
            <div className="text-center pb-3 border-b-2 border-natural-border">
              <span className="font-mono text-xs font-bold text-natural-medium-text">CRASH CART DRAWER SYSTEM</span>
            </div>

            <div className="space-y-3 mt-4">
              <button
                onClick={() => setActiveDrawer("all")}
                className={`w-full text-right p-3 rounded-xl border-2 transition-all duration-200 font-bold text-sm md:text-base flex items-center justify-between ${
                  activeDrawer === "all"
                    ? "border-natural-header bg-natural-header text-natural-header-text shadow"
                    : "border-natural-border bg-white hover:bg-natural-bg text-natural-dark-text"
                }`}
                id="btn-drawer-all"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-natural-accent"></span>
                  <span>כל התרופות בעגלה (11 תרופות)</span>
                </div>
                <ChevronLeft size={16} />
              </button>

              {DRAWERS.map((drawer) => {
                const isSelected = activeDrawer === drawer.category;
                return (
                  <button
                    key={drawer.category}
                    onClick={() => setActiveDrawer(drawer.category)}
                    className={`w-full text-right p-3 rounded-xl border-2 transition-all duration-200 font-bold text-xs md:text-sm flex items-center justify-between ${
                      isSelected
                        ? "border-natural-header bg-natural-header text-natural-header-text shadow-md transform -translate-x-1"
                        : drawer.color + " text-natural-dark-text"
                    }`}
                    id={`btn-drawer-${drawer.category}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${isSelected ? "bg-natural-header/30 text-natural-accent" : "bg-white border border-natural-border"}`}>
                        {drawer.icon === "flame" && <Flame size={16} className="text-natural-secondary" />}
                        {drawer.icon === "shield" && <Shield size={16} className="text-natural-accent" />}
                        {drawer.icon === "heart" && <Heart size={16} className="text-natural-secondary" />}
                        {drawer.icon === "droplet" && <Droplet size={16} className="text-natural-accent" />}
                        {drawer.icon === "zap" && <Zap size={16} className="text-natural-secondary" />}
                      </div>
                      <span>{drawer.name}</span>
                    </div>
                    <span className="font-mono text-xs opacity-80 bg-white/40 px-2 py-0.5 rounded-full">
                      {drawer.meds.length} תרופות
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* List of filtered medications */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 bg-natural-callout/50 p-4 rounded-2xl border border-natural-border">
            <span className="text-xs font-bold text-natural-light-text block mb-2">בחר תרופה למפרט מלא:</span>
            {filteredMeds.map((med) => {
              const isSelected = selectedMed?.id === med.id;
              return (
                <button
                  key={med.id}
                  onClick={() => setSelectedMed(med)}
                  className={`w-full text-right p-3 rounded-xl border transition-all duration-150 flex items-center justify-between ${
                    isSelected
                      ? "bg-natural-header border-natural-header text-white shadow-md transform -translate-x-1"
                      : "bg-white border-natural-border hover:bg-natural-bg text-natural-dark-text"
                  }`}
                  id={`btn-med-${med.id}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full bg-natural-accent shadow-sm`}></span>
                    <div>
                      <div className="font-bold text-sm md:text-base">{med.name}</div>
                      <div className={`text-xs ${isSelected ? "text-natural-cream/80" : "text-natural-light-text"} font-mono`}>
                        {med.englishName} | {med.presentation}
                      </div>
                    </div>
                  </div>
                  <CornerDownLeft size={14} className={isSelected ? "text-natural-accent" : "text-natural-light-text"} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Medication Sheet / Graphic Representation */}
        <div className="xl:col-span-7 bg-white rounded-3xl p-6 border border-natural-border shadow-md space-y-6">
          {selectedMed ? (
            <div className="space-y-6 animate-fade-in" key={selectedMed.id}>
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-natural-border/40 pb-4 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-3xl font-extrabold text-natural-dark-text">{selectedMed.name}</h3>
                    <span className="text-sm font-mono text-natural-medium-text bg-natural-callout px-2 py-0.5 rounded-md self-center">
                      {selectedMed.englishName}
                    </span>
                  </div>
                  <p className="text-natural-light-text text-xs mt-1 font-mono">ID: {selectedMed.id.toUpperCase()}</p>
                </div>
                <div className={`px-4 py-2 rounded-2xl bg-natural-cream border border-natural-border text-natural-medium-text text-center`}>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-natural-light-text">צורת הופעה</div>
                  <div className="font-mono font-extrabold text-base text-natural-dark-text">{selectedMed.presentation}</div>
                </div>
              </div>

              {/* Graphic Representation Stage */}
              <div className="bg-natural-header rounded-2xl p-6 text-natural-cream relative overflow-hidden min-h-[220px] flex flex-col md:flex-row items-center justify-between shadow-md border border-natural-header/30">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#A7C080_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>

                <div className="relative z-10 space-y-4 max-w-xs text-right md:order-2">
                  <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-[11px] font-bold text-natural-secondary">
                    <Sparkles size={12} />
                    <span>הדמיה קלינית ומנגנון השפעה</span>
                  </div>
                  <h4 className="text-lg font-bold text-natural-cream">איך {selectedMed.name} פועל?</h4>
                  <p className="text-natural-cream/90 text-xs md:text-sm leading-relaxed">
                    {selectedMed.mechanism}
                  </p>
                </div>

                {/* Animated Graphic View */}
                <div className="relative z-10 w-44 h-44 bg-natural-dark-text/90 rounded-full border border-natural-border/20 flex items-center justify-center overflow-hidden shadow-inner md:order-1 mt-6 md:mt-0">
                  {selectedMed.system === "sympathetic" && (
                    <div className="flex flex-col items-center animate-pulse">
                      <Heart className="text-rose-400 fill-rose-400" size={54} />
                      {/* Sympathetic Sparkles */}
                      <div className="absolute w-full h-full flex justify-between items-center px-4">
                        <Zap className="text-amber-300 animate-bounce" size={20} />
                        <Zap className="text-rose-300 animate-bounce delay-100" size={20} />
                      </div>
                      <span className="text-[9px] font-mono font-bold tracking-widest text-rose-300 mt-2">BETA-1 & ALPHA-1</span>
                    </div>
                  )}

                  {selectedMed.system === "parasympathetic" && (
                    <div className="flex flex-col items-center">
                      <Shield className="text-sky-300 animate-bounce" size={54} />
                      <Heart className="text-natural-light-text absolute opacity-20" size={80} />
                      <div className="w-10 h-1 bg-sky-300/30 rounded-full mt-2 animate-ping"></div>
                      <span className="text-[9px] font-mono font-bold text-sky-300 tracking-wider">ANTICHOLINERGIC</span>
                    </div>
                  )}

                  {selectedMed.system === "cardiac" && (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <Activity className="text-emerald-300 animate-pulse w-32 h-16" />
                      {/* Cardiac impulse dots */}
                      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-400 animate-ping"></div>
                      <span className="text-[9px] font-mono font-bold text-emerald-300 tracking-wider mt-1">AV-NODE HENCE BLOCK</span>
                    </div>
                  )}

                  {selectedMed.system === "acid-base" && (
                    <div className="flex flex-col items-center">
                      {/* Chemical Flask pH */}
                      <div className="w-12 h-20 bg-teal-500/20 border-2 border-teal-300 rounded-b-xl rounded-t flex flex-col items-center justify-end p-1 relative">
                        <div className="w-full h-8 bg-teal-300/70 rounded-b-lg"></div>
                      </div>
                      <span className="text-[14px] font-extrabold text-teal-300 mt-2 font-mono">pH ➔ 7.4+</span>
                      <span className="text-[9px] font-mono text-teal-300">ALKALINIZATION</span>
                    </div>
                  )}

                  {selectedMed.system === "muscular" && (
                    <div className="flex flex-col items-center">
                      {/* Relaxing cells or wave */}
                      <div className="flex gap-1 items-center">
                        <span className="w-3 h-10 bg-orange-300 rounded-full animate-pulse"></span>
                        <span className="w-3 h-12 bg-orange-400 rounded-full animate-pulse delay-75"></span>
                        <span className="w-3 h-10 bg-orange-300 rounded-full animate-pulse delay-150"></span>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-orange-300 tracking-widest mt-2">MUSCLE RELAX / Mg2+</span>
                    </div>
                  )}

                  {selectedMed.system === "opioid" && (
                    <div className="flex flex-col items-center">
                      <Brain className="text-purple-300 animate-bounce" size={54} />
                      <span className="text-[9px] font-mono font-bold text-purple-300 tracking-widest mt-2">OPIOID RECEPTORS</span>
                    </div>
                  )}

                  {selectedMed.system === "steroid" && (
                    <div className="flex flex-col items-center">
                      <Wind className="text-violet-300 animate-pulse" size={54} />
                      <span className="text-[9px] font-mono font-bold text-violet-300 tracking-widest mt-2">ANTI-INFLAMMATORY</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Details & Indications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Indications Checklist */}
                <div className="bg-natural-callout rounded-2xl p-5 border border-natural-border">
                  <h4 className="font-extrabold text-natural-dark-text text-base mb-3 flex items-center gap-1.5">
                    <span className="text-natural-accent">📋</span>
                    <span>התוויות לשימוש (Indications)</span>
                  </h4>
                  <ul className="space-y-2.5">
                    {selectedMed.indications.map((ind, i) => (
                      <li key={i} className="flex items-start gap-2 text-natural-medium-text text-sm md:text-base">
                        <span className="bg-natural-accent/25 text-natural-header p-0.5 rounded-full text-[10px] mt-1 font-bold">✓</span>
                        <span className="font-semibold">{ind}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Practical Clinical Facts */}
                <div className="bg-natural-callout rounded-2xl p-5 border border-natural-border space-y-3">
                  <h4 className="font-extrabold text-natural-dark-text text-base flex items-center gap-1.5">
                    <span className="text-natural-secondary">💡</span>
                    <span>דגשים קליניים מהירים</span>
                  </h4>
                  <div className="space-y-2.5 text-xs md:text-sm text-natural-medium-text">
                    <div className="p-3 bg-white rounded-xl border border-natural-border/30">
                      <strong>סוג התקן:</strong> {selectedMed.visualType === "ampoule" ? "אמפולת זכוכית שבירה" : selectedMed.visualType === "vial" ? "בקבוקון פלקון עם וואקום" : selectedMed.visualType === "spray" ? "תרסיס אינהלציה" : "סוכריית מציצה מיוחדת"}
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-natural-border/30">
                      <strong>השפעה מערכתית:</strong> {selectedMed.system === "sympathetic" ? "עירור סימפטטי (דופק, לחץ דם, הרחבת סימפונות)" : selectedMed.system === "parasympathetic" ? "חסימת השפעת הוואגוס (האצה וייבוש הפרשות)" : selectedMed.system === "cardiac" ? "ייצוב והאטת מקצב חשמלי בלב" : selectedMed.system === "acid-base" ? "נטרול חומציות בדם" : selectedMed.system === "muscular" ? "הרפיית שריר חלק וכיווץ" : selectedMed.system === "opioid" ? "חסימת קולטני כאב במערכת העצבים" : "הפחתת דלקת ובצקת בריריות"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-natural-light-text py-12">
              <BriefcaseMedical size={54} className="mb-2 text-natural-accent" />
              <span>בחר תרופה מהרשימה כדי לצפות בדף המפרט הקליני</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
