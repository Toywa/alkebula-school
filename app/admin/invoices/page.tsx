export const dynamic = "force-dynamic";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export default async function AdminInvoicesPage() {
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false });

  const invoices = data || [];

  if (error) {
    return (
      <main className="p-10 text-red-600">
        Failed: {error.message}
      </main>
    );
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Invoices</h1>

      <div className="mb-4">
        Total invoices: <strong>{invoices.length}</strong>
      </div>

      {invoices.length === 0 ? (
        <div>No invoices yet.</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Amount</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Due</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="p-3 border">{inv.parent_email}</td>
                <td className="p-3 border">${inv.amount_usd}</td>
                <td className="p-3 border">{inv.status}</td>
                <td className="p-3 border">
                  {new Date(inv.due_date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}