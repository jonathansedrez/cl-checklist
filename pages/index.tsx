import Link from 'next/link';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Link href="/checklist?page=CAFE">Café</Link>
      <Link href="/checklist?page=APOIO">Apoio</Link>
    </div>
  );
}
