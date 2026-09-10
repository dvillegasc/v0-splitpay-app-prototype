"""
Agente Verificador para SplitPay (frontend). Ver la versión del backend para
la explicación completa; aquí cambian las señales objetivas (`next build` /
`next lint` en vez de `pytest` / `alembic`) y el checklist de revisión.
"""

import json
import os
import subprocess
import sys

from google import genai

REVIEWER_API_KEY = os.environ["REVIEWER_API_KEY"]
REVIEWER_MODEL = os.environ.get("REVIEWER_MODEL", "gemini-2.0-flash")

BUILD_PASSED = os.environ.get("BUILD_PASSED", "false").lower() == "true"
LINT_PASSED = os.environ.get("LINT_PASSED", "false").lower() == "true"
PR_NUMBER = os.environ["PR_NUMBER"]

MAX_AUTO_FIX_ATTEMPTS = 2

client = genai.Client(api_key=REVIEWER_API_KEY)

REVIEW_CHECKLIST = """
Actúa como Principal Engineer haciendo code review de un Pull Request para el
frontend de SplitPay (Next.js App Router, React, TypeScript, Tailwind), una
fintech de división de gastos que opera bajo una regla legal inamovible de
"Cero Custodia": la UI nunca debe insinuar que SplitPay retiene o procesa
dinero directamente; los flujos de pago solo abren enlaces hacia billeteras
externas (Nequi, etc.), nunca deben simular una transacción interna.

Revisa el diff adjunto exclusivamente por:
1. Violaciones al principio de Cero Custodia en textos de UI o lógica (copy que
   sugiera "tu saldo en SplitPay", botones que simulen procesar el pago en vez
   de redirigir a la billetera externa, etc.).
2. Datos mock/hardcodeados (ids de usuario ficticios, nombres quemados) que
   deberían venir de la API real, cuando la tarea implica integrarse con ella.
3. Tipos de TypeScript que no calcen con lo que el backend realmente retorna:
   en particular, todo campo monetario (montos, ingresos, porcentajes) y las
   llaves/valores de objetos tipo `Record<string, string>` DEBEN tiparse como
   `string`, nunca `number`, porque el backend serializa `Decimal` como string.
4. Manejo de errores que lea una forma de respuesta distinta a la real de
   FastAPI (`{"detail": ...}`, no `{"message": ...}`).
5. Artefactos de generación truncada: JSX incompleto, imports rotos, cadenas o
   template literals sin cerrar.

Ignora estilo de código o preferencias subjetivas de formato.

Responde ÚNICAMENTE con un objeto JSON con esta forma exacta, sin texto
adicional, sin backticks de Markdown:
{
  "veredicto": "aprobado" | "cambios_requeridos",
  "comentarios": ["hallazgo 1", "hallazgo 2"],
  "correcciones": {"ruta/al/archivo.tsx": "contenido COMPLETO corregido del archivo"}
}
El campo "correcciones" debe incluir ÚNICAMENTE archivos donde tengas alta
confianza en el arreglo exacto y completo. Si no aplica ninguna corrección
directa, debe ser un objeto vacío {}. Nunca dejes "correcciones" con un
archivo a medio escribir.
"""


def run_git(*args: str) -> str:
    result = subprocess.run(["git", *args], capture_output=True, text=True, check=True)
    return result.stdout


def gh(*args: str) -> None:
    result = subprocess.run(["gh", *args], capture_output=True, text=True)
    if result.returncode != 0:
        print(f"⚠️ Comando gh falló: {' '.join(args)}\n{result.stderr}")


def read_tail(path: str, max_chars: int) -> str:
    if not os.path.exists(path):
        return "(sin salida)"
    with open(path, "r", encoding="utf-8", errors="replace") as f:
        return f.read()[-max_chars:]


def count_previous_fix_attempts() -> int:
    log = subprocess.run(
        ["git", "log", "--oneline", "--grep=Corrección aplicada por el agente verificador"],
        capture_output=True, text=True,
    ).stdout
    return len([line for line in log.splitlines() if line.strip()])


def main() -> None:
    diff = read_tail("pr_diff.txt", 60_000)
    build_output = read_tail("build_output.txt", 4_000)
    lint_output = read_tail("lint_output.txt", 2_000)

    if not BUILD_PASSED:
        comment = (
            "❌ **El agente verificador bloqueó este PR: `next build` falló.**\n\n"
            f"<details><summary>Salida del build</summary>\n\n```\n{build_output}\n```\n</details>\n\n"
            "No se ejecutó la revisión semántica: un build roto ya es motivo suficiente para no "
            "mergear ni desplegar a Vercel. Corrige y sube cambios a esta misma rama."
        )
        gh("pr", "comment", PR_NUMBER, "--body", comment)
        print("Bloqueado: next build falló. No se mergea.")
        sys.exit(0)

    if not LINT_PASSED:
        gh("pr", "comment", PR_NUMBER, "--body",
           f"⚠️ **`next lint` encontró problemas** (no bloqueante por sí solo, pero se
