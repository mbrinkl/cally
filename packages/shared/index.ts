export const DEFAULT_PORT = 3000;

export interface UiConfig {
  calendarIds: string[];
  externalICalUrls?: string[];
  calendarColors?: string[];
  birthdaysColor?: string;
  externalICalColors?: string[];
  colorScheme: "light" | "dark";
}

export interface ContactBirthday {
  name: string;
  birthday: string;
}
