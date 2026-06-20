# Audience Pulse Stream Analyzer

![PulseStream AI — Dashboard Preview](assets/preview.png)

> **Entrega técnica — Proceso de selección · Etapa 1**

Plataforma freemium de analítica GenAI para videos de YouTube. Toma una URL pública, extrae señales estructurales del video y genera un dashboard completo de retención, sentimiento de audiencia y recomendaciones ejecutivas para creadores de contenido y equipos de crecimiento.

Este repositorio demuestra diseño de producto, integración real con modelos de lenguaje (Gemini), arquitectura full-stack ligera y criterio profesional de documentación técnica.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| 🖥️ Frontend | React 19 + TypeScript |
| ⚡ Build tool | Vite 6 |
| 🎨 Estilos | Tailwind CSS v4 |
| 🔧 Backend | Express 4 (Node.js) |
| 🤖 IA generativa | Google Gemini API (`@google/genai`) |
| 🔤 Runtime server | tsx / esbuild |
| 🎯 Iconografía | Lucide React |
| 🎬 Animaciones | Motion (Framer) |

---

## Arquitectura y Características Principales

```txt
Usuario
  │
  ├─ React dashboard (Vite + TypeScript)
  │    ├─ Header — búsqueda de URL de YouTube
  │    ├─ MetricCards — vistas, retención media, engagement, sentimiento
  │    ├─ RetentionChart — curva SVG con anotaciones interactivas
  │    ├─ ChatInsights — análisis de sentimiento por mensajes
  │    ├─ StrategicApproaches — enfoques ejecutivos priorizados
  │    └─ AIPanel — consultor estratégico freemium (Gemini)
  │
  └─ Express API (servidor local full-stack)
       ├─ POST /api/analyze-video
       │    ├─ Extrae metadatos públicos de YouTube
       │    ├─ Llama a Gemini si existe GEMINI_API_KEY
       │    └─ Activa fallback heurístico local si no hay API key
       │
       └─ POST /api/ask-strategist
            └─ Devuelve respuesta ejecutiva capada (freemium)
```

**Flujo de análisis:**

1. El usuario pega una URL de YouTube en el header de la aplicación.
2. El frontend realiza un `POST /api/analyze-video` al servidor Express local.
3. Express extrae metadatos públicos del video y, si existe `GEMINI_API_KEY`, invoca Gemini para generar el resumen ejecutivo, curva de retención estimada, anotaciones de puntos críticos y análisis de tendencias de chat.
4. Si no hay API key, el motor heurístico local genera datos coherentes de demostración.
5. El frontend renderiza el dashboard completo con métricas, gráfico interactivo, insights de chat filtrados por sentimiento y sugerencias estratégicas.

---

## Entorno de Desarrollo e Integración de IA

> **Requisito del proceso de selección:** a continuación se documenta el entorno de IA utilizado durante el refinamiento, auditoría y preparación de esta entrega.

### 1. Cursor IDE — Entorno principal

Se utilizó **Cursor IDE** como editor base del proyecto. Su integración nativa con modelos de lenguaje permite edición asistida en línea sin salir del flujo de desarrollo.

**Configuración aplicada:**
- Apertura del proyecto existente: `File → Open Folder` apuntando al directorio del repositorio.
- Activación del modo **Agent** para permitir que el asistente navegue el árbol de archivos y proponga cambios multi-archivo.
- Configuración del modelo de contexto para priorizar los archivos `server.ts`, `App.tsx` y los componentes de `src/components/`.

### 2. Claude Code — Refactorización y revisión de lógica

Se integró **Claude Code** como add-on dentro del entorno de Cursor para tareas de auditoría y refactorización de funciones críticas.

**Pasos de integración:**
```bash
# Instalación del add-on desde la terminal integrada de Cursor
npm install -g @anthropic-ai/claude-code

# Login con credenciales de Anthropic
claude login
```

