import { PortfolioSite } from "./components/PortfolioSite";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "ICEINN 愛似影攝影",
  alternateName: "ICEINN Photography",
  url: "https://icegee1976.github.io/iceinn/",
  image: "https://icegee1976.github.io/iceinn/assets/images/logo-192.jpg",
  email: "mailto:icegee@gmail.com",
  telephone: "+886975348716",
  areaServed: "Taiwan",
  sameAs: [
    "https://www.facebook.com/theiceinn/",
    "https://www.instagram.com/iceinn/",
    "https://www.flickr.com/photos/iceinn/",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PortfolioSite />
    </>
  );
}
