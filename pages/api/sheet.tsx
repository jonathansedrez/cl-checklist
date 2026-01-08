import { google, sheets_v4 } from 'googleapis';
import type { NextApiRequest, NextApiResponse } from 'next';

type UpdateCheckboxRequest = {
  range: string;
  value: string;
};

export const getGoogleSheetsClient = (): sheets_v4.Sheets => {
  const credentials = process.env.GOOGLE_PRIVATE_KEY
    ? {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: process.env.GOOGLE_AUTH_URI,
        token_uri: process.env.GOOGLE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
      }
    : undefined;

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

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
