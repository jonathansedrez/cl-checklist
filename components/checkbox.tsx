interface CheckboxProps {
  isChecked: boolean;
  label: string;
  onChange: (isChecked: boolean) => void;
  id: string;
  isLoading?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  isChecked,
  label,
  onChange,
  id,
  isLoading = false,
}) => {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 mb-2">
      <div className="flex items-center">
        {isLoading ? (
          <span role="status" className="flex items-center">
            <svg
              className="animate-spin h-7 w-7 text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 28 28"
              aria-hidden="true"
            >
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span className="sr-only">Carregando...</span>
          </span>
        ) : (
          <>
            <input
              type="checkbox"
              id={id}
              className="sr-only"
              checked={isChecked}
              onChange={(e) => onChange(e.target.checked)}
            />
            <span
              aria-hidden="true"
              className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors flex-shrink-0 ${
                isChecked
                  ? 'bg-blue-400 border-blue-400'
                  : 'bg-white border border-blue-400'
              }`}
            >
              {isChecked ? (
                <svg
                  className="h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : null}
            </span>
          </>
        )}
      </div>
      <div>
        <strong className="font-medium text-gray-900">{label}</strong>
      </div>
    </label>
  );
};

export default Checkbox;
