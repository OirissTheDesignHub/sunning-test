Project structure and production deployment notes

Files

- `index.html` — Home page
- `about.html` — About Us
- `services.html` — Services listing
- `service.html` — Single service detail
- `contact.html` — Contact page

Assets

- `css/` — styles (`main.css`, `responsive.css`, `animations.css`, `slider.css`)
- `media/` — images and icons
- `scripts/` — vanilla JavaScript used by the site

Production readiness checklist

- **Sitemap**: `sitemap.xml` was added at the project root. Replace the placeholder `https://example.com` values with your real production URL before submitting the sitemap to search engines.
- **Robots**: `robots.txt` was added and points to `/sitemap.xml`.
- **404 page**: `404.html` exists and includes a button back to the home page.
- **CI/CD**: A GitHub Actions workflow was added at `.github/workflows/deploy.yml` to publish the site to the `gh-pages` branch on push to `main`.

Recommended next steps before deploying

- Replace placeholder URLs in `sitemap.xml` with your production domain.
- Optimize images: convert large PNG/SVG to compressed WebP/optimized SVGs and enable `loading="lazy"` where appropriate.
- Minify CSS/JS and add a simple build step (optional) if you plan to automate asset optimization.
- Configure caching and gzip/Brotli compression on your hosting provider (Netlify, Vercel, or your server).
- Add HTTPS and, if needed, a custom domain. For GitHub Pages add a `CNAME` file with your domain.
- Validate markup and run Lighthouse for performance, accessibility, and best practices.

Deployment options

- **GitHub Pages** (recommended for simple static sites)

  1. Push the repo to GitHub and ensure the main branch is named `main`.
  2. The included workflow publishes the repository content to `gh-pages` on push to `main` using `peaceiris/actions-gh-pages`.
  3. After the first deploy, enable GitHub Pages in repo settings (source: `gh-pages` branch) and set a custom domain if needed.
- **Netlify**

  1. Create a new site from Git and point to the repo.
  2. No build command required for this static project; set publish directory to `/`.
  3. Netlify will provide HTTPS and options for redirects and headers for caching.
- **Vercel**

  1. Import the repository into Vercel.
  2. Vercel detects static projects and will deploy automatically.

Notes

- If you want me to add image optimization, CSS/JS minification, or a full build pipeline (e.g., `npm` + `parcel`/`esbuild`/`webpack`), tell me which tool you prefer and I can scaffold it.

Hosting on Hostinger (step-by-step)

These instructions assume you have a Hostinger account and either a registered domain or will use the temporary Hostinger URL. Follow the steps below to publish this static site to Hostinger.

1) Prepare the project

- Ensure `index.html` is at the project root and all site files and folders (e.g., `css/`, `media/`, `scripts/`, `404.html`, `robots.txt`, `sitemap.xml`) are present.
- Optional: run image optimization and minification locally before upload to reduce bandwidth and speed up load times.

2) Upload using hPanel File Manager (recommended for quick deploy)

- Log in to Hostinger and open **hPanel** > **Files** > **File Manager**.
- In the File Manager navigate to `public_html` (this is the web root for your primary domain).
- Click **Upload** and upload the site files and folders. You can also upload a single ZIP archive of the project and use **Extract** to place files into `public_html`.
- After upload, verify `index.html`, `404.html`, `robots.txt`, and `sitemap.xml` are in `public_html`.

3) Upload using FTP / SFTP (FileZilla example)

- In hPanel create an FTP account (if you don't already have one) under **Files** > **FTP Accounts**.
- Open FileZilla and configure a new site with the credentials from hPanel:

```text
Host: ftp.your-domain.com  (or the server IP shown in hPanel)
Protocol: SFTP (recommended) or FTP
Port: 22 for SFTP or 21 for FTP
Username: (your ftp username)
Password: (your ftp password)
```

- Connect and upload all files and folders into the `public_html` directory.
- Set file permissions (644 for files, 755 for directories) if needed.

4) Configure domain and DNS

- If your domain is registered elsewhere, update the A record to point to your Hostinger server IP (found in hPanel) or change nameservers to Hostinger's nameservers as instructed in hPanel.
- If using Hostinger domain management, add the domain to the account and point it to the `public_html` site.

5) Enable SSL (HTTPS)

- In hPanel go to **SSL** and enable the free Let's Encrypt certificate for your domain (single click on most plans).
- After issuance, make sure HTTPS is working. Optionally add an automatic redirect to HTTPS using `.htaccess` (see snippet below).

6) Custom 404 and search engine files

- Ensure `404.html` is uploaded and reachable at `https://your-domain.com/404.html`.
- Add this line to `.htaccess` (create or edit `.htaccess` in `public_html`) to use your custom error page:

```apache
ErrorDocument 404 /404.html
```

- Upload `robots.txt` and `sitemap.xml` to `public_html`. Verify they are accessible: `https://your-domain.com/robots.txt` and `https://your-domain.com/sitemap.xml`.

7) Recommended `.htaccess` snippets (compression, caching, force HTTPS)

- Force HTTPS and remove `www` (adjust rules if you prefer `www`):

```apache
<IfModule mod_rewrite.c>
	RewriteEngine On
	RewriteCond %{HTTPS} !=on
	RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

- Gzip compression (if supported by Hostinger's Apache):

```apache
<IfModule mod_deflate.c>
	AddOutputFilterByType DEFLATE text/plain text/html text/xml text/css application/javascript application/json image/svg+xml
</IfModule>
```

- Browser caching (Expires headers):

```apache
<IfModule mod_expires.c>
	ExpiresActive On
	ExpiresByType text/css "access plus 1 month"
	ExpiresByType application/javascript "access plus 1 month"
	ExpiresByType image/jpeg "access plus 1 year"
	ExpiresByType image/png "access plus 1 year"
	ExpiresByType image/webp "access plus 1 year"
	ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

8) Test after deploy

- Visit your site root (`https://your-domain.com`) and test key pages.
- Test the 404 by visiting a non-existent URL: `https://your-domain.com/not-exists`.
- Verify `robots.txt` and `sitemap.xml` are accessible.
- Run Lighthouse (Chrome DevTools) and check performance, accessibility, and best practices.

9) Optional: automated deploy via Git (Hostinger Git or CI)

- Hostinger supports Git deployment on some plans; alternatively continue using GitHub Actions to build and push an optimized site zip to Hostinger via FTP (you can add an FTP deploy step to the CI workflow).

10) Checklist

- [ ] `index.html` present in `public_html`
- [ ] `404.html`, `robots.txt`, `sitemap.xml` uploaded
- [ ] SSL enabled and HTTPS redirect in place
- [ ] `.htaccess` added with caching/compression rules (if desired)
- [ ] Images optimized and assets minified for production

If you want, I can:

- Generate a ready-to-upload ZIP with minified CSS/JS and optimized images.
- Add an FTP deploy step to the existing GitHub Actions workflow so pushing to `main` uploads the site automatically to Hostinger.
- Create the `.htaccess` file and test it for you.
