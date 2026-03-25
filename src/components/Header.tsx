import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  clearStoredAuthUser,
  getStoredAuthUser,
} from "#/auth/fakeAuth";
import type { AuthUser } from "#/types";

const primaryNavLinkClass =
  "border-b-2 border-transparent px-[0.05rem] py-[0.28rem] font-[650] text-[var(--ink-soft)] no-underline transition-colors duration-150 ease-in-out hover:text-[var(--ink-strong)]";
const primaryNavLinkActiveClass =
  "border-b-2 border-[rgba(221,107,32,0.5)] px-[0.05rem] py-[0.28rem] font-[650] text-[var(--accent-strong)] no-underline transition-colors duration-150 ease-in-out hover:text-[var(--ink-strong)]";
const disabledNavLinkClass =
  "cursor-not-allowed select-none opacity-45 hover:text-[var(--ink-soft)]";

export default function Header() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const syncUser = () => {
      setCurrentUser(getStoredAuthUser());
    };

    syncUser();
    window.addEventListener("focus", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("focus", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const isLoggedIn = currentUser !== null;

  const handleSignout = async () => {
    clearStoredAuthUser();
    setCurrentUser(null);
    await navigate({ to: "/" });
  };

  const handleAuthNavigation = async (to: "/signin" | "/signup") => {
    setCurrentUser(getStoredAuthUser());
    await navigate({ to });
  };

  const handleHomeNavigation = async () => {
    setCurrentUser(getStoredAuthUser());
    await navigate({ to: "/" });
  };

  const handleAddJokeNavigation = async () => {
    const user = getStoredAuthUser();
    setCurrentUser(user);

    if (user) {
      await navigate({ to: "/new-joke" });
    } else {
      await navigate({ to: "/signin" });
    }
  };

  const addJokeLinkClass = isLoggedIn
    ? primaryNavLinkClass
    : `${primaryNavLinkClass} ${disabledNavLinkClass}`;

  const addJokeActiveClass = isLoggedIn
    ? primaryNavLinkActiveClass
    : `${primaryNavLinkClass} ${disabledNavLinkClass}`;

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(234,217,194,0.8)] bg-[linear-gradient(180deg,rgba(255,252,246,0.86)_0%,rgba(255,247,235,0.74)_100%)] px-4 backdrop-blur-[10px]">
      <nav className="mx-auto flex w-full max-w-[72rem] flex-wrap items-center gap-x-4 gap-y-2 py-3 sm:py-4">
        <h2 className="m-0 shrink-0">
          <button
            type="button"
            onClick={handleHomeNavigation}
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(221,107,32,0.22)] bg-[#fffaf1] px-[0.95rem] py-2 font-[var(--font-display)] text-[1.02rem] font-bold tracking-[0.01em] text-[var(--ink-strong)] no-underline shadow-[0_10px_25px_rgba(176,102,38,0.1)] transition-[transform,box-shadow] duration-150 ease-in-out hover:-translate-y-px hover:shadow-[0_12px_28px_rgba(176,102,38,0.17)]"
          >
            <span className="h-[0.55rem] w-[0.55rem] rounded-full bg-[linear-gradient(180deg,#f59e0b_0%,#dd6b20_100%)] shadow-[0_0_0_4px_rgba(221,107,32,0.14)]" />
            DevJokes
          </button>
        </h2>

        <div className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm sm:order-2 sm:w-auto sm:flex-nowrap sm:pb-0">
          <button
            type="button"
            onClick={handleHomeNavigation}
            className={primaryNavLinkClass}
          >
            Home
          </button>

          <button
            type="button"
            onClick={handleAddJokeNavigation}
            className={isLoggedIn ? addJokeActiveClass : addJokeLinkClass}
            title={!isLoggedIn ? "Sign in to add a joke" : undefined}
          >
            Add Joke
          </button>

          <Link
            to="/about"
            className={primaryNavLinkClass}
            activeProps={{ className: primaryNavLinkActiveClass }}
          >
            About
          </Link>
        </div>

        <div className="order-2 ml-auto flex items-center gap-2 text-sm sm:order-3">
          {isLoggedIn ? (
            <>
              <span className="text-[#6e5c47]">{currentUser.fullName}</span>
              <button
                type="button"
                onClick={handleSignout}
                className="rounded-full border border-[#d78a41] bg-[linear-gradient(180deg,#ee9a49_0%,#d77420_100%)] px-3 py-1.5 font-semibold text-[#fff9f2] shadow-[0_6px_12px_rgba(180,83,9,0.2)] transition-[transform,box-shadow] duration-150 ease-in-out hover:-translate-y-px hover:shadow-[0_8px_14px_rgba(180,83,9,0.28)]"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleAuthNavigation("/signin")}
                className="rounded-full border border-[#d9cbb3] bg-[#fffdf8] px-3 py-1.5 font-semibold text-[#6e5c47] no-underline transition-colors duration-150 hover:border-[#c8b393] hover:text-[#4b3b28]"
              >
                Signin
              </button>
              <button
                type="button"
                onClick={() => handleAuthNavigation("/signup")}
                className="rounded-full border border-[#d78a41] bg-[linear-gradient(180deg,#ee9a49_0%,#d77420_100%)] px-3 py-1.5 font-semibold text-[#fff9f2] no-underline shadow-[0_6px_12px_rgba(180,83,9,0.2)] transition-[transform,box-shadow] duration-150 ease-in-out hover:-translate-y-px hover:shadow-[0_8px_14px_rgba(180,83,9,0.28)]"
              >
                Signup
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}