/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // If you're using the app router in Next.js 13+
  output: 'standalone', // This can help with Vercel deployments
}

module.exports = nextConfig