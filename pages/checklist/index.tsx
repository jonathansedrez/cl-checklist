import { google } from 'googleapis';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Checkbox from '@/components/checkbox';
import { TodoResponse } from './types';

const SHEET_PAGE = 'APOIO';

const PRE_SERVICE_RANGE_CELL = 'B2';
const RECEPTION_RANGE_CELL = 'E2';
const DURING_THE_SERVICE_RANGE_CELL = 'H2';
const POST_SERVICE_RANGE_CELL = 'K2';

const PRE_SERVICE_CHECKBOX_COLUMN = 'A';
const RECEPTION_CHECKBOX_COLUMN = 'D';
const DURING_THE_SERVICE_CHECKBOX_COLUMN = 'G';
const POST_SERVICE_CHECKBOX_COLUMN = 'J';

const normalizeSheetResult = (
  columnName: string,
  plainSheetValue: string[][],
): TodoResponse[] => {
  return plainSheetValue.map((line, index) => {
    const [checkboxCell, descriptionCell] = line;
    const CHECKLIST_START_ROW_OFFSET = 3; // Offset between first row and checklist first element
    return {
      isChecked: checkboxCell === 'TRUE',
      description: descriptionCell,
      checkboxCell: `${columnName}${index + CHECKLIST_START_ROW_OFFSET}`,
    };
  });
};

export async function getServerSideProps() {
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  const preServiceSheetData = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: `${SHEET_PAGE}!${PRE_SERVICE_RANGE_CELL}`,
  });
  const receptionSheetData = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: `${SHEET_PAGE}!${RECEPTION_RANGE_CELL}`,
  });
  const duringTheServiceSheetData = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: `${SHEET_PAGE}!${DURING_THE_SERVICE_RANGE_CELL}`,
  });
  const postServiceSheetData = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: `${SHEET_PAGE}!${POST_SERVICE_RANGE_CELL}`,
  });

  const [preServiceRangeCellValue] = preServiceSheetData.data
    .values as string[][];
  const [receptionRangeCellValue] = receptionSheetData.data
    .values as string[][];
  const [duringTheServiceRangeCellValue] = duringTheServiceSheetData.data
    .values as string[][];
  const [postServiceRangeCellValue] = postServiceSheetData.data
    .values as string[][];

  const allPreServiceSheetData = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: `${SHEET_PAGE}!${preServiceRangeCellValue}`,
  });
  const allReceptionSheetData = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: `${SHEET_PAGE}!${receptionRangeCellValue}`,
  });
  const allDuringTheServiceSheetData = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: `${SHEET_PAGE}!${duringTheServiceRangeCellValue}`,
  });
  const allPostServiceSheetData = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: `${SHEET_PAGE}!${postServiceRangeCellValue}`,
  });

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
    },
  };
}

export default function ChecklistPage({
  preServiceLinesToTodo,
  receptionLinesToTodo,
  duringTheServiceLinesToTodo,
  postServiceLinesToTodo,
}: {
  preServiceLinesToTodo: TodoResponse[];
  receptionLinesToTodo: TodoResponse[];
  duringTheServiceLinesToTodo: TodoResponse[];
  postServiceLinesToTodo: TodoResponse[];
}) {
  const router = useRouter();
  const [cellsLoading, setCellsLoading] = useState<string[]>([]);

  const handleUpdateCheckbox = (checkboxCell: string, isChecked: boolean) => {
    setCellsLoading((prev) => [...prev, checkboxCell]);

    fetch('/api/sheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        range: `${SHEET_PAGE}!${checkboxCell}`,
        value: isChecked ? 'TRUE' : 'FALSE',
      }),
    })
      .then((response) => {
        if (response.ok) {
          return router.replace(router.asPath);
        }
        throw new Error('Failed to update checkbox');
      })
      .catch((error) => {
        console.error('Failed to update checkbox:', error);
      })
      .finally(() => {
        setCellsLoading((prev) =>
          prev.filter((loader) => loader !== checkboxCell),
        );
      });
  };

  return (
    <fieldset className="m-5">
      <div className="space-y-2">
        <p>Pré recepição</p>
        <div>
          {preServiceLinesToTodo.map((todo) => (
            <Checkbox
              key={todo.checkboxCell}
              id={todo.checkboxCell}
              label={todo.description}
              isChecked={todo.isChecked}
              isLoading={cellsLoading.includes(todo.checkboxCell)}
              onChange={(isChecked) =>
                handleUpdateCheckbox(todo.checkboxCell, isChecked)
              }
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p>Recepição</p>
        <div>
          {receptionLinesToTodo.map((todo) => (
            <Checkbox
              key={todo.checkboxCell}
              id={todo.checkboxCell}
              label={todo.description}
              isChecked={todo.isChecked}
              isLoading={cellsLoading.includes(todo.checkboxCell)}
              onChange={(isChecked) =>
                handleUpdateCheckbox(todo.checkboxCell, isChecked)
              }
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p>Durante o culto</p>
        <div>
          {duringTheServiceLinesToTodo.map((todo) => (
            <Checkbox
              key={todo.checkboxCell}
              id={todo.checkboxCell}
              label={todo.description}
              isChecked={todo.isChecked}
              isLoading={cellsLoading.includes(todo.checkboxCell)}
              onChange={(isChecked) =>
                handleUpdateCheckbox(todo.checkboxCell, isChecked)
              }
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p>Pós culto</p>
        <div>
          {postServiceLinesToTodo.map((todo) => (
            <Checkbox
              key={todo.checkboxCell}
              id={todo.checkboxCell}
              label={todo.description}
              isChecked={todo.isChecked}
              isLoading={cellsLoading.includes(todo.checkboxCell)}
              onChange={(isChecked) =>
                handleUpdateCheckbox(todo.checkboxCell, isChecked)
              }
            />
          ))}
        </div>
      </div>
    </fieldset>
  );
}
