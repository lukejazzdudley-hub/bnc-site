#!/usr/bin/env python3
"""Dev preview server with Cloudflare-Pages-style clean URLs (/privacy -> privacy.html)."""
import http.server, socketserver, os, posixpath

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        p = super().translate_path(path)
        if os.path.isdir(p):
            return p
        if os.path.exists(p):
            return p
        # clean URL: /privacy -> privacy.html
        if not os.path.splitext(p)[1] and os.path.exists(p + ".html"):
            return p + ".html"
        return p
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

os.chdir(os.path.dirname(os.path.abspath(__file__)))
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Preview: http://localhost:{PORT}")
    httpd.serve_forever()
