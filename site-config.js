// Public contact details only. Add an email/address only with the operator's approval.
// Every page keeps working contact links without JavaScript or a successful config fetch.
(() => {
  const configUrl = new URL("site-config.json", document.currentScript.src);
  const email = value => typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? value.trim() : null;
  const httpsUrl = value => {
    try { const url = new URL(value); return url.protocol === "https:" ? url.href : null; }
    catch { return null; }
  };
  fetch(configUrl).then(response => {
    if (!response.ok) throw new Error("Unavailable");
    return response.json();
  }).then(config => {
    for (const node of document.querySelectorAll("[data-site-field]")) {
      const value = config[node.dataset.siteField];
      if (typeof value === "string" && value.trim()) node.textContent = value.trim();
    }
    const supportEmail = email(config.supportEmail);
    const privacyEmail = email(config.privacyEmail) || supportEmail;
    const supportUrl = httpsUrl(config.supportUrl);
    for (const node of document.querySelectorAll("[data-support-link], [data-privacy-link]")) {
      const address = node.hasAttribute("data-privacy-link") ? privacyEmail : supportEmail;
      if (address) {
        const q = node.href.startsWith("mailto:") ? node.href.indexOf("?") : -1;
        node.href = `mailto:${address}${q >= 0 ? node.href.slice(q) : ""}`;
        if (node.hasAttribute("data-show-address")) node.textContent = address;
      } else if (supportUrl) { node.href = supportUrl; }
    }
  }).catch(() => { /* The static contact links remain available. */ });
})();
