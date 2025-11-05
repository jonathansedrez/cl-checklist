import { google } from 'googleapis';
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
  const auth = await google.auth.getClient({
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
    <fieldset className="m-5">
      <ServiceSection
        title="Pré recepição"
        todos={preServiceLinesToTodo}
        cellsLoading={cellsLoading}
        onUpdateCheckbox={handleUpdateCheckbox}
      />

      <ServiceSection
        title="Recepição"
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
  );
}
