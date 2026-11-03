import { ImapFlow } from "imapflow";

export const getEmailCode = async (
  email: string,
): Promise<string | undefined> => {
  let code: string | undefined;

  const port = parseInt(process.env.TEST_EMAIL_PORT || "993", 10);
  // Port 993 uses implicit TLS; other ports (e.g. 143, Proton Bridge on 1143)
  // start in plaintext and upgrade via STARTTLS. Override with TEST_EMAIL_SECURE.
  const secure = process.env.TEST_EMAIL_SECURE
    ? process.env.TEST_EMAIL_SECURE === "true"
    : port === 993;

  const client = new ImapFlow({
    host: process.env.TEST_EMAIL_HOST || "imap.gmail.com",
    port,
    secure,
    // Local bridges (e.g. Proton Mail Bridge) use self-signed certificates
    tls: {
      rejectUnauthorized: !["127.0.0.1", "localhost"].includes(
        process.env.TEST_EMAIL_HOST ?? "",
      ),
    },
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
    });

    if (emailIds && emailIds.length > 0) {
      const message = await client.fetchOne(`${emailIds[0]}`, {
        envelope: true,
      });

      if (!message) {
        throw new Error(`E-Mail: no message found for ID ${emailIds[0]}`);
      }

      const [match] = message.envelope?.subject?.match(/(\d{1,6})/) ?? [];

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
