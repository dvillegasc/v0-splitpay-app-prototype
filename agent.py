import os
import re
from google import genai

def run_autonomous_step():
    # Inicializa el cliente usando la variable de entorno GEMINI_API_KEY
    client = genai.Client()
    
    # 1. Leer las tareas pendientes
    task_path = "tasks.md"
    if not os.path.exists(task_path):
        print("El archivo tasks.md no existe.")
        return
        
    with open(task_path, "r", encoding="utf-8") as f:
        tasks_content = f.read()

    # 2. Leer el código fuente actual de la aplicación
    code_path = "main.py"
    current_code = ""
    if os.path.exists(code_path):
        with open(code_path, "r", encoding="utf-8") as f:
            current_code = f.read()

    # 3. Estructurar el prompt para el modelo pidiendo un formato estricto
    prompt = f"""
    Eres un ingeniero de software autónomo trabajando en un bucle de desarrollo continuo.
    
    [TAREAS PENDIENTES (tasks.md)]
    {tasks_content}
    
    [CÓDIGO ACTUAL (main.py)]
    {current_code}
    
    Instrucción:
    1. Toma la primera tarea pendiente que no esté completada.
    2. Modifica el código de main.py para cumplir con esa tarea de forma robusta.
    3. Devuelve los archivos actualizados usando exactamente este formato de bloques de código markdown:

    ---FILE: main.py---
    [aquí va el código completo actualizado de main.py]

    ---FILE: tasks.md---
    [aquí va el contenido actualizado de tasks.md marcando la tarea realizada]
    """

    print("Enviando contexto a Gemini...")
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
    )
    
    raw_text = response.text
    print("--- RESPUESTA RECIBIDA DE LA IA ---")
    print(raw_text)

    # 4. Extraer y actualizar automáticamente 'main.py' y 'tasks.md' basados en la respuesta
    main_match = re.search(r'---FILE: main.py---\s*(.*?)(?=\n---FILE:|\Z)', raw_text, re.DOTALL)
    tasks_match = re.search(r'---FILE: tasks.md---\s*(.*?)(?=\n---FILE:|\Z)', raw_text, re.DOTALL)

    if main_match:
        new_code = main_match.group(1).strip()
        # Limpiar bloques de código markdown extra si la IA los incluye por error
        new_code = re.sub(r'^```python\s*', '', new_code)
        new_code = re.sub(r'\s*```$', '', new_code)
        with open(code_path, "w", encoding="utf-8") as f:
            f.write(new_code)
        print("-> Archivo main.py actualizado con éxito.")

    if tasks_match:
        new_tasks = tasks_match.group(1).strip()
        new_tasks = re.sub(r'^```markdown\s*', '', new_tasks)
        new_tasks = re.sub(r'^```\s*', '', new_tasks)
        new_tasks = re.sub(r'\s*```$', '', new_tasks)
        with open(task_path, "w", encoding="utf-8") as f:
            f.write(new_tasks)
        print("-> Archivo tasks.md actualizado con éxito.")

if __name__ == "__main__":
    run_autonomous_step()
