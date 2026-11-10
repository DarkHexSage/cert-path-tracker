import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Resources from "@/components/Resources";

export const metadata: Metadata = { title: "Free resources" };

export default function ResourcesPage() {
  return (
    <main>
      <PageHero
        title="Free resources"
        subtitle="Channels, playlists and videos that make every course easier to follow."
        crumbs={[{ label: "Free resources" }]}
      />
      <div className="container-x py-10">
        <Resources />
      </div>
    </main>
  );
}
