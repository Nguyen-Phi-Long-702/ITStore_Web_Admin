import { defineConfig } from "vite";
import path from "path";
import fs from "fs";
import { Pool } from "pg";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

function resolveDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const candidatePaths = [
    path.resolve(__dirname, "../pc-hardware-ecommerce-app-server/.env"),
    path.resolve(__dirname, "../../pc-hardware-ecommerce-app-server/.env"),
    path.resolve(process.cwd(), "../pc-hardware-ecommerce-app-server/.env"),
    path.resolve(process.cwd(), "../../pc-hardware-ecommerce-app-server/.env"),
  ].filter((value, index, source) => source.indexOf(value) === index);

  for (const envPath of candidatePaths) {
    if (!fs.existsSync(envPath)) {
      continue;
    }

    const envText = fs.readFileSync(envPath, "utf8");
    const line = envText
      .split(/\r?\n/)
      .find((entry) => entry.startsWith("DATABASE_URL="));

    if (!line) {
      continue;
    }

    const value = line
      .replace("DATABASE_URL=", "")
      .trim()
      .replace(/^"|"$/g, "");
    if (value) {
      return value;
    }
  }

  return null;
}

function webadminDbPlugin() {
  let pool: Pool | null = null;
  const queryByPath: Record<string, string> = {
    "/__webadmin/db/categories":
      'SELECT id, name, slug, parent_id, created_at FROM "Categories" ORDER BY id DESC',
    "/__webadmin/db/brands":
      'SELECT id, name, logo_url, created_at FROM "Brands" ORDER BY id DESC',
    "/__webadmin/db/products":
      'SELECT id, sku, name, slug, description, category_id, brand_id, specifications, status, created_at, updated_at FROM "Products" ORDER BY id DESC',
    "/__webadmin/db/product-variants":
      'SELECT id, product_id, sku, version, color, color_hex, price, compare_at_price, stock, is_active, created_at, updated_at FROM "ProductVariants" ORDER BY id DESC',
    "/__webadmin/db/product-images":
      'SELECT id, product_id, variant_id, image_url, is_primary, sort_order FROM "ProductImages" ORDER BY id DESC',
    "/__webadmin/db/coupons":
      'SELECT id, code, discount_type, discount_value, min_order_value, max_uses, used_count, expires_at, is_active, created_at FROM "Coupons" ORDER BY id DESC',
  };

  return {
    name: "webadmin-db-fallback",
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = typeof req.url === "string" ? req.url.split("?")[0] : "";
        if (!url.startsWith("/__webadmin/db/")) {
          return next();
        }

        const dbUrl = resolveDatabaseUrl();
        if (!dbUrl) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ message: "DATABASE_URL not found" }));
          return;
        }

        if (!pool) {
          pool = new Pool({ connectionString: dbUrl });
        }

        const query = queryByPath[url];
        if (!query) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ message: "Not found" }));
          return;
        }

        try {
          const result = await pool.query(query);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.rows));
        } catch (error: any) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              message: error?.message || "Database query failed",
            }),
          );
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [webadminDbPlugin(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  assetsInclude: ["**/*.svg", "**/*.csv"],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }

          if (id.includes("node_modules/recharts")) {
            return "charts-vendor";
          }

          if (id.includes("node_modules/@radix-ui")) {
            return "radix-vendor";
          }

          if (id.includes("node_modules/lucide-react")) {
            return "icons-vendor";
          }
        },
      },
    },
  },
});
