/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ebayimg.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.kobo.com',
      },
      {
        protocol: 'https',
        hostname: 'www.obrasdarte.com',
      },
      {
        protocol: 'https',
        hostname: 'images-na.ssl-images-amazon.com',
      },

      {
    protocol: "https", 
    hostname: "**.mlstatic.com" 
      },
  
      {
    protocol: "https",
    hostname: "outro-dominio.com"
   },
],
},
};

module.exports = nextConfig;