// app/actions/bookActions.ts
export async function createBookAction(formData: FormData) {
  "use server";
  // extrai campos do formData
  const payload = Object.fromEntries(formData.entries());
  // faz fetch para nossa API interna
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    // ✅ importante: next: { revalidate: 0 } se quiser forçar comportamento
  });
  if (!res.ok) throw new Error("Erro ao criar livro");
  return res.json();
}
