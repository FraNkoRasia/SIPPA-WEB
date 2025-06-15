/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Desactiva la optimización de imágenes de Next.js
  images: {
    unoptimized: true,
  },
  // Asegurarse de que Next.js pueda manejar las importaciones de MUI y otros paquetes
  transpilePackages: [
    '@mui/material',
    '@mui/lab',
    '@mui/icons-material',
    '@emotion/react',
    '@emotion/styled'
  ]
};

module.exports = nextConfig;
