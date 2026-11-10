#!/usr/bin/env bash
# Hook SessionStart: su stdout se inyecta en el contexto de Claude. Mantenerlo corto. Siempre exit 0.
RAIZ="${CLAUDE_PROJECT_DIR:-.}"
VERSION=""; [ -f "$RAIZ/.claude/VERSION" ] && VERSION=$(tr -d "[:space:]" < "$RAIZ/.claude/VERSION")
echo "[STEADFETCH] Plantilla v${VERSION:-desconocida}"
if [ -f "$RAIZ/.claude/memory/learned-rules.md" ]; then
  cat "$RAIZ/.claude/memory/learned-rules.md"
else
  echo "Sin reglas aprendidas aún"
fi
if [ -f "$RAIZ/.claude/memory/violations.jsonl" ]; then
  tail -n 5 "$RAIZ/.claude/memory/violations.jsonl"
fi
exit 0
