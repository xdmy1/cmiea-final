export const navigation = [
  { href: "/despre/", label: "Despre noi" },
  { href: "/cursuri/", label: "Cursuri" },
  { href: "/noutati/", label: "Noutăți" },
  { href: "/contact/", label: "Contacte" },
];
export const community = [
  {
    href: "/evenimente/",
    label: "Evenimente",
    description: "Ateliere, întâlniri și experiențe noi",
  },
  {
    href: "/cluburi/",
    label: "Cluburi",
    description: "Oameni și pasiuni în comun",
  },
];
export const facebookPage =
  "https://www.facebook.com/profile.php?id=100091913902284";
export const telegramGroup = "https://t.me/+03ceuSlIN25mMTky";
export const adminSections = [
  { id: "course", label: "Cursuri", group: "Conținut" },
  { id: "events", label: "Evenimente", group: "Conținut" },
  { id: "clubs", label: "Cluburi", group: "Conținut" },
  { id: "team", label: "Echipă și funcții", group: "Conținut" },
  { id: "enrollment", label: "Cereri la cursuri", group: "Înscrieri" },
  {
    id: "eventRegistrations",
    label: "Înscrieri la evenimente",
    group: "Înscrieri",
  },
  {
    id: "clubRegistrations",
    label: "Înscrieri la cluburi",
    group: "Înscrieri",
  },
  { id: "users", label: "Utilizatori", group: "Comunitate" },
] as const;
export type AdminSection = (typeof adminSections)[number]["id"];
