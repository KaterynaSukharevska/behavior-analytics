import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pulseboard — Product analytics for modern teams",
  description:
    "Pulseboard helps SaaS teams understand behavior, improve activation, and track conversions with minimal setup.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="siteShell">
          <header className="header">
            <div className="container headerInner">
              <Link
                href="/"
                className="brand"
                data-analytics-id="nav-brand-home"
              >
                <span className="logo" aria-hidden="true" />
                <span>Pulseboard</span>
              </Link>

              <nav className="nav" aria-label="Primary">
                <Link
                  className="navLink"
                  href="/"
                  data-analytics-id="nav-home"
                >
                  Home
                </Link>
                <Link
                  className="navLink"
                  href="/features"
                  data-analytics-id="nav-features"
                >
                  Features
                </Link>
                <Link
                  className="navLink"
                  href="/pricing"
                  data-analytics-id="nav-pricing"
                >
                  Pricing
                </Link>
                <Link
                  className="navLink"
                  href="/contact"
                  data-analytics-id="nav-contact"
                >
                  Contact
                </Link>
                <Link
                  className="navCta"
                  href="/pricing"
                  data-analytics-id="nav-cta-view-pricing"
                >
                  View pricing
                </Link>
              </nav>
            </div>
          </header>

          <main className="main">
            <div className="container">{children}</div>
          </main>

          <footer className="footer">
            <div className="container footerInner">
              <div className="finePrint">
                © {new Date().getFullYear()} Pulseboard. Demo marketing site for
                tracking tests.
              </div>
              <div className="finePrint">
                <Link href="/contact" data-analytics-id="footer-contact-link">
                  Contact
                </Link>{" "}
                ·{" "}
                <Link href="/pricing" data-analytics-id="footer-pricing-link">
                  Pricing
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

