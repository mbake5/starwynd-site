"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export default function ContactEmail() {
  const [address, setAddress] = useState<string | null>(null);
  return (
    <div className="email-reveal">
      <button
        className="button reveal-email"
        aria-expanded={!!address}
        aria-controls="email-details"
        onClick={() =>
          setAddress(
            address
              ? null
              : String.fromCharCode(
                  83,
                  116,
                  97,
                  114,
                  119,
                  121,
                  110,
                  100,
                  77,
                  117,
                  115,
                  105,
                  99,
                  64,
                  112,
                  114,
                  111,
                  116,
                  111,
                  110,
                  109,
                  97,
                  105,
                  108,
                  46,
                  99,
                  111,
                  109,
                ),
          )
        }
      >
        <Mail size={18} />
        Email
      </button>
      <div id="email-details" aria-live="polite">
        {address && <a href={`mailto:${address}`}>{address}</a>}
      </div>
    </div>
  );
}
