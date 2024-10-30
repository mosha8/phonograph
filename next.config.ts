import { NextConfig } from 'next';

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.BUNDLE_ANALYZER === 'true',
});
/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  output: 'standalone',
  reactStrictMode: true,
};

module.exports = withBundleAnalyzer(nextConfig);
