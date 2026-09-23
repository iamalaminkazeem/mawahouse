export default function AdminSettingsPage() {
  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <h1 className="font-serif text-3xl font-bold mb-8">Settings</h1>
      <div className="bg-white rounded-2xl border border-black/5 p-6 text-sm text-mawa-black/70 space-y-3">
        <p>
          Site content settings live under their own sections in the sidebar (Homepage, About,
          Restaurant Info, Hours, Ordering, Reservations, Socials).
        </p>
        <p>
          To change your admin login password, update it directly in the database, or ask your
          developer to add a password-change form here.
        </p>
      </div>
    </div>
  );
}
