import "../src/portal/portalShell.css";
import "./globals.css";

export const metadata = {
  title: "AIT USA Institute",
  description:
    "AIT USA Institute public site and student portal migration foundation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
