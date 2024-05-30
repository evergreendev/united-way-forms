import {query} from "@/app/db"

async function fetchData(){
  return await query("SELECT * FROM user");
}

export default async function Home() {
  const data = await fetchData();

  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
      </main>
  );
}
