import Image from "next/image";
import { getSettings } from "@/lib/utils/settings";

export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <div className="container-mawa py-16 max-w-3xl mx-auto">
      <p className="uppercase tracking-[0.2em] text-mawa-gold text-xs font-semibold mb-4 text-center">
        Our Story
      </p>
      <h1 className="section-heading text-center mb-10">
        {settings.aboutHeadline || "About MaWa House"}
      </h1>

      {settings.aboutImageUrl && (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10">
          <Image src={settings.aboutImageUrl} alt="MaWa House" fill className="object-cover" />
        </div>
      )}

      <div className="prose prose-lg max-w-none text-mawa-black/75 leading-relaxed">
        {settings.aboutBody ? (
          <p>{settings.aboutBody}</p>
        ) : (
          <p>
            MaWa House is a new African café and restaurant concept in Atlanta, born from a love
            of good food, great people, and stronger community. Our official story is coming
            soon — check back shortly, or reach out to learn more about who we are.
          </p>
        )}
      </div>
    </div>
  );
}
