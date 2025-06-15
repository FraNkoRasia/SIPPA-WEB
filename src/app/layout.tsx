import { FormProvider } from "@/context/FormContext";
import "./index.css";
import NavBar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Toaster } from "sonner";

export const metadata = {
  title: "SIPPA",
  description:
    "Es una página web donde se puede gestionar operarios y recibos de sueldo",
  openGraph: {
    title: "SIPPA",
    description:
      "SIPPA es un sistema de gestión de recursos humanos que permite administrar operarios y personal administrativo, así como generar, visualizar y gestionar recibos de sueldo de manera eficiente.",

    url: "https://sippa-two.vercel.app",
    type: "website",
    images: [
      {
        url: "https://sippa-two.vercel.app/Img/sippalogo.webp",
        width: 1200,
        height: 630,
        alt: "Vista previa de SIPPA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SIPPA",
    description:
      "SIPPA es un sistema de gestión de recursos humanos que permite administrar operarios y personal administrativo, así como generar, visualizar y gestionar recibos de sueldo de manera eficiente.",

    images: ["https://sippa-two.vercel.app/Img/sippalogo.webp"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* Ícono principal para navegadores */}
        <link
          rel="icon"
          href="/Img/iconopesta.png"
          type="image/png"
          sizes="32x32"
        />

        {/* Favicon en .ico para mejor compatibilidad */}
        <link rel="shortcut icon" href="/Img/favicon.ico" type="image/x-icon" />

        {/* Apple Touch Icon para iOS */}
        <link
          rel="apple-touch-icon"
          href="/Img/iconopesta.png"
          sizes="180x180"
        />

        {/* Color de tema para móviles */}
        <meta name="theme-color" content="#ffffff" />
      </head>

      <body className="min-h-screen flex flex-col">
        <FormProvider>
          <NavBar />
          <main className="flex-1">
            <div className="max-w-[1200px] mx-auto px-4">{children}</div>
          </main>
          <Footer />
        </FormProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
