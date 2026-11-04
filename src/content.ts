export const TELEGRAM = "https://t.me/city_brands1";
export const ADDRESS = "проспект Петра Григоренка, 32Д, Київ, 02140";
export const MAP = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS)}`;

export const stories = [
  {
    title: "Знайомство з City Brands",
    subtitle: "Твоє нове місце на Позняках",
    file: "city",
    duration: "0:34",
    poster: "city-poster",
  },
  {
    title: "Деталі твого гардероба",
    subtitle: "Натхнення починається з дрібниць",
    file: "clothing",
    duration: "0:19",
    poster: "clothing-poster",
  },
  {
    title: "На крок ближче до свого",
    subtitle: "Зазирни до нашої колекції взуття",
    file: "shoes",
    duration: "0:12",
    poster: "shoes-poster",
  },
  {
    title: "Погляд зсередини",
    subtitle: "Знаходь, приміряй, закохуйся",
    file: "inside",
    duration: "0:36",
    poster: "inside-poster",
  },
];

export const categories = [
  {
    name: "Одяг",
    note: "Одяг для твого ритму",
    image: "clothing-cover",
    story: 1,
    id: "clothing",
    index: "01",
  },
  {
    name: "Взуття",
    note: "Знайди свою пару",
    image: "shoes-cover",
    story: 2,
    id: "shoes",
    index: "02",
  },
  {
    name: "У магазині",
    note: "Речі. Люди. Атмосфера.",
    image: "style-cover",
    story: 3,
    id: "store",
    index: "03",
  },
];
