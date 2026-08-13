import "../src/portal/portalShell.css";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://www.aitusainstitute.com"),
  title: "AIT USA Institute",
  description:
    "AIT USA Institute public site and student portal migration foundation.",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/assets/wix/076-solo-logo-4-x-4-clases1.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
