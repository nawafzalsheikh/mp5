"use client";

import { useState, type FormEvent } from "react";

export default function UrlForm() {
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setShortUrl("");
    setError("");
    setSaving(true);

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: form.get("url"), alias: form.get("alias") }),
      });
      const result = await response.json();

      if (response.ok) {
        setShortUrl(window.location.origin + "/r/" + result.alias);
      } else {
        setError(result.error);
      }
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="url">Original URL</label>
        <input id="url" name="url" type="url" placeholder="https://www.bu.edu/" required />
        <label htmlFor="alias">Alias</label>
        <input id="alias" name="alias" type="text" placeholder="bu" required aria-describedby="alias-help" />
        <small id="alias-help">Use letters, numbers, hyphens, or underscores.</small>
        <button type="submit" disabled={saving}>{saving ? "Saving…" : "Shorten URL"}</button>
      </form>
      {error && <p role="alert">{error}</p>}
      {shortUrl && (
        <p>
          Your short URL<br />
          <a href={shortUrl}>{shortUrl}</a>
        </p>
      )}
    </>
  );
}