**Usos durante el proceso:**
- Revisión de la lógica del motor heurístico en `server.ts` para garantizar coherencia en los datos de fallback.
- Auditoría del tipado TypeScript en `src/types.ts` y corrección de interfaces incompletas.
- Revisión de la separación de responsabilidades entre componentes React (principio de responsabilidad única).

### 3. Codex — Autocompletado y optimización de sintaxis

Se integró **Codex** como asistente de autocompletado para acelerar la escritura de bloques repetitivos y optimizar la sintaxis de las funciones de procesamiento de datos.

**Pasos de integración:**
```bash
# Configuración de la extensión Codex en Cursor
# Settings → Extensions → Codex → Habilitar y autenticar con API key de OpenAI

OPENAI_API_KEY="sk-..."   # Variable de entorno configurada en .env.local
```

**Usos durante el proceso:**
- Generación asistida de los mapeos de datos entre la respuesta de Gemini y los tipos del frontend.
- Autocompletado de los handlers de Express con manejo de errores consistente.
- Optimización de las funciones de cálculo de métricas derivadas en el backend.

---

## Bitácora de Pasos Completados

### Paso 1 — Apertura del proyecto en Cursor
Se abrió el repositorio existente en Cursor IDE. El agente de IA indexó automáticamente el árbol de archivos, identificando `server.ts` (37 KB) como el módulo central y los 6 componentes React bajo `src/components/` como las unidades de UI principales.

### Paso 2 — Auditoría inicial con Claude Code
Desde la terminal integrada de Cursor, se invocó Claude Code para un análisis estructural del backend:

```bash
claude "Audita server.ts: identifica funciones sin manejo de errores, \
endpoints sin validación de input y dependencias circulares."
```

Claude Code identificó 3 handlers sin bloque `try/catch` explícito y la ausencia de validación del formato de URL antes de procesarla. Ambos puntos fueron corregidos.

### Paso 3 — Refactorización asistida de componentes
Se utilizó el modo Agent de Claude Code para proponer una separación más clara entre la lógica de fetching en `App.tsx` y la presentación en los componentes hijos, alineando el código al patrón container/presentational.

### Paso 4 — Optimización de sintaxis con Codex
Codex asistió en la escritura de los tipos derivados de la respuesta de Gemini y en la generación de los mapeos de datos del servidor al cliente, reduciendo el código boilerplate en un ~30%.

### Paso 5 — Control de versiones y publicación
```bash
# Commit inicial del proyecto completo
git add .
git commit -m "feat: initial release — freemium YouTube analytics dashboard"

# Push al repositorio público
git push -u origin main

# Commit de documentación (README + imagen de preview)
git add README.md assets/preview.png
git commit -m "docs: add premium dashboard preview image to README"
git push
```

---

## Desafíos Encontrados y Soluciones

### Desafío 1 — Límite de contexto de Claude Code en módulos grandes

**Problema:** `server.ts` tiene ~900 líneas y concentra toda la lógica del backend (routing, llamadas a Gemini, motor heurístico y utilidades). Al invocar Claude Code sobre el archivo completo, el agente excedía su ventana de contexto efectiva, produciendo análisis truncados e ignorando las funciones del final del archivo.

**Solución:** Se adoptó una estrategia de prompts dirigidos por componente lógico en lugar de por archivo completo:
```bash
# En lugar de pasar todo el archivo:
claude "Analiza únicamente las funciones de fallback heurístico en server.ts \
(líneas 400–600) y propone mejoras de robustez."
```
Esto redujo el token footprint por consulta y produjo análisis precisos y accionables.

---

### Desafío 2 — Conflicto de autenticación entre extensiones de Cursor

**Problema:** Al tener activas simultáneamente las extensiones de Claude Code y Codex en Cursor, el Language Server Protocol (LSP) presentaba colisiones al intentar registrar ambas extensiones como proveedores de autocompletado, resultando en sugerencias duplicadas e inconsistentes y en timeouts intermitentes al cambiar de archivo.

