export interface Medication {
  id: string;
  name: string;
  englishName: string;
  presentation: string;
  indications: string[];
  mechanism: string;
  system: "sympathetic" | "parasympathetic" | "cardiac" | "opioid" | "acid-base" | "muscular" | "steroid";
  visualType: string; // e.g. "vial", "ampoule", "spray", "tablet"
  color: string; // Tailwind color class
}

export interface Definition {
  term: string;
  translation?: string;
  meaning: string;
  visualIcon: string;
  details?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: "indication" | "presentation" | "mechanism";
  drugId: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ClinicalScenario {
  id: string;
  scenario: string;
  correctDrugId: string;
  options: string[];
  explanation: string;
  difficulty: "קל" | "בינוני" | "קשה";
}
