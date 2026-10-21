import Link from 'next/link';
type Product={product_id:string|null;product_title:string|null;product_description:string|null;price_cents:number|null;currency:string|null;inventory_count:number|null};
type Row=Product&{store_name:string;store_description:string;theme_color:string};
async function getStore(slug:string):Promise<Row[]>{
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return [];
 const response=await fetch(url+'/rest/v1/rpc/storefront_catalogue',{method:'POST',headers:{'apikey':key,'Authorization':'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({p_slug:slug}),cache:'no-store'});
 if(!response.ok)return [];
 return await response.json() as Row[];
}
export default async function Storefront({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 if(!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug))return <main className="store"><h1>Store not found</h1></main>;
 const rows=await getStore(slug),store=rows[0];
 if(!store)return <main className="store"><h1>Store not found</h1><Link href="/">Return home</Link></main>;
 return <main className="store"><nav><strong>{store.store_name}</strong><Link href="/">Powered by GuardCommerce</Link></nav><section><p className="eyebrow">WELCOME TO OUR STORE</p><h1>{store.store_name}</h1><p>{store.store_description||'Explore our collection.'}</p><div className="cards">{rows.filter(x=>x.product_id).map(p=><article key={p.product_id}><div className="product-image">Product</div><h3>{p.product_title}</h3><p>{p.product_description}</p><strong>R{((p.price_cents??0)/100).toFixed(2)}</strong><p>{p.inventory_count} available</p><small>Online purchasing coming soon</small></article>)}</div></section></main>;
}
