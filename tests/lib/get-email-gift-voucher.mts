import { ImapFlow } from "imapflow";

export const getEmailGiftVoucher = async (
  email: string
): Promise<string | undefined> => {
  let code: string | undefined;

  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: {
      user: process.env.TEST_EMAIL_USERNAME ?? "oops",
      pass: process.env.TEST_EMAIL_PASSWORD,
    },
    logger: false,
  });
  // Wait until client connects and authorizes
  await client.connect();

  // Select and lock a mailbox. Throws if mailbox does not exist
  let lock = await client.getMailboxLock("INBOX");
  try {
    const emailIds = await client.search({
      to: email,
      subject: "Vielen Dank! Wir haben Ihre Zahlung erhalten.",
    });

    if (emailIds && emailIds.length > 0) {
      const message = await client.fetchOne(`${emailIds[0]}`, {
        envelope: true,
        source: true,
      });

      if (!message) {
        throw new Error(`E-Mail: no message found for ID ${emailIds[0]}`);
      }

      const source = message.source?.toString();

      const [match] = source?.match(/([A-Z\d]{4}-[A-Z\d]{4})/) ?? [];

      if (match) {
        code = match;
      }
    }
  } catch (e) {
    console.log(e);
  } finally {
    // Make sure lock is released, otherwise next `getMailboxLock()` never returns
    lock.release();
  }

  // log out and close connection
  await client.logout();

  return code;
};
