import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Lazy initialization of Gemini to prevent crashes on startup if API key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Gemini Chat / Tutor
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }

      const client = getGeminiClient();

      // Formulate system instruction containing the full study guide data
      const systemInstruction = `
אתה מדריך רפואת חירום ישראלי מומחה (Emergency Medicine Tutor). תפקידך הוא לעזור לסטודנטים לרפואה, סיעוד ופראמדיק להשיג שליטה מלאה בתרופות עגלת החייאה (Crash Cart Medications).

עליך להתבסס אך ורק על החומר הבא שנמצא בדף הלימוד שלהם:

1. אדרנלין (Adrenaline):
   - צורת הופעה: 1 mg / 1cc
   - התוויות לשימוש: החייאה, התקף אסטמה, אנאפילקסיס, ברדיקרדיה, ירידה בפרפוזיה, סטרידור ילדים
   - מנגנון פעולה: מפעיל מערכת סימפטטית

2. אטרופין (Atropine):
   - צורת הופעה: 1mg / 1cc
   - התוויות לשימוש: ברדיקרדיה, הרעלת זרחנים אורגניים, ריור יתר
   - מנגנון פעולה: חוסם מערכת פאראסימפטטית

3. אקטיק (החומר הפעיל: פנטניל) (Actiq - Fentanyl):
   - צורת הופעה: 800mcg
   - התוויות לשימוש: משכך כאבים שניתן במציצה
   - מנגנון פעולה: נקשר לקולטני opioid (קבוצת אופיאטים)

4. ביקרבונט (Sodium Bicarbonate):
   - צורת הופעה: 100 meq / 100cc
   - התוויות לשימוש: החייאה ממושכת, שיקול מתן בהחייאה במקרים של היפרקלמיה, חמצת מטבולית, אי ספיקת כליות, הרעלת נוגדי דיכאון, תסמונת מעיכה
   - מנגנון פעולה: בסיסי - נוגד חומצה מערכתי. מעלה את רמת ה-pH בדם.

5. אדנוזין (Adenosine):
   - צורת הופעה: 6mg / 2cc
   - התוויות לשימוש: הפרעת קצב מהירה מסוג PSVT
   - מנגנון פעולה: מאט את הפעילות בקוצב המשני בלב (קוצב ה-AV node)

6. אמיודורון (Amiodarone):
   - צורת הופעה: 150mg / 3cc
   - התוויות לשימוש: החייאת VT / VF ללא דופק, הפרעות קצב מהירות, חזרת דופק
   - מנגנון פעולה: משנה תהליכים בהולכה בלב

7. איקקור (Ikacor / Verapamil):
   - צורת הופעה: 5mg / 2cc
   - התוויות לשימוש: הפרעות קצב מהירות
   - מנגנון פעולה: משנה תהליכים בהולכה בלב

8. מגנזיום (Magnesium):
   - צורת הופעה: 5 gr / 10cc
   - התוויות לשימוש: הפרעת קצב מסוג TDP, אסטמה, רעלת הריון
   - מנגנון פעולה: מונע את כיווץ השריר (מרפה שריר חלק/משורטט)

9. אירובנט (Aerovent / Ipratropium):
   - צורת הופעה: 5mg / 20cc
   - התוויות לשימוש: אסטמה, COPD, הרעלת זרחנים אורגניים
   - מנגנון פעולה: חוסם מערכת פאראסימפטטית מרחיב סימפונות

10. ונטולין (Ventolin / Albuterol):
    - צורת הופעה: 100mg / 20cc
    - התוויות לשימוש: אסטמה, COPD, אנאפילקסיס, שאיפת עשן, תסמונת מעיכה
    - מנגנון פעולה: מפעיל מערכת סימפטטית

11. סולומדרול בפלקון קטן (Solu-Medrol / Methylprednisolone):
    - צורת הופעה: 125mg / 2cc או 500mg/8cc
    - התוויות לשימוש: אסטמה, COPD, אנאפילקסיס, שאיפת עשן
    - מנגנון פעולה: סטרואיד, אנטי דלקתי

הגדרות חשובות נוספות:
- פלקון (Vial/Flacon): בקבוקון האטום בגומי ויש בפנים וואקום. להשתמש במחט בצבע ורוד (עם מסננת בקצה כדי שלא יישאב גומי מהמכסה). יש שיטה לשאוב מהפלקון (למלא אוויר בנפח המבוקש ולהזריק לפלקון כדי לאזן לחצים).
- אמפולה (Ampoule): שפורפרת זכוכית או פלסטיק המכילה חומר.
- cc או מ"ל (מיליליטר): יחידת מידה של נפח נוזל.
- mg או מ"ג (מיליגרם): יחידת מידה של משקל.
- gr או גרם: יחידת מידה של משקל.
- iu: יחידת מידה של "יחידות בינלאומיות" (International Units).

הנחיות לניהול השיחה:
1. ענה תמיד בעברית ברורה, מקצועית ומעודדת.
2. השתמש בעימוד נוח לקריאה, הדגשות ונקודות.
3. אם המשתמש שואל שאלות על מנגנוני הפעולה או ההתוויות, הסבר אותם בצורה רפואית מעניינת ופשוטה (למשל, הסבר את ההבדל בין הפעלת המערכת הסימפטטית על ידי אדרנלין לעומת חסימת המערכת הפאראסימפטטית על ידי אטרופין).
4. אם המשתמש מבקש סימולציה או "בחן אותי", הצג מקרה חירום רפואי אחד קצר וממוקד (למשל: "מטופל מובא אליך עם ברדיקרדיה חריפה וריור מוגבר, ככל הנראה הרעלת זרחנים. מה תיתן ובאיזה מינון?"). המתן לתשובתו, הערך אותה בעדינות והמשך לכוון אותו לשליטה בחומר.
5. שמור על טון חיובי ומקצועי.
      `;

      // Structure messages for @google/genai SDK chat.
      // Format messages into chat structure.
      // Using standard model 'gemini-3.5-flash' for educational QA.
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : m.role,
          parts: [{ text: m.content }],
        })),
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ content: response.text });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      res.status(500).json({ error: error.message || "An error occurred with Gemini API." });
    }
  });

  // API Route to generate a new custom clinical scenario
  app.post("/api/gemini/generate-scenario", async (req, res) => {
    try {
      const client = getGeminiClient();
      const prompt = `צור תיאור קצר בעברית של מקרה חירום רפואי קליני (עד 3-4 משפטים) שבו הפתרון דורש שימוש באחת מהתרופות הבאות בלבד:
אדרנלין, אטרופין, אקטיק (פנטניל), ביקרבונט, אדנוזין, אמיודורון, איקקור, מגנזיום, אירובנט, ונטולין, סולומדרול.

אל תציין את שם התרופה בתיאור המקרה. המטרה היא שהמשתמש ינחש את התרופה הנכונה על סמך התסמינים.
החזר אך ורק קובץ JSON בפורמט הבא (ללא תוספות טקסט, ללא סימוני markdown של \`\`\`json):
{
  "scenario": "תיאור המקרה בעברית...",
  "correctDrug": "שם התרופה המדויק בעברית מתוך הרשימה",
  "explanation": "הסבר קצר בעברית למה זו התרופה הנכונה ואיך זה מתקשר למנגנון הפעולה שלה"
}`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.8,
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "{}";
      const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      res.json(JSON.parse(cleanedText));
    } catch (error: any) {
      console.error("Gemini generate-scenario error:", error);
      res.status(500).json({ error: error.message || "An error occurred generating a scenario." });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
