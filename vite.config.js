import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Serverless API handler runner for Vite dev server
function apiDevMiddleware() {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const parsedUrl = new URL(req.url, 'http://localhost:3000');
        req.query = Object.fromEntries(parsedUrl.searchParams);

        const routeApi = async (modPath) => {
          try {
            const mod = await import(`${modPath}?t=${Date.now()}`);
            const handler = mod.default;

            const executeHandler = async () => {
              res.status = (code) => {
                res.statusCode = code;
                return res;
              };
              res.json = (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              };
              await handler(req, res);
            };

            if (req.method === 'GET' || req.method === 'OPTIONS' || req.method === 'HEAD') {
              req.body = req.body || {};
              await executeHandler();
            } else {
              let bodyStr = '';
              req.on('data', chunk => { bodyStr += chunk; });
              req.on('end', async () => {
                try {
                  req.body = bodyStr ? JSON.parse(bodyStr) : {};
                } catch {
                  req.body = bodyStr;
                }
                await executeHandler();
              });
            }
          } catch (err) {
            console.error(`Dev API Error for ${modPath}:`, err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, message: err.message }));
          }
        };

        if (parsedUrl.pathname.startsWith('/api/trendyol')) {
          await routeApi('./api/trendyol.js');
          return;
        }

        if (parsedUrl.pathname.startsWith('/api/hepsiburada')) {
          await routeApi('./api/hepsiburada.js');
          return;
        }

        if (parsedUrl.pathname.startsWith('/api/cloud-sync')) {
          await routeApi('./api/cloud-sync.js');
          return;
        }

        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), apiDevMiddleware()],
  server: {
    port: 3000,
    open: false
  }
})
