/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  // Add this:
  future: {
    webpack5: true,
  },
  nextConfig
};