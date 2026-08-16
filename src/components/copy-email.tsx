"use client";

import { useState } from "react";
import { site } from "@/data/site";

export function CopyEmail() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context, permissions). The mailto link
      // next to this button still works, so fail quietly.
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="mono-label border border-line px-4 py-3 transition-colors hover:border-line-strong hover:text-ink"
    >
      <span aria-hidden="true">{copied ? "Copied" : "Copy address"}</span>
      <span className="sr-only">
        {copied ? "Email address copied to clipboard" : "Copy email address to clipboard"}
      </span>
    </button>
  );
}
