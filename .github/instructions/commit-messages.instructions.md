# Instrucciones para generar mensajes de commit

## 🎯 Objetivo
Generar mensajes de commit claros, concisos y útiles que sigan la convención de commits semánticos (Conventional Commits) y reflejen con precisión los cambios realizados en el código.

## 🧱 Estructura del mensaje


<tipo>(<área>): <descripción breve en inglés>
[opcional] - Lista de cambios relevantes [opcional] - Referencias a issues, tareas o contexto adicional

## ✅ Tipos de commit permitidos

- `feat`: Nueva funcionalidad
- `fix`: Corrección de errores
- `docs`: Cambios en documentación
- `style`: Cambios de formato (sin afectar lógica)
- `refactor`: Reestructuración interna sin cambiar comportamiento
- `test`: Añadir o modificar pruebas
- `chore`: Tareas menores o mantenimiento

## 📌 Reglas de estilo

- Usar verbos en **imperativo**: `Add`, `Fix`, `Update`, `Remove`
- Escribir en **inglés**
- Evitar el uso de tiempos pasados (`Added`, `Fixed`)
- Ser **específico** sobre el área afectada (`schedule`, `auth`, `dashboard`)
- Mantener la descripción breve (máximo 70 caracteres)
- Si hay múltiples cambios, usar viñetas para listarlos

## 🧩 Ejemplos de commits correctos


feat(schedule): Add tennis match scheduling logic
- Created src/app/api/schedule-job route
- Updated route.js to support tennis parameters


fix(auth): Correct OAuth redirect URI handling
- Adjusted App Engine config
- Fixed consent screen validation


refactor(ui): Modularize dashboard messaging components

## 🚫 Evitar

- Mensajes genéricos como `update files`, `changes`, `misc fixes`
- Mezclar idiomas
- Usar descripciones vagas o sin contexto

## 🧠 Contexto adicional

Este proyecto prioriza claridad operativa, modularidad y trazabilidad. Los mensajes de commit deben reflejar el impacto técnico y facilitar la revisión por otros miembros del equipo.



🛠️ ¿Cómo usarlo?
- Guarda este archivo en tu repositorio en:
.github/instructions/commit-messages.instructions.md
- En tu VS Code, agrega esta configuración en .vscode/settings.json:
{
  "github.copilot.chat.commitMessageGeneration.instructions": [
    { "file": ".github/instructions/commit-messages.instructions.md" }
  ]
}



¿Quieres que te ayude a generar una versión adaptada para tus proyectos actuales (como el de scheduling o NBA UI)? También puedo ayudarte a modularizar plantillas por tipo de commit (feat, fix, etc.) para que Copilot tenga aún más precisión.
