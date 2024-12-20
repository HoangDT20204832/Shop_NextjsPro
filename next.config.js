/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // ĐỊnh nghĩa đường dẫn để chấp nhận hình ảnh từ bên thứ 3(Google, Facebook, Twitter)
  images: { 
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*lh3.googleusercontent.com",
        port: "",
        pathname: "**",
      },
    ]
  }
}

module.exports = nextConfig

