import { setRequestLocale } from "next-intl/server";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import PlatformDossier from "@/components/PlatformDossier";
import WhyNow from "@/components/WhyNow";
import Problem from "@/components/Problem";
import Spaces from "@/components/Spaces";
import Architecture from "@/components/Architecture";
import Harness from "@/components/Harness";
import Scenarios from "@/components/Scenarios";
import Evolution from "@/components/Evolution";
import Market from "@/components/Market";
import CTAContact from "@/components/CTAContact";
import Footer from "@/components/Footer";

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
      <main>
        <Hero />
        <PlatformDossier />
        <WhyNow />
        <Problem />
        <Spaces />
        <Architecture />
        <Harness />
        <Scenarios />
        <Evolution />
        <Market />
        <CTAContact />
      </main>
      <Footer />
    </>
  );
}
