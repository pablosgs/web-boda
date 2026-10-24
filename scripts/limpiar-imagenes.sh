#!/usr/bin/env bash
# Elimina TODOS los metadatos (EXIF, GPS, IPTC, XMP, fechas, cámara, software)
# de las imágenes de public/img y comprueba que no queda nada.
# Uso: ./scripts/limpiar-imagenes.sh
set -euo pipefail

DIR="$(cd "$(dirname "$0")/.." && pwd)/public/img"

if ! command -v exiftool >/dev/null 2>&1; then
  echo "Falta exiftool. Instálalo (brew install exiftool / sudo apt install libimage-exiftool-perl)." >&2
  exit 1
fi

shopt -s nullglob nocaseglob
FICHEROS=("$DIR"/*.jpg "$DIR"/*.jpeg "$DIR"/*.png "$DIR"/*.webp "$DIR"/*.avif)

if [ ${#FICHEROS[@]} -eq 0 ]; then
  echo "No hay imágenes en $DIR"
  exit 0
fi

exiftool -all= -overwrite_original -q "${FICHEROS[@]}"

echo "Comprobación (no debería aparecer GPS, cámara, fechas ni software):"
exiftool -a -G1 -s -gps:all -exif:all -xmp:all -iptc:all "${FICHEROS[@]}" || true
echo "Hecho."
