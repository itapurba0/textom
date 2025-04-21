import { CodeInput } from "@/components/index";

export default function Home() {
  return (
    <main className="container mx-auto mt-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Welcome to TEXTOM
        </h1>
        <p className="text-lg text-gray-600">
          Share and retrieve your files and text easily with unique codes.
        </p>
      </div>
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 rounded-lg shadow-lg">
          <div className="bg-white rounded-lg p-6">
            <CodeInput />
          </div>
        </div>
      </section>
    </main>
  );
}