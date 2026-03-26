import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="bg-white text-crimson py-16 md:py-24 border-t-2 border-crimson/10 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 border-b-2 border-crimson/10 pb-16">
          
          <div className="col-span-1">
            <Logo className="font-serif text-4xl font-bold text-crimson tracking-wide mb-6 inline-flex" iconSize={28} />
            <p className="text-crimson/70 leading-relaxed mb-6 font-light text-lg">
              A sanctuary for long-form fiction. Where stories are lived, not just read.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 uppercase tracking-widest text-crimson">Platform</h4>
            <ul className="space-y-4 text-crimson/70 font-medium tracking-wide">
              <li><Link href="/stories" className="hover:text-crimson-light transition-colors">Read Stories</Link></li>
              <li><Link href="/authors" className="hover:text-crimson-light transition-colors">For Authors</Link></li>
              <li><Link href="/blogs" className="hover:text-crimson-light transition-colors">The Inkwell Blog</Link></li>
              <li><Link href="/guidelines" className="hover:text-crimson-light transition-colors">Community Guidelines</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 uppercase tracking-widest text-crimson">Connect</h4>
            <ul className="space-y-4 text-crimson/70 font-medium tracking-wide">
              <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-crimson-light transition-colors">Twitter / X</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-crimson-light transition-colors">Instagram</a></li>
              <li><a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-crimson-light transition-colors">Discord Server</a></li>
              <li><Link href="/support" className="hover:text-crimson-light transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div>
             <h4 className="font-bold text-lg mb-6 uppercase tracking-widest text-crimson">Legal</h4>
             <ul className="space-y-4 text-crimson/70 font-medium tracking-wide">
               <li><Link href="/terms" className="hover:text-crimson transition-colors">Terms of Service</Link></li>
               <li><Link href="/privacy" className="hover:text-crimson transition-colors">Privacy Policy</Link></li>
               <li><Link href="#" className="hover:text-crimson transition-colors">Cookie Policy</Link></li>
             </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-crimson/50 text-sm font-semibold tracking-wide">
          <p>&copy; {new Date().getFullYear()} Crimson Red. All rights reserved.</p>
          <p className="mt-4 md:mt-0 uppercase tracking-widest text-xs">Designed for the storytellers.</p>
        </div>
      </div>
    </footer>
  );
}
