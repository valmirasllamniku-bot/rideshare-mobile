"use client";

import { signIn, signOut } from "next-auth/react";

export default function Hyrja({ brenda }: { brenda: boolean }) {
  if (brenda) {
    return (
      <button onClick={() => signOut({ callbackUrl: "/panel" })}>
        Dil
      </button>
    );
  }

  return (
    <button onClick={() => signIn("github", { callbackUrl: "/panel" })}>
      Hyr me GitHub
    </button>
  );
}