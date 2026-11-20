import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Blog | Partner2B",
  description: "Articles on B2B partner programs from Partner2B.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <div style={{ background: "#fff url(/mesh-program.svg) top / 100% 100% no-repeat", overflow: "hidden" }}>
      <div style={{ position: "relative", overflow: "hidden", color: "#0A0A0B" }}>
        <div className="limepanel" />
        <Nav />
        <div className="wrap" style={{ padding: "24px 40px 120px" }}>
          <h1 className="h1big">Blog</h1>
          <p style={{ margin: "24px 0 0", maxWidth: 720, fontSize: 21, lineHeight: 1.5, fontWeight: 500 }}>Articles are coming soon</p>
        </div>
      </div>
      <div style={{ height: 320 }} />
      <Footer />
    </div>
  );
}
