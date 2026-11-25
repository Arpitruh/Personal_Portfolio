// Server-only, parameterized Neon SQL over HTTPS. Never expose the connection string to clients.
export function databaseConfigured(){return Boolean(process.env.DATABASE_URL);}
export async function query<T>(sql:string,params:string[]=[]):Promise<T[]>{
 const connection=process.env.DATABASE_URL;
 if(!connection)throw new Error("Database unavailable");
 const host=new URL(connection).hostname;
 if(!host.endsWith(".neon.tech"))throw new Error("Unexpected database host");
 const res=await fetch("https://"+host.replace("-pooler.","." )+"/sql",{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json","Neon-Connection-String":connection,"Neon-Raw-Text-Output":"true","Neon-Array-Mode":"false"},body:JSON.stringify({query:sql,params}),signal:AbortSignal.timeout(15000)});
 if(!res.ok)throw new Error("Database query failed");
 const result=await res.json() as {rows:T[]};
 return result.rows;
}
export async function published<T>(section:string,fallback:T):Promise<T>{
 if(!databaseConfigured())return fallback;
 try{const rows=await query<{published:string|null}>("SELECT published::text AS published FROM portfolio_content WHERE section=$1",[section]);return rows[0]?.published?JSON.parse(rows[0].published) as T:fallback;}catch{return fallback;}
}
