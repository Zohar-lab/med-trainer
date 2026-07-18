const SYSTEM_INSTRUCTION = `
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

export function getUserApiKey(): string {
  return localStorage.getItem("user_gemini_api_key") || "";
}

export function setUserApiKey(key: string): void {
  if (key.trim()) {
    localStorage.setItem("user_gemini_api_key", key.trim());
  } else {
    localStorage.removeItem("user_gemini_api_key");
  }
}

export function isUsingCustomKey(): boolean {
  return !!getUserApiKey();
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  const apiKey = getUserApiKey();

  if (apiKey) {
    // Direct client-side fetch to avoid any Node/Vite bundling or polyfill issues
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

    const formattedContents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : m.role,
      parts: [{ text: m.content }],
    }));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: formattedContents,
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        generationConfig: {
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let parsedError;
      try {
        parsedError = JSON.parse(errorText);
      } catch {
        parsedError = null;
      }
      const errorMessage = parsedError?.error?.message || response.statusText;
      throw new Error(`שגיאה ב-API של Gemini: ${errorMessage}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) {
      throw new Error("לא התקבלה תשובה תקינה מה-API של Gemini.");
    }
    return reply;
  } else {
    // Fallback to our Express server endpoints
    const response = await fetch("/api/gemini/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error("שגיאה בתקשורת עם שרת האפליקציה.");
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data.content;
  }
}

export async function generateScenario(): Promise<{ scenario: string; correctDrug: string; explanation: string }> {
  const apiKey = getUserApiKey();

  if (apiKey) {
    // Direct client-side fetch to avoid backend dependence
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

    const promptText = `צור תיאור קצר בעברית של מקרה חירום רפואי קליני (עד 3-4 משפטים) שבו הפתרון דורש שימוש באחת מהתרופות הבאות בלבד:
אדרנלין, אטרופין, אקטיק (פנטניל), ביקרבונט, אדנוזין, אמיודורון, איקקור, מגנזיום, אירובנט, ונטולין, סולומדרול.

אל תציין את שם התרופה בתיאור המקרה. המטרה היא שהמשתמש ינחש את התרופה הנכונה על סמך התסמינים.
החזר אך ורק קובץ JSON בפורמט הבא (ללא תוספות טקסט, ללא סימוני markdown של \`\`\`json):
{
  "scenario": "תיאור המקרה בעברית...",
  "correctDrug": "שם התרופה המדויק בעברית מתוך הרשימה",
  "explanation": "הסבר קצר בעברית למה זו התרופה הנכונה ואיך זה מתקשר למנגנון הפעולה שלה"
}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          temperature: 0.8,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let parsedError;
      try {
        parsedError = JSON.parse(errorText);
      } catch {
        parsedError = null;
      }
      const errorMessage = parsedError?.error?.message || response.statusText;
      throw new Error(`שגיאה ב-API של Gemini: ${errorMessage}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) {
      throw new Error("לא התקבלה תשובה מה-API של Gemini.");
    }

    const cleanedText = reply.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanedText);
  } else {
    // Fallback to Express backend if no custom API key is supplied
    const response = await fetch("/api/gemini/generate-scenario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("שגיאה בחיבור לשרת הבינה המלאכותית.");
    }

    const data = await response.json();
    if (!data.scenario || !data.correctDrug) {
      throw new Error("נתונים לא תקינים שהתקבלו משרת ה-AI.");
    }
    return data;
  }
}
