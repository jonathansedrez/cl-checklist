import React from 'react';
import Checkbox from './checkbox';
import { TodoResponse } from '../types';

interface ServiceSectionProps {
  title: string;
  todos: TodoResponse[];
  cellsLoading: string[];
  onUpdateCheckbox: (cell: string, isChecked: boolean) => void;
}

export default function ServiceSection({
  title,
  todos,
  cellsLoading,
  onUpdateCheckbox,
}: ServiceSectionProps) {
  return (
    <div className="space-y-2">
      <h2 className="font-title">{title}</h2>
      <div>
        {todos.map((todo) => (
          <Checkbox
            key={todo.checkboxCell}
            id={todo.checkboxCell}
            label={todo.description}
            isChecked={todo.isChecked}
            isLoading={cellsLoading.includes(todo.checkboxCell)}
            onChange={(isChecked) =>
              onUpdateCheckbox(todo.checkboxCell, isChecked)
            }
          />
        ))}
      </div>
    </div>
  );
}