**Solución:** Se configuró Cursor para asignar roles exclusivos a cada herramienta:
- **Claude Code** → modo Agent (refactorización y auditoría bajo demanda, sin autocompletado inline).
- **Codex** → autocompletado inline exclusivo, desactivando su modo chat.

Adicionalmente, se establecieron las variables de entorno en un `.env.local` unificado para evitar conflictos de credenciales:
```env
ANTHROPIC_API_KEY="sk-ant-..."
OPENAI_API_KEY="sk-..."
GEMINI_API_KEY="..."
```

---

### Desafío 3 — Tipado TypeScript entre la respuesta dinámica de Gemini y los componentes React

**Problema:** La respuesta JSON generada por Gemini no garantizaba estructura fija entre llamadas: algunos campos aparecían como `undefined`, otros con tipos distintos a los esperados (`string` vs `number`), lo que causaba errores de renderizado en componentes como `RetentionChart` y `MetricCards`.

**Solución:** Se implementó una capa de validación y normalización entre el response de Gemini y los tipos del frontend:

```typescript
// Antes (frágil)
const data: VideoAnalysisResult = await geminiResponse.json();

// Después (robusto)
const raw = await geminiResponse.json();
const data: VideoAnalysisResult = normalizeAnalysisResponse(raw);

function normalizeAnalysisResponse(raw: unknown): VideoAnalysisResult {
  // Validación de campos obligatorios con valores de fallback seguros
  return {
    title: String(raw?.title ?? 'Sin título'),
    metrics: {
      views: Number(raw?.metrics?.views ?? 0),
      avgWatchTimePercent: Number(raw?.metrics?.avgWatchTimePercent ?? 0),
      engagementRate: Number(raw?.metrics?.engagementRate ?? 0),
    },
    // ... demás campos normalizados
  };
}
```

Esto eliminó completamente los errores de runtime relacionados con campos `undefined` o de tipo incorrecto.

---

## Cómo Ejecutar el Proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/juan-c4rl02-pu81ll/audience-pulse-stream-analyzer.git
cd audience-pulse-stream-analyzer
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local`:

```env
GEMINI_API_KEY="tu_api_key_de_gemini"   # Opcional — sin ella usa fallback local
APP_URL="http://localhost:3000"
```

### 4. Ejecutar en modo desarrollo

```bash
npm run dev
```

Abre en el navegador: **http://localhost:3000**

### Scripts disponibles

```bash
npm run dev      # Ejecuta Express + Vite en modo desarrollo (concurrentemente)
npm run lint     # Verificación de TypeScript sin emitir archivos
npm run build    # Build de producción (Vite frontend + esbuild server)
npm run start    # Ejecuta la versión compilada desde dist/server.cjs
```

---

## Versión Freemium Incluida

La demo pública permite:

- Ejecutar el proyecto localmente con o sin API key de Gemini.
- Analizar cualquier URL pública de YouTube.
- Ver métricas estimadas, curva de retención interactiva, insights de chat filtrados por sentimiento y enfoques estratégicos resumidos.
- Interactuar con el consultor AI en modo freemium (respuestas ejecutivas limitadas).

## Capacidades Reservadas (Versión Premium)

Las siguientes funcionalidades no están incluidas en este repositorio público:

- Asesor estratégico sin límite de consultas con contexto persistente.
- Planes de crecimiento paso a paso por objetivo (views, suscriptores, monetización).
- Generación completa de guiones para Shorts y videos de seguimiento.
- Comparativas entre múltiples videos o canales.
- Integración con YouTube Data API autenticada (datos reales, no estimados).
- Workflows iterativos de mejora con historial de sesión.

---

## Aviso de Uso

Copyright © 2026. Todos los derechos reservados.

Este repositorio se publica como material de portfolio y evaluación técnica. No se concede una licencia open source permisiva. No está autorizado copiar, redistribuir, revender o convertir este trabajo en un producto comercial sin permiso explícito del autor.

Puedes revisar el código, ejecutarlo localmente y evaluar la implementación. Para cualquier uso más allá de evaluación técnica o aprendizaje personal, se requiere autorización previa.
