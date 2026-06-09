#!/bin/bash
# Eliminar secrets del historial de git
git filter-branch --force --index-filter   'git rm --cached --ignore-unmatch apps/api/.env apps/web/.env'   --prune-empty --tag-name-filter cat -- --all

echo "Secrets eliminados del historial. Ahora haz push con --force."
