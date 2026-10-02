"use client";

import { useRef, useState } from "react";
import { Check, Copy, Mail } from "lucide-react";

// Assembled on click so the address never sits in the page source for scrapers.
const assemble = () =>
  String.fromCharCode(
    83, 116, 97, 114, 119, 121, 110, 100, 77, 117, 115, 105, 99, 64,
    112, 114, 111, 116, 111, 110, 109, 97, 105, 108, 46, 99, 111, 109,
  );

export default function EmailCard() {
  const [address, setAddress] = useState<string | null>(null);
  const [copied, setCopied] = useState<"copied" | "selected" | null>(null);
  const link = useRef<HTMLAnchorElement>(null);

  // Many people read mail in a browser tab, where an email link opens nothing,
  // so copying the address is offered alongside it.
  const copy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied("copied");
    } catch {
      // Some in-app browsers block the clipboard: select the address instead
      // so it can be copied by hand.
      const selection = window.getSelection();
      if (link.current && selection) {
        const range = document.createRange();
        range.selectNodeContents(link.current);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setCopied("selected");
    }
    window.setTimeout(() => setCopied(null), 2200);
  };

  return (
    <div className="sw-card sw-contact-card sw-spot">
      <span className="sw-card-icon" aria-hidden="true"><Mail size={22} /></span>
      <h3>Email</h3>
      <p>Collaborations, creative ideas, or just a connection.</p>
      {address ? (
        <div className="sw-email">
          <a ref={link} className="sw-email-address" href={`mailto:${address}`}>{address}</a>
          <div className="sw-email-actions">
            <button className="sw-btn sw-btn-ghost sw-btn-sm" onClick={copy}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied === "copied" ? "Copied" : copied === "selected" ? "Selected — copy it" : "Copy address"}
            </button>
            <a className="sw-btn sw-btn-ghost sw-btn-sm" href={`mailto:${address}`}>Open mail app</a>
          </div>
          <p className="sr-only" aria-live="polite">
            {copied === "copied" ? "Email address copied" : copied === "selected" ? "Email address selected" : ""}
          </p>
        </div>
      ) : (
        <button className="sw-btn sw-btn-primary" onClick={() => setAddress(assemble())}>
          <Mail size={18} /> Show email address
        </button>
      )}
    </div>
  );
}
