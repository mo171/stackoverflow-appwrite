import HeroSectionHeader from "./components/HeroSectionHeader";
import LatestQuestions from "./components/LatestQuestions";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="pb-20 pt-32">
        <HeroSectionHeader />
      </div>
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-8 text-3xl font-bold text-black">
              Latest Questions
            </h2>
            <LatestQuestions />
          </div>
          <div className="space-y-8">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-black">
                Community Stats
              </h3>
              <div className="space-y-2 text-neutral-600">
                <p>Join thousands of developers sharing knowledge every day.</p>
                <ul className="list-inside list-disc">
                  <li>Ask any technical question</li>
                  <li>Help others and earn reputation</li>
                  <li>Connect with experts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
