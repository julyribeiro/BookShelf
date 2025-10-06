// next.config.ts

import { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ebayimg.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "cdn.kobo.com",
      },
      {
        protocol: "https",
        hostname: "www.obrasdarte.com",
      },
      {
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
      },
      {
        protocol: "https",
        hostname: "**.mlstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "outro-dominio.com",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
      {
        protocol: "https",
        hostname: "m.magazineluiza.com.br",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "abbapress.com.br",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
