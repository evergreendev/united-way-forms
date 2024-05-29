import Image from "next/image";
import {query} from "@/app/db";
import Login from "@/app/components/login";

async function fetchData(){
  return await query("SELECT * FROM user");
}

export default async function Home() {
  const data = await fetchData();

  console.log(data);

  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Login/>
      </main>
  );
}
