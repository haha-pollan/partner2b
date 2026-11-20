import Link from "next/link";
import { Logo } from "./Logo";

export function Nav() {
  return (
    <div className="nav">
      <Link href="/" aria-label="Partner2B home" style={{ display: "flex", alignItems: "center" }}>
        <Logo variant="dark" />
      </Link>
      <nav className="navlinks">
        <Link href="/directory">Directory</Link>
        <Link href="/services">Services</Link>
        <Link href="/post">Blog</Link>
        <Link href="/submit">Submit a program</Link>
        <Link href="/directory" className="navcta">Browse directory</Link>
      </nav>
    </div>
  );
}
