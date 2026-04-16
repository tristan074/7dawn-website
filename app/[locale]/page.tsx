import { setRequestLocale } from "next-intl/server";
import Nav from "@/components/Nav";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Nav />
      <main className="pt-24">
        <h1 className="text-white p-8">7dawn · placeholder</h1>
      </main>
    </>
  );
}
