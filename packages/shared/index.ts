export const DEFAULT_PORT = 3000;

export interface UiConfig {
  calendarIds: string[];
  calendarColors?: string[];
  birthdaysColor?: string;
  colorScheme: "light" | "dark";
}

export interface ContactBirthday {
  name: string;
  birthday: string;
}
