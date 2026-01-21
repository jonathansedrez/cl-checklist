import Link from 'next/link';

const FEEDBACK_FORM_URL = 'https://forms.gle/HgRCBJJFtDtAaZRY7';

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <a
        href={FEEDBACK_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-6 right-6 z-50 flex items-center justify-center"
        title="Send count"
      >
        <div className="relative">
          <button className="w-12 h-12 bg-brand-blue hover:bg-gray-800 transition-colors text-white rounded-full flex items-center justify-center shadow-lg">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>
        </div>
      </a>

      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 sm:px-0">
        <div className="text-center mb-8 w-full sm:w-auto">
          <h1
            className="text-6xl font-black text-brand-blue mb-4"
            style={{ fontFamily: '"Anthropic Serif", Georgia, sans-serif' }}
          >
            Checklist
          </h1>
          <p
            className="text-gray-600 max-w-md"
            style={{ fontFamily: '"Anthropic Sans", Arial, sans-serif' }}
          >
            Verifique cada detalhe da escala e contribua para que tudo aconteça
            com excelência para a glória de Deus
          </p>
        </div>
        <Link
          href="/checklist?page=CAFE"
          className="w-full sm:w-48 px-6 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center"
        >
          Café
        </Link>
        <Link
          href="/checklist?page=APOIO"
          className="w-full sm:w-48 px-6 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center"
        >
          Apoio
        </Link>
        <Link
          href="/checklist?page=MANAGER"
          className="w-full sm:w-48 px-6 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center"
        >
          Manager
        </Link>
        <Link
          href="/todos"
          className="w-full sm:w-48 px-6 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center"
        >
          Todos
        </Link>
      </div>
    </div>
  );
}
