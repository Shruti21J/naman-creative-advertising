import os
import re
from urllib.parse import unquote

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
html = open(os.path.join(root, "index.html"), encoding="utf-8").read()
js = open(os.path.join(root, "js", "script.js"), encoding="utf-8").read()
css = open(os.path.join(root, "css", "style.css"), encoding="utf-8").read()

refs = set()
for src in re.findall(r'(?:src|data-src|href)="([^"]+)"', html):
    if "images/" in src:
        refs.add(unquote(src.split("?")[0]))
for m in re.findall(r"image:\s*'([^']+)'", js):
    refs.add(m)

print("Referenced images:", len(refs))
missing = []
for r in sorted(refs):
    path = os.path.join(root, r.replace("/", os.sep))
    if not os.path.isfile(path):
        missing.append(r)
        print("MISSING:", r)
    else:
        print("OK:", r)

print("\nMissing count:", len(missing))

all_files = []
img_root = os.path.join(root, "images")
for dirpath, _, files in os.walk(img_root):
    for f in files:
        if f.lower().endswith((".png", ".jpg", ".jpeg", ".svg", ".webp")):
            rel = os.path.relpath(os.path.join(dirpath, f), root).replace("\\", "/")
            all_files.append(rel)

print("On-disk image files:", len(all_files))
used = set(refs)
unused = [f for f in all_files if f not in used]
print("Unused image files:")
for u in unused:
    print(" ", u)
