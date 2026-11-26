"use client";

import { signIn, signOut } from "next-auth/react";

const stilButoni: React.CSSProperties = {
  border: 0,
  borderRadius: 8,
  padding: "10px 16px",
  background: "#ed7b25",
  color: "#fff",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
};

export default function Hyrja({ brenda }: { brenda: boolean }) {
  if (brenda) {
    return (
      <button
        style={stilButoni}
        onClick={() => signOut({ callbackUrl: "/panel" })}
      >
        Dil
      </button>
    );
  }

  return (
    <button
      style={stilButoni}
      onClick={() => signIn("github", { callbackUrl: "/panel" })}
    >
      Hyr me GitHub
    </button>
  );
}