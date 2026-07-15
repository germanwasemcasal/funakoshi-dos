import os
import re
import hashlib
from pathlib import Path
from urllib.parse import urlparse, unquote
from urllib.request import urlretrieve

root = Path(r'C:\Users\Administrator\Desktop\funakoshi dos')
html_path = root / 'index.html'
assets_dir = root / 'assets' / 'images'
assets_dir.mkdir(parents=True, exist_ok=True)

text = html_path.read_text(encoding='utf-8')
image_exts = ('.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.bmp')

patterns = [
    (re.compile(r'(src=["\'])(https?://[^"\']+)(["\'])'), 'src'),
    (re.compile(r'(url\()(["\']?)(https?://[^"\')]+)(\2)(\))'), 'url'),
]

seen = {}


def download_and_replace(match, kind):
    if kind == 'src':
        prefix, url, suffix = match.group(1), match.group(2), match.group(3)
    else:
        prefix, quote, url, _, suffix = match.group(1), match.group(2), match.group(3), match.group(4), match.group(5)
        if not quote:
            quote = ''

    parsed = urlparse(url)
    path_name = unquote(Path(parsed.path).name)
    ext = os.path.splitext(path_name)[1].lower()
    if not path_name or ext not in image_exts:
        return match.group(0)

    if url in seen:
        local_name = seen[url]
    else:
        filename = path_name
        if not filename:
            filename = hashlib.md5(url.encode('utf-8')).hexdigest() + '.jpg'
        if os.path.splitext(filename)[1].lower() not in image_exts:
            filename = filename + '.jpg'
        local_path = assets_dir / filename
        if not local_path.exists():
            urlretrieve(url, local_path)
        seen[url] = filename
        local_name = filename

    rel = f'assets/images/{local_name}'
    if kind == 'src':
        return f'{prefix}{rel}{suffix}'
    return f'{prefix}{quote}{rel}{quote}{suffix}'

for pattern, kind in patterns:
    text = pattern.sub(lambda m: download_and_replace(m, kind), text)

html_path.write_text(text, encoding='utf-8')
print(f'Downloaded and replaced {len(seen)} image(s) into {assets_dir}')
for old, new in seen.items():
    print(f'{old} -> {new}')
