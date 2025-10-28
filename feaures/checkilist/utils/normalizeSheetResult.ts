import { TodoResponse } from '../../../types';

export const normalizeSheetResult = (
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
