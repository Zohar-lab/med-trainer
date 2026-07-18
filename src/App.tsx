import React, { useState } from "react";
import MedicationCart from "./components/MedicationCart";
import Flashcards from "./components/Flashcards";
import MatchingGame from "./components/MatchingGame";
import ClinicalSimulator from "./components/ClinicalSimulator";
import MasteryQuiz from "./components/MasteryQuiz";
import VisualDefinitions from "./components/VisualDefinitions";
import AITutor from "./components/AITutor";
import { 
  BriefcaseMedical, 
  Layers, 
  HelpCircle, 
  Trophy, 
  HeartPulse, 
  Brain, 
  GitMerge, 
  Stethoscope
} from "lucide-react";

type Tab = "cart" | "definitions" | "flashcards" | "matching" | "simulator" | "quiz" | "tutor";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("cart");

  const TABS = [
    { id: "cart" as Tab, label: "🚑 עגלת תרופות", icon: <BriefcaseMedical size={18} /> },
    { id: "definitions" as Tab, label: "📚 מושגי יסוד", icon: <Layers size={18} /> },
    { id: "flashcards" as Tab, label: "🧠 כרטיסיות זיכרון", icon: <Brain size={18} /> },
    { id: "matching" as Tab, label: "🧩 משחק התאמה", icon: <GitMerge size={18} /> },
    { id: "simulator" as Tab, label: "🩺 סימולטור מצבים", icon: <HeartPulse size={18} /> },
    { id: "quiz" as Tab, label: "📝 בוחן שליטה", icon: <HelpCircle size={18} /> },
    { id: "tutor" as Tab, label: "🤖 מדריך AI אישי", icon: <Stethoscope size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-natural-bg font-sans text-natural-text flex flex-col justify-between" dir="rtl">
      {/* Top Header / Branding Bar */}
      <header className="bg-natural-header text-natural-header-text border-b border-natural-header/20 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-natural-accent text-natural-header-text p-2.5 rounded-2xl shadow-md shadow-natural-accent/20 animate-pulse">
              <BriefcaseMedical size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-natural-cream tracking-tight">
                לומדת תרופות עגלת החייאה
              </h1>
              <p className="text-xs md:text-sm text-natural-header-text/80 font-medium">
                מרכז אימונים קליני אינטראקטיבי להשגת שליטה מלאה ברוקחות חירום
              </p>
            </div>
          </div>

          {/* Quick Stats banner */}
          <div className="hidden lg:flex items-center gap-4 bg-white/10 border border-white/20 px-4 py-2 rounded-2xl text-xs text-natural-header-text">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-natural-accent"></span>
              <span>11 תרופות חירום</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-natural-secondary"></span>
              <span>6 מושגי יסוד</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-natural-accent"></span>
              <span>תעודת הסמכה פעילה</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Arena */}
      <main className="flex-1 py-8 max-w-7xl w-full mx-auto px-4 space-y-8">
        
        {/* Navigation Tabs bar */}
        <div className="bg-natural-cream rounded-2xl border border-natural-border p-2 shadow-sm overflow-x-auto">
          <nav className="flex justify-start md:justify-center gap-1 md:gap-2 min-w-max">
            {TABS.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2.5 md:px-4 md:py-3 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 flex items-center gap-2 ${
                    isSelected
                      ? "bg-natural-header text-natural-header-text shadow-md transform -translate-y-0.5"
                      : "text-natural-medium-text hover:bg-natural-callout hover:text-natural-dark-text"
                  }`}
                  id={`tab-btn-${tab.id}`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Panel viewport */}
        <div className="animate-fade-in">
          {activeTab === "cart" && <MedicationCart />}
          {activeTab === "definitions" && <VisualDefinitions />}
          {activeTab === "flashcards" && <Flashcards />}
          {activeTab === "matching" && <MatchingGame />}
          {activeTab === "simulator" && <ClinicalSimulator />}
          {activeTab === "quiz" && <MasteryQuiz />}
          {activeTab === "tutor" && <AITutor />}
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="bg-natural-callout border-t border-natural-border py-6 text-center text-natural-light-text text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} לומדת תרופות עגלת החייאה. כל הזכויות שמורות.</p>
          <div className="flex items-center gap-1 text-[11px] text-natural-medium-text font-mono">
            <span>פלטפורמת למידה אינטראקטיבית</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
