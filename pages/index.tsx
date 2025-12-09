import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 sm:px-0">
      <div className="text-center mb-8 w-full sm:w-auto">
        <h1
          className="text-6xl font-black text-brand-blue mb-4"
          style={{ fontFamily: 'Castoro' }}
        >
          Checklist
        </h1>
        <p className="text-gray-600 max-w-md">
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
        href="/checklist?page=APOIO"
        className="w-full sm:w-48 px-6 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center"
      >
        Manager
      </Link>
    </div>
  );
}
