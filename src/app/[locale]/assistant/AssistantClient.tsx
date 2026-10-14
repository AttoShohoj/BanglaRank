"use client";
import Link from "next/link";
import { useState } from "react";
import type { Dict, Locale } from "@/i18n/dictionaries";

type Msg = { role: "user" | "assistant"; content: string; sources?: { slug: string; title: string }[] };

export default function AssistantClient({ locale, d }: { locale: Locale; d: Dict }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const send = async () => {
    const q = text.trim();
    if (!q || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs(next); setText(""); setBusy(true); setErr("");
    try {
      const r = await fetch("/api/assistant", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ locale, messages: next.map(({ role, content }) => ({ role, content })) }),
      });
      const j = await r.json();
      if (!r.ok) setErr(j.error === "not_configured" ? d.aiNotConfigured : j.error === "rate_limited" || j.error === "daily_limit" ? d.aiLimit : d.aiError);
      else setMsgs([...next, { role: "assistant", content: j.reply, sources: j.sources }]);
    } catch { setErr(d.aiError); }
    setBusy(false);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{d.aiTitle}</h1>
        <button onClick={() => { setMsgs([]); setErr(""); }} className="rounded-full border border-line px-4 py-1 text-sm">{d.aiNew}</button>
      </div>
      <p className="text-sm text-ink/70">{d.aiLabel}</p>
      <ul className="space-y-3" aria-live="polite">
        {msgs.map((m, i) => (
          <li key={i} className={`rounded-2xl p-4 ${m.role === "user" ? "bg-[#E8F3EE]" : "border border-line bg-white"}`}>
            <p className="whitespace-pre-wrap">{m.content}</p>
            {m.sources && m.sources.length > 0 && (
              <p className="mt-2 text-sm">{d.aiSources}: {m.sources.map((s) => (
                <Link key={s.slug} href={`/${locale}/l/${s.slug}`} className="mr-2 text-brand underline">{s.title}</Link>))}</p>
            )}
          </li>
        ))}
        {busy && <li className="text-ink/60">…</li>}
      </ul>
      {err && <p role="alert" className="rounded-2xl bg-amber-50 p-4 text-amber-900">{err}</p>}
      <div className="flex gap-2">
        <label className="flex-1"><span className="sr-only">{d.aiPlaceholder}</span>
          <input value={text} maxLength={2000} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={d.aiPlaceholder} className="w-full rounded-full border border-line px-5 py-3" /></label>
        <button onClick={send} disabled={busy} className="rounded-full bg-brand px-6 py-3 font-semibold text-white disabled:opacity-50">{d.aiSend}</button>
      </div>
    </div>
  );
}
