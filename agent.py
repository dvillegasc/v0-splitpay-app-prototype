import os
import re
import json
from google import genai
from google.genai import errors

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("Falta la variable de entorno GEMINI_API_KEY")

client = genai.Client(api_key=API_KEY)
TASKS_FILE = "tasks.md"

def get_codebase_context():
    """Lee archivos de TypeScript/React para dar contexto a la IA."""
    context = ""
    for root, _, files in os.walk("."):
        if ".git" in root or "node_modules" in root or ".next" in root: 
            continue
        for file in files:
            # Ahora lee archivos web en lugar de solo Python
            if file.endswith((".ts", ".tsx", ".js", ".jsx", ".css")) and file != "agent.py":
                path = os.path.join(root, file)
                with open(path, "r", encoding="utf-8") as f:
                    context += f"\n--- {path} ---\n{f.read()}\n"
    return context

def run_agent():
    print("🤖 Iniciando Agente Frontend en Modo Bucle...")
    
    while True:
        with open(TASKS_FILE, "r", encoding="utf-8") as f:
            content = f.read()

        match = re.search(r'- \[ \] (.*)', content)
        if not match:
            print("🎉 No hay más tareas pendientes en tasks.md. Apagando agente.")
            break 

        current_task = match.group(1)
        full_line = match.group(0)
        print(f"\n🚀 Procesando: {current_task}")

        context = get_codebase_context()
        prompt = f"""
        Eres un Tech Lead autónomo desarrollando el frontend de 'SplitPay' en Next.js (App Router), React, TypeScript y Tailwind CSS.
        Tu tarea actual a ejecutar es: "{current_task}"
        
        Este es el estado actual del código (contexto):
        {context}
        
        Genera el código necesario para cumplir esta tarea. Modifica el código existente (mock data) para integrarlo con la lógica descrita.
        REGLA CRÍTICA: Tu respuesta debe ser ÚNICAMENTE un objeto JSON válido. 
        - Las claves (keys) deben ser la ruta relativa del archivo (ej. 'app/page.tsx' o 'lib/api.ts').
        - Los valores (values) deben ser el código fuente COMPLETO de ese archivo.
        - NO incluyas formato Markdown, no saludes, no expliques nada. Solo el JSON.
        """

        try:
            # Usando explícitamente el modelo solicitado
            response = client.models.generate_content(
                model='gemini-3.6-flash',
                contents=prompt,
            )
            
            raw_json = response.text.strip()
            if raw_json.startswith("```json"):
                raw_json = raw_json[7:]
            if raw_json.startswith("```"):
                raw_json = raw_json[3:]
            if raw_json.endswith("```"):
                raw_json = raw_json[:-3]
                
            files_to_update = json.loads(raw_json.strip())
            
            for filepath, filecontent in files_to_update.items():
                os.makedirs(os.path.dirname(filepath) or ".", exist_ok=True)
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(filecontent)
                print(f"✅ Archivo actualizado/creado: {filepath}")
                    
            new_content = content.replace(full_line, full_line.replace('[ ]', '[x]', 1), 1)
            with open(TASKS_FILE, "w", encoding="utf-8") as f:
                f.write(new_content)
                
            print("🏁 Tarea completada. Buscando la siguiente...")
            
        except json.JSONDecodeError:
            print("⚠️ Error: JSON incompleto (límite de tokens). Deteniendo bucle.")
            break
        except errors.ClientError as e:
            if "429" in str(e):
                print("🛑 Cuota gratuita agotada (Error 429). Hasta luego.")
            else:
                print(f"❌ Error de API: {e}")
            break
        except Exception as e:
            print(f"❌ Error inesperado: {e}")
            break

if __name__ == "__main__":
    run_agent()
