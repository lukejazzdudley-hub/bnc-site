#!/usr/bin/env python3
"""Dev preview server with clean URLs and seekable media responses."""
import http.server
import os
import re
import socketserver

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    _byte_range = None

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
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def send_head(self):
        range_header = self.headers.get("Range")
        path = self.translate_path(self.path)
        if not range_header or os.path.isdir(path):
            self._byte_range = None
            return super().send_head()

        match = re.fullmatch(r"bytes=(\d*)-(\d*)", range_header.strip())
        if not match:
            self.send_error(400, "Malformed byte range")
            return None

        try:
            source = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        size = os.fstat(source.fileno()).st_size
        first, last = match.groups()
        if first:
            start = int(first)
            end = min(int(last), size - 1) if last else size - 1
        elif last:
            length = min(int(last), size)
            start = size - length
            end = size - 1
        else:
            source.close()
            self.send_error(400, "Malformed byte range")
            return None

        if start < 0 or start >= size or end < start:
            source.close()
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{size}")
            self.send_header("Content-Length", "0")
            self.end_headers()
            return None

        self._byte_range = (start, end)
        source.seek(start)
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Content-Length", str(end - start + 1))
        self.send_header("Last-Modified", self.date_time_string(os.fstat(source.fileno()).st_mtime))
        self.end_headers()
        return source

    def copyfile(self, source, outputfile):
        if self._byte_range is None:
            return super().copyfile(source, outputfile)
        remaining = self._byte_range[1] - self._byte_range[0] + 1
        while remaining:
            chunk = source.read(min(64 * 1024, remaining))
            if not chunk:
                break
            outputfile.write(chunk)
            remaining -= len(chunk)


def main():
    root = os.path.dirname(os.path.abspath(__file__))
    handler = lambda *args, **kwargs: Handler(*args, directory=root, **kwargs)
    with socketserver.ThreadingTCPServer(("", PORT), handler) as httpd:
        print(f"Preview: http://localhost:{PORT}")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
