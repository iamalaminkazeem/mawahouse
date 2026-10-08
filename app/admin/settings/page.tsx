import PasswordChangeForm from "@/components/admin/PasswordChangeForm";

export default function AdminSettingsPage() {
  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <h1 className="font-serif text-3xl font-bold mb-8">Settings</h1>

      <div className="bg-white rounded-2xl border border-black/5 p-6 text-sm text-mawa-black/70 space-y-3 mb-8">
        <p>
          Site content settings live under their own sections in the sidebar (Homepage, About,
          Restaurant Info, Hours, Ordering, Catering Services, Socials).
        </p>
      </div>

      <h2 className="font-semibold mb-4">Change Admin Password</h2>
      <PasswordChangeForm />
    </div>
  );
}