const restheartUrl = process.env.RESTHEART_URL ?? 'http://localhost:8080';
// redireciona as requisicoes pro rest heart
module.exports = {
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${restheartUrl}/:path*` }];
  },
};
