from functools import partial
from http.client import HTTPConnection
from pathlib import Path
from tempfile import TemporaryDirectory
from threading import Thread
import socketserver
import unittest

from serve import Handler


class DevServerRangeTest(unittest.TestCase):
    def test_serves_single_byte_ranges_for_scroll_seekable_media(self) -> None:
        with TemporaryDirectory() as directory:
            payload = b"0123456789"
            Path(directory, "clip.mp4").write_bytes(payload)
            server = socketserver.ThreadingTCPServer(
                ("127.0.0.1", 0),
                partial(Handler, directory=directory),
            )
            thread = Thread(target=server.serve_forever, daemon=True)
            thread.start()
            try:
                connection = HTTPConnection("127.0.0.1", server.server_address[1])
                connection.request("GET", "/clip.mp4", headers={"Range": "bytes=2-5"})
                response = connection.getresponse()

                self.assertEqual(response.status, 206)
                self.assertEqual(response.getheader("Accept-Ranges"), "bytes")
                self.assertEqual(response.getheader("Content-Range"), "bytes 2-5/10")
                self.assertEqual(response.read(), b"2345")
            finally:
                server.shutdown()
                server.server_close()
                thread.join(timeout=2)


if __name__ == "__main__":
    unittest.main()
