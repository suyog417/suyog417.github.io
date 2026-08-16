import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export into ./out — GitHub Pages serves files, not a Node server.
  output: "export",

  // /work/qwish -> /work/qwish/index.html, which is what Pages resolves.
  trailingSlash: true,

  // The default image loader needs a server. Everything here is already
  // sized for its slot, so ship the files as they are.
  images: { unoptimized: true },
};

export default nextConfig;
