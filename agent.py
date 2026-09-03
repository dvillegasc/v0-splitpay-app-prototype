import os
import json
import py_compile
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

# Esquema para forzar una respuesta estructurada 100% confiable
class AgentOutput(BaseModel):
    task_done: str = Field(description="Descripción de la tarea completada en esta iteración")
    updated_tasks: str = Field(description="Contenido completo de tasks.md con la tarea tachada")
    updated_code: str = Field(description="Código completo de main.py sin bloques markdown")

def test_code_syntax(code_str: str) -> str | None:
    """Verifica si el código es sintácticamente válido en Python."""
    try:
        py_compile.compile("main_temp.py", doraise=True)
        return None
    except py_compile.PyCompileError as e:
        return str(e)

def run_autonomous_step():
    client = genai.Client()
    
    task_path = "tasks.md"
    code_path = "main.py"
    
    if not os.path.exists(task_path):
        print("Falta el archivo tasks.md")
        return
        
    with open(task_path, "r", encoding="utf-8") as f:
        tasks_content = f.read()

    current_code = ""
    if os.path.exists(code_path):
        with open(code_path, "r", encoding="utf-8") as f:
            current_code = f.read()

    prompt = f"""
    Eres un ingeniero de software senior trabajando de forma incremental.
    
    [TAREAS PENDIENTES (tasks.md)]
    {tasks_content}
    
    [CÓDIGO ACTUAL (main.py)]
    {current_code}
    
    Instrucciones:
    1. Identifica la siguiente tarea pendiente prioritaria en tasks.md.
    2. Implementa la solución de forma robusta e intégrala limpiamente en el código actual de main.py.
    3. Marca la tarea como completada en tasks.md (usa '- [x]').
    4. Devuelve únicamente el esquema JSON solicitado sin explicaciones extras.
    """

    print("Enviando contexto al modelo...")
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=AgentOutput,
            temperature=0.2, # Temperatura baja para mayor precisión en código
        ),
    )

    data = json.loads(response.text)
    new_code = data["updated_code"]
    new_tasks = data["updated_tasks"]

    # Validación previa de sintaxis
    with open("main_temp.py", "w", encoding="utf-8") as f:
        f.write(new_code)

    error = test_code_syntax(new_code)
    if os.path.exists("main_temp.py"):
        os.remove("main_temp.py")

    if error:
        print(f"Error de sintaxis detectado. Omitiendo guardado para no romper el proyecto:\n{error}")
        return

    # Si compila correctamente, se aplican los cambios
    with open(code_path, "w", encoding="utf-8") as f:
        f.write(new_code)

    with open(task_path, "w", encoding="utf-8") as f:
        f.write(new_tasks)

    print(f"-> Iteración completada con éxito: {data['task_done']}")

if __name__ == "__main__":
    run_autonomous_step()
