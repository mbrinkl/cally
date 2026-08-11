import { createDAVClient } from "tsdav";

const contactsClient = await createDAVClient({
  serverUrl: "https://contacts.icloud.com",
  credentials: {
    username: process.env.APPLE_USERNAME,
    password: process.env.APPLE_APP_PASSWORD,
  },
  authMethod: "Basic",
  defaultAccountType: "carddav",
});

const addressBooks = await contactsClient.fetchAddressBooks();

const addressBook = addressBooks[0];
const cards = await contactsClient.fetchVCards({ addressBook });

type ContactBirthday = {
  name: string;
  birthday: string;
};

const parseVCardFields = (vcardData: string): Record<string, string> => {
  const unfolded = vcardData.replace(/\r\n[ \t]/g, "");
  const lines = unfolded.split(/\r\n|\n/);

  return lines.reduce(
    (fields, line) => {
      const match = line.match(/^([^:;]+)(?:;[^:]*)?:(.*)$/);
      if (!match) return fields;

      const fieldName = match[1].toUpperCase();
      const value = match[2].trim();
      if (!value) return fields;

      fields[fieldName] = fields[fieldName]
        ? `${fields[fieldName]}\n${value}`
        : value;
      return fields;
    },
    {} as Record<string, string>,
  );
};

export const getContactBirthdays = (): ContactBirthday[] => {
  return cards
    .map((card) => {
      const data = card.data;
      if (typeof data !== "string") return null;

      const fields = parseVCardFields(data);
      const fullName = fields.FN?.trim();
      const birthDay = fields.BDAY?.trim();

      if (!fullName || !birthDay) return null;
      return { name: fullName, birthday: birthDay };
    })
    .filter((item): item is ContactBirthday => item !== null);
};
