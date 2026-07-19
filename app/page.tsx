import { PortfolioSite } from "./components/PortfolioSite";
import { SITE_STRUCTURED_DATA } from "../seo.config.mjs";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_STRUCTURED_DATA) }}
      />
      <PortfolioSite />
    </>
  );
}
