"use client";
import { useEffect, useState } from "react";
import { getBrowserClient } from "@/lib/supabase-browser";

type Cat = { slug: string; name: string };
const inp = "mt-1 w-full rounded-xl border border-line bg-white px-3 py-2";

export default function AdminClient({ cats }: { cats: Cat[] }) {
  const sb = getBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [msg, setMsg] = useState("");
  const [f, setF] = useState({ slug: "", title_bn: "", title_en: "", description_bn: "", description_en: "", price_type: "unknown", is_online: true, official_url: "", source_name: "", source_url: "", category: cats[0]?.slug ?? "", status: "published", checked: false });
  const set = (k: string, v: string | boolean) => setF((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setUserId(data.session?.user.id ?? null));
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setUserId(s?.user.id ?? null));
    return () => sub.subscription.unsubscribe();
  }, [sb]);
  useEffect(() => {
    if (!sb || !userId) { setIsAdmin(null); return; }
    sb.from("admins").select("user_id").eq("user_id", userId).maybeSingle().then(({ data }) => setIsAdmin(!!data));
  }, [sb, userId]);

  if (!sb) return <p className="rounded-2xl bg-amber-50 p-4 text-amber-900">ডাটাবেজ সংযুক্ত নয়।</p>;

  const auth = async (mode: "in" | "up") => {
    setMsg("");
    const { error } = mode === "in" ? await sb.auth.signInWithPassword({ email, password }) : await sb.auth.signUp({ email, password });
    setMsg(error ? "ত্রুটি: " + error.message : mode === "up" ? "অ্যাকাউন্ট তৈরি হয়েছে। ইমেইল যাচাই লাগলে ইনবক্স দেখুন, তারপর লগইন করুন।" : "");
  };

  const submit = async (e: React.MouseEvent) => {
    e.preventDefault(); setMsg("");
    if (!/^[a-z0-9-]+$/.test(f.slug)) return setMsg("slug-এ শুধু ছোট হাতের ইংরেজি অক্ষর, সংখ্যা ও - দিন।");
    if (!f.title_bn && !f.title_en) return setMsg("অন্তত একটি নাম (বাংলা বা English) দিন।");
    if (!f.source_name.trim()) return setMsg("তথ্যের উৎসের নাম দিন। উৎস ছাড়া listing যোগ হবে না।");
    const name = f.source_name.trim();
    let { data: src } = await sb.from("sources").select("id").eq("name", name).maybeSingle();
    if (!src) {
      const r = await sb.from("sources").insert({ name, url: f.source_url || null }).select("id").single();
      if (r.error) return setMsg("উৎস সংরক্ষণে ত্রুটি: " + r.error.message);
      src = r.data;
    }
    const l = await sb.from("listings").insert({
      slug: f.slug, entity_type: "other", title_bn: f.title_bn || null, title_en: f.title_en || null,
      description_bn: f.description_bn || null, description_en: f.description_en || null,
      price_type: f.price_type, is_online: f.is_online, official_url: f.official_url || null,
      source_id: src!.id, source_url: f.source_url || null, status: f.status,
      last_checked_at: f.checked ? new Date().toISOString() : null,
    }).select("id").single();
    if (l.error) return setMsg("Listing সংরক্ষণে ত্রুটি: " + l.error.message);
    const c = await sb.from("categories").select("id").eq("slug", f.category).single();
    if (c.data) await sb.from("listing_categories").insert({ listing_id: l.data.id, category_id: c.data.id, is_primary: true });
    setMsg("সংরক্ষিত হয়েছে: " + f.slug);
    setF((p) => ({ ...p, slug: "", title_bn: "", title_en: "", description_bn: "", description_en: "", official_url: "", source_url: "" }));
  };

  if (!userId) return (
    <div className="mx-auto max-w-sm space-y-3">
      <h1 className="text-2xl font-bold">অ্যাডমিন লগইন</h1>
      <label className="block">ইমেইল<input className={inp} type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label className="block">পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)<input className={inp} type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      <div className="flex gap-2">
        <button onClick={() => auth("in")} className="rounded-full bg-brand px-5 py-2 font-semibold text-white">লগইন</button>
        <button onClick={() => auth("up")} className="rounded-full border border-line px-5 py-2">নতুন অ্যাকাউন্ট</button>
      </div>
      {msg && <p role="alert">{msg}</p>}
    </div>
  );
  if (isAdmin === null) return <p>যাচাই করা হচ্ছে...</p>;
  if (!isAdmin) return (
    <div className="space-y-3"><p className="rounded-2xl bg-amber-50 p-4 text-amber-900">এই অ্যাকাউন্টকে এখনো অ্যাডমিন অনুমতি দেওয়া হয়নি। অনুমতি দেওয়া হলে পাতাটি রিফ্রেশ করুন।</p>
      <button onClick={() => sb.auth.signOut()} className="underline">লগআউট</button></div>
  );
  return (
    <div className="mx-auto max-w-xl space-y-3">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">নতুন listing যোগ করুন</h1>
        <button onClick={() => sb.auth.signOut()} className="underline">লগআউট</button></div>
      <p className="text-sm text-ink/70">শুধু যাচাইকৃত তথ্য দিন। দাম, রিভিউ বা তথ্য বানিয়ে লিখবেন না। উৎস বাধ্যতামূলক।</p>
      <label className="block">slug (ইংরেজি, ইউআরএলের জন্য)<input className={inp} value={f.slug} onChange={(e) => set("slug", e.target.value)} /></label>
      <label className="block">নাম (বাংলা)<input className={inp} value={f.title_bn} onChange={(e) => set("title_bn", e.target.value)} /></label>
      <label className="block">Name (English)<input className={inp} value={f.title_en} onChange={(e) => set("title_en", e.target.value)} /></label>
      <label className="block">বিবরণ (বাংলা)<textarea className={inp} value={f.description_bn} onChange={(e) => set("description_bn", e.target.value)} /></label>
      <label className="block">Description (English)<textarea className={inp} value={f.description_en} onChange={(e) => set("description_en", e.target.value)} /></label>
      <label className="block">ক্যাটাগরি<select className={inp} value={f.category} onChange={(e) => set("category", e.target.value)}>{cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label>
      <label className="block">মূল্য<select className={inp} value={f.price_type} onChange={(e) => set("price_type", e.target.value)}>
        <option value="unknown">জানা নেই</option><option value="free">ফ্রি</option><option value="paid">পেইড</option><option value="freemium">ফ্রি + পেইড</option></select></label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={f.is_online} onChange={(e) => set("is_online", e.target.checked)} /> অনলাইন</label>
      <label className="block">অফিসিয়াল ওয়েবসাইট (https://...)<input className={inp} value={f.official_url} onChange={(e) => set("official_url", e.target.value)} /></label>
      <label className="block">তথ্যের উৎসের নাম (বাধ্যতামূলক)<input className={inp} value={f.source_name} onChange={(e) => set("source_name", e.target.value)} /></label>
      <label className="block">উৎসের লিংক (ঐচ্ছিক)<input className={inp} value={f.source_url} onChange={(e) => set("source_url", e.target.value)} /></label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={f.checked} onChange={(e) => set("checked", e.target.checked)} /> আমি আজ এই তথ্য যাচাই করেছি</label>
      <label className="block">অবস্থা<select className={inp} value={f.status} onChange={(e) => set("status", e.target.value)}>
        <option value="published">প্রকাশিত</option><option value="draft">খসড়া</option></select></label>
      <button onClick={submit} className="rounded-full bg-brand px-6 py-2 font-semibold text-white">সংরক্ষণ</button>
      {msg && <p role="alert">{msg}</p>}
    </div>
  );
}
