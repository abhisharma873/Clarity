import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import { getCurrentUser } from "@/lib/supabase/user";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="flex items-center justify-between px-6 py-4 print:hidden">
      <Link href="/" className="text-sm font-semibold text-stone-900 dark:text-stone-50">
        Clarity
      </Link>
      {user && (
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/account"
            className="font-medium text-stone-600 hover:text-amber-700 dark:text-stone-300"
          >
            My plans
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="font-medium text-stone-500 hover:text-amber-700 dark:text-stone-400"
            >
              Sign out
            </button>
          </form>
        </nav>
      )}
    </header>
  );
}
