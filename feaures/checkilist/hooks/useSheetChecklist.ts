import { useRouter } from 'next/router';
import { useState } from 'react';

export function useSheetChecklist(sheetPage: string) {
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
          range: `${sheetPage}!${checkboxCell}`,
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
