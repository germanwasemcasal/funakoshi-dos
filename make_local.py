from pathlib import Path

root = Path(r'C:\Users\Administrator\Desktop\funakoshi dos')
html_path = root / 'index.html'
text = html_path.read_text(encoding='utf-8')

text = text.replace('<link rel="preconnect" href="https://cdn.jsdelivr.net" />\n', '')
text = text.replace('<link href="https://cdn.jsdelivr.net/npm/@fontsource/inter@5.1.0/index.css" rel="stylesheet" />\n', '')
text = text.replace('<link href="https://cdn.jsdelivr.net/npm/@fontsource/playfair-display@5.1.0/index.css" rel="stylesheet" />\n', '')
text = text.replace('<script src="https://cdn.tailwindcss.com"></script>\n', '')
text = text.replace('src="https://www.openstreetmap.org/export/embed.html?bbox=-56.86%2C-37.12%2C-56.82%2C-37.09&layer=mapnik&marker=-37.105%2C-56.84"', 'src="assets/images/1e9229664-5e9c-4f97-9ab2-ef7b3d130811.png"')
text = text.replace('https://wa.me/5491100000000', 'mailto:contacto@funakoshidojo.com')

html_path.write_text(text, encoding='utf-8')
print('Updated HTML to remove external CDN and link dependencies.')
