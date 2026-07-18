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
  Stethoscope,
  Key,
  Eye,
  EyeOff,
  X
} from "lucide-react";
import { getUserApiKey, setUserApiKey, isUsingCustomKey } from "./services/gemini";

type Tab = "cart" | "definitions" | "flashcards" | "matching" | "simulator" | "quiz" | "tutor";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("cart");
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [tempKey, setTempKey] = useState<string>(getUserApiKey());
  const [showKey, setShowKey] = useState<boolean>(false);

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

          {/* Quick Stats banner & API key button */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
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

            {/* API Settings Button */}
            <button
              onClick={() => {
                setTempKey(getUserApiKey());
                setShowSettings(true);
              }}
              className="flex items-center gap-2 bg-white/10 border border-white/25 px-4 py-2 rounded-2xl text-xs md:text-sm font-bold text-natural-cream hover:bg-white/20 hover:border-white/40 transition-all duration-200 shadow-sm"
              id="btn-open-settings"
            >
              <Key size={14} className="transform rotate-90" />
              <span>הגדרות API לבינה</span>
              {isUsingCustomKey() && (
                <span className="w-2 h-2 rounded-full bg-natural-accent animate-pulse"></span>
              )}
            </button>
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

      {/* Settings Modal Overlay */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div 
            className="bg-white border border-natural-border rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-right"
            dir="rtl"
            id="settings-modal"
          >
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-4 left-4 p-1.5 rounded-xl text-natural-medium-text hover:bg-natural-bg hover:text-natural-dark-text transition-all"
              id="btn-close-settings"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2.5 mb-4 border-b border-natural-border pb-3">
              <div className="p-2 bg-natural-bg rounded-xl text-natural-header">
                <Key size={20} className="transform rotate-90" />
              </div>
              <h3 className="text-lg font-bold text-natural-dark-text">הגדרות מפתח Gemini API</h3>
            </div>

            <p className="text-xs text-natural-medium-text leading-relaxed mb-4">
              אם ברצונכם להריץ אפליקציה זו בשרת סטטי (כמו <strong>GitHub Pages</strong>) ללא שרת אחורי (Backend), באפשרותכם להגדיר מפתח Gemini API אישי משלכם.
            </p>
            
            <div className="bg-natural-bg border border-natural-border p-3 rounded-2xl mb-4 text-xs text-natural-dark-text leading-relaxed">
              <span className="font-bold text-natural-header block mb-1">🔒 אבטחת מידע ומקומיות:</span>
              המפתח נשמר בדפדפן המקומי שלכם בלבד (localStorage) ואינו נשלח לשום שרת זר. פניות הבינה המלאכותית יישלחו ישירות מהדפדפן שלכם אל השרתים המאובטחים של Google.
            </div>

            <div className="space-y-3 mb-6">
              <label className="block text-xs font-bold text-natural-dark-text">מפתח API אישי של Gemini:</label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="הזינו מפתח AI_KEY (למשל AIzaSy...)"
                  className="w-full p-3 pl-10 border-2 border-natural-border rounded-xl focus:border-natural-header focus:outline-none text-sm text-left bg-natural-bg font-mono text-natural-dark-text"
                  id="input-api-key"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-natural-medium-text hover:text-natural-dark-text p-1 rounded-lg"
                  id="btn-toggle-key-visibility"
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Save and Cancel buttons */}
            <div className="flex gap-2 justify-end border-t border-natural-border pt-4">
              <button
                onClick={() => {
                  setUserApiKey(tempKey);
                  setShowSettings(false);
                }}
                className="bg-natural-header text-white px-4 py-2.5 rounded-xl hover:opacity-90 font-semibold text-sm transition-all cursor-pointer"
                id="btn-save-key"
              >
                שמור הגדרות
              </button>
              {isUsingCustomKey() && (
                <button
                  onClick={() => {
                    setUserApiKey("");
                    setTempKey("");
                    setShowSettings(false);
                  }}
                  className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2.5 rounded-xl hover:bg-rose-100 font-semibold text-sm transition-all cursor-pointer"
                  id="btn-clear-key"
                >
                  מחק מפתח פעיל
                </button>
              )}
            </div>

            {/* Current status display */}
            <div className="mt-4 flex items-center gap-2 text-[11px]">
              <span className={`w-2 h-2 rounded-full ${isUsingCustomKey() ? "bg-natural-accent animate-pulse" : "bg-gray-400"}`}></span>
              <span className="text-natural-medium-text">
                {isUsingCustomKey() 
                  ? "הגדרת מפתח אישי פעיל. השימוש ב-Gemini מתבצע על חשבונך." 
                  : "האפליקציה משתמשת כעת בשרת ברירת מחדל (Express Server)."}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
