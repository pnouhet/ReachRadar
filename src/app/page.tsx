import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/ui/Wordmark";

/** Provisional home — replaced by the full marketing home (prototype port) in plan 2. */
export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between gap-6 px-6 py-8 sm:px-[60px]">
        <Wordmark width={260} className="h-[13px] w-auto" />
        <nav className="flex items-center gap-4">
          <Button variant="ghost" href="/login">
            Log in
          </Button>
          <Button variant="primary" href="/signup">
            Start pitching
          </Button>
        </nav>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
        <h1 className="text-[clamp(40px,9vw,90px)] leading-[0.76] font-extrabold uppercase font-display">
          <span className="block">Reach radar</span>
          <span className="block text-outline">Reach radar</span>
        </h1>
        <p className="max-w-xl text-body-lg text-soft-white">Pitch smarter. Pay only for real feedback. Grow real fans.</p>
      </main>
    </div>
  );
}
