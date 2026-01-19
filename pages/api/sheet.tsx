import { google, sheets_v4 } from 'googleapis';
import type { NextApiRequest, NextApiResponse } from 'next';

type UpdateCheckboxRequest = {
  range: string;
  value: string;
};

export const getGoogleSheetsClient = (): sheets_v4.Sheets => {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.split(String.raw`\n`).join(
    '\n',
  );

  if (!clientEmail || !privateKey) {
    throw new Error(
      'Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY environment variables',
    );
  }

  const auth = new google.auth.JWT(clientEmail, undefined, privateKey, [
    'https://www.googleapis.com/auth/spreadsheets',
  ]);
  return google.sheets({ version: 'v4', auth });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    message: string;
    error?: string;
  }>,
) {
  const { range, value } = req.body as UpdateCheckboxRequest;

  try {
    const sheets = getGoogleSheetsClient();

    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SHEET_ID as string,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[value]],
      },
    });
    res.status(200).json({ message: 'Checkbox updated successfully' });
  } catch (error) {
    res.status(500).json({ message: `Failed to update checkbox ${error}` });
  }
}
