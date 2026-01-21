import { google } from 'googleapis';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
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

const PAGES = ['CAFE', 'APOIO', 'MANAGER'] as const;

interface SectionData {
  preService: TodoResponse[];
  reception: TodoResponse[];
  duringTheService: TodoResponse[];
  postService: TodoResponse[];
}

function normalizeWithPagePrefix(
  page: string,
  checkboxColumn: string,
  values: string[][],
): TodoResponse[] {
  const normalized = normalizeSheetResult(checkboxColumn, values);
  return normalized.map((todo) => ({
    ...todo,
    checkboxCell: `${page}!${todo.checkboxCell}`,
  }));
}

export async function getServerSideProps() {
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
    'https://www.googleapis.com/auth/spreadsheets.readonly',
  ]);
  const sheets = google.sheets({ version: 'v4', auth });

  const sectionData: SectionData = {
    preService: [],
    reception: [],
    duringTheService: [],
    postService: [],
  };

  for (const page of PAGES) {
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

    const allPreServiceValues = allPreServiceSheetData.data
      .values as string[][];
    const allReceptionValues = allReceptionSheetData.data.values as string[][];
    const allDuringTheServiceValues = allDuringTheServiceSheetData.data
      .values as string[][];
    const allPostServiceValues = allPostServiceSheetData.data
      .values as string[][];

    sectionData.preService.push(
      ...normalizeWithPagePrefix(
        page,
        PRE_SERVICE_CHECKBOX_COLUMN,
        allPreServiceValues,
      ),
    );
    sectionData.reception.push(
      ...normalizeWithPagePrefix(
        page,
        RECEPTION_CHECKBOX_COLUMN,
        allReceptionValues,
      ),
    );
    sectionData.duringTheService.push(
      ...normalizeWithPagePrefix(
        page,
        DURING_THE_SERVICE_CHECKBOX_COLUMN,
        allDuringTheServiceValues,
      ),
    );
    sectionData.postService.push(
      ...normalizeWithPagePrefix(
        page,
        POST_SERVICE_CHECKBOX_COLUMN,
        allPostServiceValues,
      ),
    );
  }

  return {
    props: {
      sectionData,
    },
  };
}

function useAdminSheetChecklist() {
  const router = useRouter();
  const [cellsLoading, setCellsLoading] = useState<string[]>([]);

  const handleUpdateCheckbox = async (
    checkboxCell: string,
    isChecked: boolean,
  ) => {
    setCellsLoading((prev) => [...prev, checkboxCell]);

    try {
      const response = await fetch('/api/sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          range: checkboxCell,
          value: isChecked ? 'TRUE' : 'FALSE',
        }),
      });

      if (!response.ok) throw new Error('Failed to update checkbox');
      await router.replace(router.asPath);
    } catch (error) {
      console.error(error);
    } finally {
      setCellsLoading((prev) => prev.filter((id) => id !== checkboxCell));
    }
  };

  return { handleUpdateCheckbox, cellsLoading };
}

export default function AdminCheckboxPage({
  sectionData,
}: {
  sectionData: SectionData;
}) {
  const { handleUpdateCheckbox, cellsLoading } = useAdminSheetChecklist();

  return (
    <>
      <Link
        href="/"
        className="inline-block m-5 p-2 text-brand-blue hover:text-gray-800 font-semibold"
      >
        ← Voltar
      </Link>

      <fieldset className="m-5">
        <ServiceSection
          title="Pré recepção"
          todos={sectionData.preService}
          cellsLoading={cellsLoading}
          onUpdateCheckbox={handleUpdateCheckbox}
        />

        <ServiceSection
          title="Recepção"
          todos={sectionData.reception}
          cellsLoading={cellsLoading}
          onUpdateCheckbox={handleUpdateCheckbox}
        />

        <ServiceSection
          title="Durante o culto"
          todos={sectionData.duringTheService}
          cellsLoading={cellsLoading}
          onUpdateCheckbox={handleUpdateCheckbox}
        />

        <ServiceSection
          title="Pós culto"
          todos={sectionData.postService}
          cellsLoading={cellsLoading}
          onUpdateCheckbox={handleUpdateCheckbox}
        />
      </fieldset>
    </>
  );
}
