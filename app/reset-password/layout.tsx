import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your password securely",
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Reset Password",
            "description": "Reset your password securely",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://taaft.org"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Reset Password",
                  "item": "https://taaft.org/reset-password"
                }
              ]
            }
          })
        }}
      />
      {children}
    </>
  );
} 