// The email address and scheduling link are assembled client-side so scrapers reading the raw HTML
// (including the serialized Nuxt payload) never see them. They're assembled from parts here too, so this
// public test code doesn't hand scrapers the same strings it protects the site from leaking.
const emailUser = "e.j.fine";
const emailDomain = "gmail";
const schedulerHost = "calendly";
const schedulerUser = "eli-fine";

export const CONTACT_EMAIL = `${emailUser}@${emailDomain}.com`;
export const SCHEDULER_LINK = `${schedulerHost}.com/${schedulerUser}`;
