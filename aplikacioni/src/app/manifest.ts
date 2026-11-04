
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ndërtimtari",
    short_name: "Ndërtimtari",
    description: "Aplikacion për projektet e ndërtimtarisë.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    lang: "sq",
  };
}
