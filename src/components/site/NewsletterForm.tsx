"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Front-only for now: validates the address and thanks the visitor, stores nothing. */
export function NewsletterForm() {
  const [error, setError] = useState<string>();
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();
    if (!EMAIL.test(email)) {
      setDone(false);
      setError("Enter a valid email address");
      return;
    }
    setError(undefined);
    setDone(true);
    form.reset();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col items-start gap-4 pt-4">
      <p className="text-label-strong text-white">Weekly curator drops</p>
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@artist.com"
        helper="New playlists open to submissions, every Monday."
        error={error}
      />
      <Button type="submit" variant="secondary">
        Subscribe
      </Button>
      <p role="status" className="text-body-sm text-cyan">
        {done ? "Thanks! Curator drops are coming soon." : ""}
      </p>
    </form>
  );
}
