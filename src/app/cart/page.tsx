'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
type CartLine={productId:string;merchantId:string;title:string;unitPriceCents:number;quantity:number};
const KEY='guardcommerce:cart:v1';
function valid(x:unknown):x is CartLine {if(!x||typeof x!=='object')return false;const v=x as Partial<CartLine>;return typeof v.productId==='string'&&typeof v.merchantId==='string'&&typeof v.title==='string'&&Number.isSafeInteger(v.unitPriceCents)&&v.unitPriceCents!>=0&&Number.isSafeInteger(v.quantity)&&v.quantity!>0&&v.quantity!<=99;}
export default function CartPage(){
 const [lines,setLines]=useState<CartLine[]>([]),[loaded,setLoaded]=useState(false);
 useEffect(()=>{try{const raw=JSON.parse(localStorage.getItem(KEY)??'[]') as unknown;if(Array.isArray(raw))setLines(raw.filter(valid).slice(0,100));}catch{setLines([])}setLoaded(true)},[]);
 useEffect(()=>{if(loaded)localStorage.setItem(KEY,JSON.stringify(lines))},[lines,loaded]);
 const subtotal=lines.reduce((sum,l)=>sum+l.unitPriceCents*l.quantity,0);
 const money=(n:number)=>new Intl.NumberFormat('en-ZA',{style:'currency',currency:'ZAR'}).format(n/100);
 return <main className="dashboard"><nav><Link href="/">◆ GuardCommerce</Link><span>Customer cart · preview</span></nav><section><p className="eyebrow">YOUR SELECTION</p><h1>Shopping cart</h1><p role="status" className="note">Cart preview only. Prices and stock must be rechecked by the server before checkout. Payments are disabled.</p>{!loaded?<p>Loading cart…</p>:lines.length===0?<div className="workspace"><h2>Your cart is empty</h2><p>Explore a merchant storefront to discover products.</p><Link href="/">Return home</Link></div>:<div className="workspace"><h2>Items</h2><ul>{lines.map(l=><li key={l.merchantId+':'+l.productId}><strong>{l.title}</strong> — {money(l.unitPriceCents)} each <label>Quantity <input type="number" min="1" max="99" value={l.quantity} onChange={e=>{const q=Number(e.target.value);if(Number.isSafeInteger(q)&&q>=1&&q<=99)setLines(a=>a.map(x=>x.productId===l.productId&&x.merchantId===l.merchantId?{...x,quantity:q}:x))}} /></label><button type="button" onClick={()=>setLines(a=>a.filter(x=>x!==l))}>Remove</button></li>)}</ul><p><strong>Estimated subtotal: {money(subtotal)}</strong></p><p>Shipping and taxes are not calculated. Final totals require server verification.</p><button type="button" disabled title="Secure checkout is not available yet">Checkout unavailable</button></div>}</section></main>;
}
