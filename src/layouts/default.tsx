import { Link } from "@nextui-org/link";
import { SupabaseClient } from "@supabase/supabase-js";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
  supabase,
}: {
  children: React.ReactNode;
  supabase: SupabaseClient | null;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar supabase={supabase} />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          aria-label="Github page"
          className="flex items-center gap-1 text-current"
          href="https://github.com/steintokvam"
          title="Github page"
        >
          <p className="text-primary">Stein Petter Tokvam</p>
          <span className="text-default-600">
            © {new Date().getFullYear()}
          </span>
        </Link>
      </footer>
    </div>
  );
}
