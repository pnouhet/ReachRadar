/** Placeholder for app pages filled in by later plans. */
export function PendingPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-page-title text-gradient">{title}</h1>
      <p className="text-body-md text-muted">Coming soon.</p>
    </div>
  );
}
