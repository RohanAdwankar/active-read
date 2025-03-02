import Reader from '../components/reader';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Active Reading Exercise</h1>
        <p className="text-gray-600 mt-2">
          Create a fill-in-the-blanks exercise using one of the methods below
        </p>
      </header>
      <Reader />
    </main>
  );
}
