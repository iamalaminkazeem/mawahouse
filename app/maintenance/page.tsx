export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-mawa-cream px-6">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-4xl font-bold text-mawa-red mb-4">MaWa House</h1>
        <p className="text-lg text-mawa-black/80 mb-3">
          We're temporarily closed for online orders.
        </p>
        <p className="text-mawa-black/60">
          Please check back soon, or call us at{" "}
          <a href="tel:4708156319" className="text-mawa-red font-medium">
            470-815-6319
          </a>
          .
        </p>
      </div>
    </div>
  );
}