import { google } from 'googleapis';
import Link from 'next/link';
import { useSheetChecklist } from '@/hooks/useSheetChecklist';
import { normalizeSheetResult } from '@/utils/normalizeSheetResult';
import { TodoResponse } from '../../types';
import ServiceSection from '@/components/ServiceSection';

const PRE_SERVICE_RANGE_CELL = 'B2';
const RECEPTION_RANGE_CELL = 'E2';
const DURING_THE_SERVICE_RANGE_CELL = 'H2';
const POST_SERVICE_RANGE_CELL = 'K2';

const PRE_SERVICE_CHECKBOX_COLUMN = 'A';
const RECEPTION_CHECKBOX_COLUMN = 'D';
const DURING_THE_SERVICE_CHECKBOX_COLUMN = 'G';
const POST_SERVICE_CHECKBOX_COLUMN = 'J';

export async function getServerSideProps({
  query,
}: {
  query: { page?: string };
}) {
  const page = (query.page as string) || 'APOIO';
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
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  const [
    preServiceSheetData,
    receptionSheetData,
    duringTheServiceSheetData,
    postServiceSheetData,
  ] = await Promise.all([
    sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: `${page}!${PRE_SERVICE_RANGE_CELL}`,
    }),
    sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: `${page}!${RECEPTION_RANGE_CELL}`,
    }),
    sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: `${page}!${DURING_THE_SERVICE_RANGE_CELL}`,
    }),
    sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: `${page}!${POST_SERVICE_RANGE_CELL}`,
    }),
  ]);

  const [preServiceRangeCellValue] = preServiceSheetData.data
    .values as string[][];
  const [receptionRangeCellValue] = receptionSheetData.data
    .values as string[][];
  const [duringTheServiceRangeCellValue] = duringTheServiceSheetData.data
    .values as string[][];
  const [postServiceRangeCellValue] = postServiceSheetData.data
    .values as string[][];

  const [
    allPreServiceSheetData,
    allReceptionSheetData,
    allDuringTheServiceSheetData,
    allPostServiceSheetData,
  ] = await Promise.all([
    sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: `${page}!${preServiceRangeCellValue}`,
    }),
    sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: `${page}!${receptionRangeCellValue}`,
    }),
    sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: `${page}!${duringTheServiceRangeCellValue}`,
    }),
    sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: `${page}!${postServiceRangeCellValue}`,
    }),
  ]);

  const allPreServiceValues = allPreServiceSheetData.data.values as string[][];
  const allReceptionValues = allReceptionSheetData.data.values as string[][];
  const allDuringTheServiceValues = allDuringTheServiceSheetData.data
    .values as string[][];
  const allPostServiceValues = allPostServiceSheetData.data
    .values as string[][];

  return {
    props: {
      preServiceLinesToTodo: normalizeSheetResult(
        PRE_SERVICE_CHECKBOX_COLUMN,
        allPreServiceValues,
      ),
      receptionLinesToTodo: normalizeSheetResult(
        RECEPTION_CHECKBOX_COLUMN,
        allReceptionValues,
      ),
      duringTheServiceLinesToTodo: normalizeSheetResult(
        DURING_THE_SERVICE_CHECKBOX_COLUMN,
        allDuringTheServiceValues,
      ),
      postServiceLinesToTodo: normalizeSheetResult(
        POST_SERVICE_CHECKBOX_COLUMN,
        allPostServiceValues,
      ),
      page,
    },
  };
}

export default function ChecklistPage({
  preServiceLinesToTodo,
  receptionLinesToTodo,
  duringTheServiceLinesToTodo,
  postServiceLinesToTodo,
  page,
}: {
  preServiceLinesToTodo: TodoResponse[];
  receptionLinesToTodo: TodoResponse[];
  duringTheServiceLinesToTodo: TodoResponse[];
  postServiceLinesToTodo: TodoResponse[];
  page: string;
}) {
  const { handleUpdateCheckbox, cellsLoading } = useSheetChecklist(page);

  return (
    <>
      <Link href="/" className="inline-block m-5 p-2 text-brand-blue hover:text-gray-800 font-semibold">
        ← Voltar
      </Link>
      <fieldset className="m-5">
      <ServiceSection
        title="Pré recepção"
        todos={preServiceLinesToTodo}
        cellsLoading={cellsLoading}
        onUpdateCheckbox={handleUpdateCheckbox}
      />

      <ServiceSection
        title="Recepção"
        todos={receptionLinesToTodo}
        cellsLoading={cellsLoading}
        onUpdateCheckbox={handleUpdateCheckbox}
      />

      <ServiceSection
        title="Durante o culto"
        todos={duringTheServiceLinesToTodo}
        cellsLoading={cellsLoading}
        onUpdateCheckbox={handleUpdateCheckbox}
      />

      <ServiceSection
        title="Pós culto"
        todos={postServiceLinesToTodo}
        cellsLoading={cellsLoading}
        onUpdateCheckbox={handleUpdateCheckbox}
      />
    </fieldset>
    </>
  );
}
