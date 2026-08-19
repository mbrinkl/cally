import { createDAVClient, DAVCollection } from "tsdav";
import { env } from "./env";
import { ContactBirthday } from "@cally/shared";

export class ContactsClient {
  private client!: Awaited<ReturnType<typeof createDAVClient>>;
  private addressBook!: DAVCollection;

  async setup() {
    this.client = await createDAVClient({
      serverUrl: "https://contacts.icloud.com",
      credentials: {
        username: env.APPLE_USERNAME,
        password: env.APPLE_APP_PASSWORD,
      },
      authMethod: "Basic",
      defaultAccountType: "carddav",
    });

    const addressBooks = await this.client.fetchAddressBooks();
    this.addressBook = addressBooks[0];
  }

  private parseVCardFields(vcardData: string): Record<string, string> {
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
  }

  async getContactBirthday(): Promise<ContactBirthday[]> {
    const cards = await this.client.fetchVCards({
      addressBook: this.addressBook,
    });

    return cards
      .map((card) => {
        const data = card.data;
        if (typeof data !== "string") return null;

        const fields = this.parseVCardFields(data);
        const fullName = fields.FN?.trim();
        const birthDay = fields.BDAY?.trim();

        if (!fullName || !birthDay) return null;
        return { name: fullName, birthday: birthDay };
      })
      .filter((item): item is ContactBirthday => item !== null);
  }
}
