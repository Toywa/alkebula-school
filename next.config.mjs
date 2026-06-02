/** @type {import('next').NextConfig} */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

let supabaseHost = "";
try {
  supabaseHost = supabaseUrl ? new URL(supabaseUrl).host : "";
} catch {
  supabaseHost = "";
}

const connectSources = [
  "'self'",
  supabaseHost ? `https://${supabaseHost}` : "",
  supabaseHost ? `wss://${supabaseHost}` : "",
  "https://api.resend.com",
].filter(Boolean);

const imageSources = [
  "'self'",
  "data:",
  "blob:",
  supabaseHost ? `https://${supabaseHost}` : "",
].filter(Boolean);

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src ${imageSources.join(" ")}`,
  "font-src 'self' data:",
  `connect-src ${connectSources.join(" ")}`,
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "frame-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: csp,
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), accelerometer=(), gyroscope=(), magnetometer=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;