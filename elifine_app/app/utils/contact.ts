export type ContactKind = "email" | "calendly";

export type ContactLink = { href: string; text: string; opensInNewTab: boolean };

// Scrapers harvest addresses from page source (and from this public repository), so the email address and scheduling
// link must never appear whole in the source, the generated HTML, the Nuxt payload, or the JS bundles. They are kept
// as separate parts with no "@" next to any of them. The minifier constant-folds concatenations of plain string
// literals back into the whole address, so each part is stored reversed and only un-reversed in the browser.
function unreverse(reversed: string): string {
  return [...reversed].reverse().join("");
}

export function contactLink({ kind }: { kind: ContactKind }): ContactLink {
  if (kind === "email") {
    const email = `${unreverse("enif.j.e")}@${unreverse("liamg")}.com`;
    return { href: `mailto:${email}`, text: email, opensInNewTab: false };
  }
  const schedulerUrl = `https://${unreverse("yldnelac")}.com/${unreverse("enif-ile")}/30min`;
  return { href: schedulerUrl, text: "Schedule a call", opensInNewTab: true };
}
