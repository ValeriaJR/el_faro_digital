import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
BUILD = ROOT / "build"

head_common = (BUILD / "head_common.html").read_text(encoding="utf-8")
header = (BUILD / "header.html").read_text(encoding="utf-8")
footer = (BUILD / "footer.html").read_text(encoding="utf-8")

COMMON_SCRIPTS = [
    "assets/js/storage.js",
    "assets/js/admin-store.js",
    "assets/js/toast.js",
    "assets/js/data-service.js",
    "assets/js/render.js",
    "assets/js/validate.js",
    "assets/js/nav.js",
]

PAGES = [
    {
        "file": "index.html",
        "title": "El Faro Digital · Inicio",
        "page": "inicio",
        "content": "content_index.html",
        "script": "assets/js/home.js",
    },
    {
        "file": "explorar.html",
        "title": "Explorar Noticias y Experiencias · El Faro Digital",
        "page": "explorar-noticias",
        "content": "content_explorar.html",
        "script": "assets/js/explorar.js",
    },
    {
        "file": "noticia.html",
        "title": "Detalle de Noticia · El Faro Digital",
        "page": "noticia-destacada",
        "content": "content_noticia.html",
        "script": "assets/js/noticia.js",
    },
    {
        "file": "favoritos.html",
        "title": "Mis Favoritos · El Faro Digital",
        "page": "mis-favoritos",
        "content": "content_favoritos.html",
        "script": "assets/js/favoritos.js",
    },
    {
        "file": "contacto.html",
        "title": "Gestión Editorial y Contacto · El Faro Digital",
        "page": "gestion-y-contacto",
        "content": "content_contacto.html",
        "script": "assets/js/gestion.js",
    },
]

for page in PAGES:
    content = (BUILD / page["content"]).read_text(encoding="utf-8")
    scripts_html = "\n".join(f'<script src="{s}"></script>' for s in COMMON_SCRIPTS)
    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<title>{page['title']}</title>
{head_common}
</head>
<body class="bg-surface font-body-md text-on-surface antialiased" data-page="{page['page']}">
{header}
{content}
{footer}
{scripts_html}
<script src="{page['script']}"></script>
</body>
</html>
"""
    (ROOT / page["file"]).write_text(html, encoding="utf-8")
    print(f"Generado: {page['file']}")
