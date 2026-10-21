'use client';
import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { getSupabase } from '@/lib/supabase';
type Merchant = { id: string; name: string; slug: string };
type Product = { id: string; title: string; price_cents: number; inventory_count: number; status: string };
export default function Dashboard() {
 const db = getSupabase();
 const [email,setEmail] = useState(''), [password,setPassword] = useState('');
 const [userId,setUserId] = useState<string|null>(null);
 const [merchants,setMerchants] = useState<Merchant[]>([]);
 const [selected,setSelected] = useState('');
 const [products,setProducts] = useState<Product[]>([]);
 const [storeName,setStoreName] = useState(''), [slug,setSlug] = useState('');
 const [title,setTitle] = useState(''), [price,setPrice] = useState(''), [stock,setStock] = useState('0');
 const [message,setMessage] = useState(''), [busy,setBusy] = useState(false);
 async function loadMerchants() {
  if(!db) return;
  const {data,error}=await db.from('merchants').select('id,name,slug').order('created_at',{ascending:false});
  if(error) {setMessage(error.message);return;}
  const rows=(data??[]) as Merchant[];setMerchants(rows);
  setSelected(current=>rows.some(m=>m.id===current)?current:(rows[0]?.id??''));
 }
 async function loadProducts(merchantId:string) {
  if(!db || !merchantId){setProducts([]);return;}
  const {data,error}=await db.from('products').select('id,title,price_cents,inventory_count,status').eq('merchant_id',merchantId).order('created_at',{ascending:false});
  if(error){setMessage(error.message);return;}setProducts((data??[]) as Product[]);
 }
 useEffect(()=>{
  if(!db)return;
  db.auth.getUser().then(({data})=>setUserId(data.user?.id??null));
  const {data:subscription}=db.auth.onAuthStateChange((_event,session)=>setUserId(session?.user.id??null));
  return ()=>subscription.subscription.unsubscribe();
 },[db]);
 useEffect(()=>{if(userId)void loadMerchants();else{setMerchants([]);setSelected('');setProducts([]);}},[userId]);
 useEffect(()=>{void loadProducts(selected);},[selected]);
 async function submitAuth(e:FormEvent,mode:'login'|'signup') {
  e.preventDefault();if(!db)return;setBusy(true);setMessage('');
  const {error}=mode==='login'?await db.auth.signInWithPassword({email,password}):await db.auth.signUp({email,password});
  setMessage(error?.message??(mode==='signup'?'Account created. Check your email if confirmation is enabled.':'Signed in.'));
  setBusy(false);
 }
 async function createMerchant(e:FormEvent) {
  e.preventDefault();if(!db)return;setBusy(true);setMessage('');
  const {error}=await db.rpc('create_merchant',{p_name:storeName,p_slug:slug.toLowerCase().trim()});
  if(error)setMessage(error.message);else{setStoreName('');setSlug('');setMessage('Store created.');await loadMerchants();}
  setBusy(false);
 }
 async function createProduct(e:FormEvent) {
  e.preventDefault();if(!db||!selected)return;
  if(!/^\d+(\.\d{1,2})?$/.test(price)||!/^\d+$/.test(stock)){setMessage('Enter a valid price and whole-number stock.');return;}
  const cents=Math.round(Number(price)*100);
  if(!Number.isSafeInteger(cents)||!Number.isSafeInteger(Number(stock))||Number(stock)>2147483647){setMessage('Amount is too large.');return;}
  setBusy(true);setMessage('');
  const {error}=await db.from('products').insert({merchant_id:selected,title:title.trim(),price_cents:cents,inventory_count:Number(stock),status:'draft'});
  if(error)setMessage(error.message);else{setTitle('');setPrice('');setStock('0');setMessage('Draft product saved.');await loadProducts(selected);}
  setBusy(false);
 }
 return <main className="dashboard"><nav><Link href="/">◆ GuardCommerce</Link><span>Merchant workspace · early alpha</span></nav><section><p className="eyebrow">YOUR BUSINESS WORKSPACE</p><h1>Merchant dashboard</h1>{!db?<p>Setup required: add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY and apply the database migrations. No data is connected.</p>:!userId?<div className="workspace"><h2>Sign in or create an account</h2><form onSubmit={e=>submitAuth(e,'login')}><label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input type="password" minLength={6} required value={password} onChange={e=>setPassword(e.target.value)}/></label><div className="actions"><button disabled={busy} type="submit">Sign in</button><button disabled={busy} type="button" onClick={e=>void submitAuth(e as unknown as FormEvent,'signup')}>Create account</button></div></form></div>:<><div className="actions"><button type="button" onClick={()=>void db.auth.signOut()}>Sign out</button></div><div className="workspace"><h2>Your stores</h2><form onSubmit={createMerchant}><label>Business name<input required minLength={2} maxLength={120} value={storeName} onChange={e=>setStoreName(e.target.value)}/></label><label>Store URL slug<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="my-business" value={slug} onChange={e=>setSlug(e.target.value.toLowerCase())}/></label><button disabled={busy} type="submit">Create store</button></form>{merchants.length>0&&<label>Selected store<select value={selected} onChange={e=>setSelected(e.target.value)}>{merchants.map(m=><option key={m.id} value={m.id}>{m.name} ({m.slug})</option>)}</select></label>}</div>{selected&&<div className="workspace"><h2>Products (drafts only)</h2><form onSubmit={createProduct}><label>Product name<input required maxLength={200} value={title} onChange={e=>setTitle(e.target.value)}/></label><label>Price in ZAR<input required inputMode="decimal" placeholder="149.99" value={price} onChange={e=>setPrice(e.target.value)}/></label><label>Quantity<input required type="number" min="0" step="1" value={stock} onChange={e=>setStock(e.target.value)}/></label><button disabled={busy} type="submit">Save draft product</button></form><ul>{products.map(p=><li key={p.id}>{p.title} — R{(p.price_cents/100).toFixed(2)} — {p.inventory_count} in stock — {p.status}</li>)}</ul></div>}</>}{message&&<p role="status">{message}</p>}<p className="note">No storefront publication, checkout, payments, or production guarantees yet.</p></section></main>;
}
