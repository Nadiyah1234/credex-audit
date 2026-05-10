import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4">AI Spend Audit</h1>
        <p className="text-gray-400 text-lg mb-8">
          Find out if you're overspending on AI tools — free, instant, no login required.
        </p>
        <Link
          href="/audit"
          className="bg-green-500 hover:bg-green-400 text-black font-semibold px-8 py-3 rounded-lg text-lg transition-colors"
        >
          Start Free Audit →
        </Link>
      </div>
    </main>
  );
}