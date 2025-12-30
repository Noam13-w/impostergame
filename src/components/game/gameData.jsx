// Hebrew Word Bank for Imposter Game
export const categories = {
  "אוכל": [
    "פיצה", "המבורגר", "סושי", "פלאפל", "שוקולד", "גלידה",
    "שווארמה", "חומוס", "סלט", "פסטה", "קפה", "עוגה",
    "בננה", "תפוח", "לחם", "גבינה", "ביצה", "אורז"
  ],
  "מקומות": [
    "בית ספר", "קניון", "חוף הים", "קולנוע", "בית חולים",
    "מסעדה", "פארק", "ספרייה", "תחנת רכבת", "שדה תעופה",
    "מוזיאון", "גן חיות", "בריכה", "מכולת", "בנק"
  ],
  "חפצים": [
    "טלפון", "מספריים", "כדור", "משקפיים", "שעון",
    "מחשב", "מפתחות", "ארנק", "תיק", "עט",
    "מטריה", "כרית", "מראה", "פנס", "כוס"
  ],
  "בעלי חיים": [
    "כלב", "חתול", "אריה", "פיל", "ג'ירפה",
    "נחש", "דולפין", "נשר", "פרפר", "דבורה",
    "סוס", "פרה", "תרנגול", "דג", "ארנב"
  ],
  "מקצועות": [
    "רופא", "מורה", "שוטר", "טייס", "שף",
    "עורך דין", "מהנדס", "אחות", "זמר", "שחקן",
    "כבאי", "נהג", "צלם", "ספר", "אדריכל"
  ],
  "ספורט": [
    "כדורגל", "כדורסל", "טניס", "שחייה", "ריצה",
    "אופניים", "גלישה", "יוגה", "בוקס", "גולף",
    "כדורעף", "הוקי", "סקי", "גימנסטיקה", "קראטה"
  ]
};

export const getRandomCategories = (count = 3) => {
  const categoryNames = Object.keys(categories);
  const shuffled = [...categoryNames].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getRandomWord = (category) => {
  const words = categories[category];
  if (!words) return null;
  return words[Math.floor(Math.random() * words.length)];
};

export const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const generatePlayerId = () => {
  return 'player_' + Math.random().toString(36).substr(2, 9);
};