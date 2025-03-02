import Reader from '../components/reader';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Active Reading Exercise</h1>
        <p className="text-gray-600 mt-2">
          Choose an input method to create a fill-in-the-blanks exercise
        </p>
      </header>
      <Reader />
    </main>
  );
}
