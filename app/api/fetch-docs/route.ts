// S.I.R.T. — /api/fetch-docs
// Accepts a POST with { docsUrl: string }, fetches the URL server-side,
// strips HTML, and returns cleaned text content for use in the prompt engine.
//
// Error handling:
//   400 — invalid or missing URL
//   422 — non-text content type
//   502 — fetch failed or upstream error
//   504 — timeout (10s)
//
// Static mode note:
//   When DEPLOY_MODE=static this route is not available. The frontend falls back
//   to a graceful degradation message — public doc context is skipped at generation.

import { NextRequest, NextResponse } from "next/server";
import dns from "dns/promises";

const FETCH_TIMEOUT_MS = 10_000;
const MAX_CONTENT_LENGTH = 50_000; // chars

const HEADERS = { "X-SIRT-Version": "1.1" };

// Allowlist of permitted root domains for documentation fetching.
// Covers all vendors in the tool library (lib/constants/tool-library.ts).
// When a new tool is added to the library, add its root domain here too.
const ALLOWED_DOC_DOMAINS = new Set([
  "splunk.com", "microsoft.com", "ibm.com", "elastic.co",
  "logrhythm.com", "exabeam.com", "microfocus.com", "securonix.com",
  "devo.com", "rapid7.com", "google.com", "fortinet.com",
  "att.com", "manageengine.com", "paloaltonetworks.com", "checkpoint.com",
  "cisco.com", "juniper.net", "sophos.com", "watchguard.com",
  "sonicwall.com", "barracuda.com", "netgate.com", "crowdstrike.com",
  "sentinelone.com", "broadcom.com", "cybereason.com", "trendmicro.com",
  "eset.com", "malwarebytes.com", "harfanglab.io", "blackberry.com",
  "bitdefender.com", "okta.com", "cyberark.com", "beyondtrust.com",
  "sailpoint.com", "pingidentity.com", "onelogin.com", "jumpcloud.com",
  "forgerock.com", "hashicorp.com", "saviyntcloud.com", "tenable.com",
  "qualys.com", "greenbone.net", "wiz.io", "orcasecurity.io",
  "lacework.net", "darktrace.com", "vectra.ai", "corelight.com",
  "zeek.org", "readthedocs.io", "snort.org", "arkime.com",
  "netwitness.com", "extrahop.com", "gigamon.com", "misp-project.org",
  "anomali.com", "recordedfuture.com", "threatconnect.com", "opencti.io",
  "virustotal.com", "alienvault.com", "mandiant.com", "proofpoint.com",
  "mimecast.com", "abnormal.ai", "cofense.com", "amazon.com",
  "prismacloud.io",
]);

function getRootDomain(hostname: string): string {
  const parts = hostname.split(".");
  return parts.slice(-2).join(".");
}

export async function POST(request: NextRequest) {
  let docsUrl: string;

  try {
    const body = await request.json();
    docsUrl = body?.docsUrl;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400, headers: HEADERS });
  }

  if (!docsUrl || typeof docsUrl !== "string") {
    return NextResponse.json({ error: "Missing docsUrl" }, { status: 400, headers: HEADERS });
  }

  // Validate URL — https only, no private/loopback targets
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(docsUrl);
    if (parsedUrl.protocol !== "https:") {
      return NextResponse.json(
        { error: "Only https:// URLs are supported" },
        { status: 400, headers: HEADERS }
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400, headers: HEADERS });
  }

  // Domain allowlist — only permit known security vendor documentation domains.
  // Prevents IP disclosure via attacker-controlled domains.
  const hostname = parsedUrl.hostname;
  if (!ALLOWED_DOC_DOMAINS.has(getRootDomain(hostname))) {
    return NextResponse.json(
      { error: "Domain not permitted. Only security tool documentation URLs are supported." },
      { status: 400, headers: HEADERS }
    );
  }

  // SSRF guard — block private IP ranges and localhost (second layer after allowlist)
  const privatePatterns = [
    /^localhost$/i,
    /^127\./,
    /^10\./,
    /^192\.168\./,
    /^172\.(1[6-9]|2\d|3[01])\./,
    /^::1$/,
    /^0\.0\.0\.0$/,
    /^169\.254\./,
  ];
  if (privatePatterns.some((re) => re.test(hostname))) {
    return NextResponse.json(
      { error: "Private or loopback addresses are not permitted" },
      { status: 400, headers: HEADERS }
    );
  }

  // DNS resolution check — prevents CNAME/domain rebinding bypass
  // Resolves the hostname to actual IPs and re-checks against private ranges
  const [ipv4Result, ipv6Result] = await Promise.allSettled([
    dns.resolve4(hostname),
    dns.resolve6(hostname),
  ]);
  const resolvedIPs = [
    ...(ipv4Result.status === "fulfilled" ? ipv4Result.value : []),
    ...(ipv6Result.status === "fulfilled" ? ipv6Result.value : []),
  ];
  if (resolvedIPs.length === 0) {
    return NextResponse.json(
      { error: "Could not resolve hostname" },
      { status: 400, headers: HEADERS }
    );
  }
  if (resolvedIPs.some((ip) => privatePatterns.some((re) => re.test(ip)))) {
    return NextResponse.json(
      { error: "Private or loopback addresses are not permitted" },
      { status: 400, headers: HEADERS }
    );
  }

  // Fetch with timeout
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(parsedUrl.toString(), {
      signal: controller.signal,
      headers: {
        "User-Agent": "SIRT-DocFetcher/1.0",
        Accept: "text/html,text/plain,application/xhtml+xml",
      },
    });

    clearTimeout(timer);

    if (!response.ok) {
      console.error("[SIRT] fetch-docs: upstream error", { status: response.status, source: parsedUrl.hostname });
      return NextResponse.json(
        { error: `Upstream returned ${response.status}` },
        { status: 502, headers: HEADERS }
      );
    }

    const contentType = response.headers.get("content-type") ?? "";
    const isText =
      contentType.includes("text/") ||
      contentType.includes("application/xhtml") ||
      contentType.includes("application/json");

    if (!isText) {
      return NextResponse.json(
        { error: `Non-text content type: ${contentType}` },
        { status: 422, headers: HEADERS }
      );
    }

    const raw = await response.text();

    const cleaned = raw
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&[a-z]+;/gi, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, MAX_CONTENT_LENGTH);

    return NextResponse.json(
      { content: cleaned, source: parsedUrl.hostname, charCount: cleaned.length },
      { headers: HEADERS }
    );
  } catch (err) {
    clearTimeout(timer);

    if (err instanceof Error && err.name === "AbortError") {
      console.error("[SIRT] fetch-docs: timeout", { source: parsedUrl.hostname });
      return NextResponse.json(
        { error: "Request timed out after 10s" },
        { status: 504, headers: HEADERS }
      );
    }

    console.error("[SIRT] fetch-docs error", { errorType: err instanceof Error ? err.name : "unknown" });
    return NextResponse.json(
      { error: "Failed to fetch documentation" },
      { status: 502, headers: HEADERS }
    );
  }
}
