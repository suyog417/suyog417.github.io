"use client";

/**
 * ponytail: no theme library, and no React state either — the current theme
 * already lives in a class on <html>, so CSS shows the right label and there
 * is nothing to hydrate. `display: none` also keeps the inactive label out of
 * the accessibility tree.
 */
export function ThemeToggle() {
  function toggle() {
    const next = !document.documentElement.classList.contains("light");
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("theme", next ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="mono-label border border-line px-3 py-1.5 transition-colors hover:border-line-strong hover:text-ink"
    >
      <span className="theme-dark-only">Dark</span>
      <span className="theme-light-only">Light</span>
      <span className="sr-only"> — switch colour theme</span>
    </button>
  );
}
