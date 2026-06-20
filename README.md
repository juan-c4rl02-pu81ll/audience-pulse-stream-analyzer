# Audience Pulse Stream Analyzer

Portfolio freemium de anal?tica GenAI para videos de YouTube. La app toma una URL p?blica, extrae se?ales b?sicas del video y genera un dashboard de retenci?n, conversaci?n y recomendaciones ejecutivas para creadores de contenido.

> Este repositorio existe para demostrar dise?o de producto, integraci?n GenAI, arquitectura full-stack ligera y criterio profesional de documentaci?n. No es la versi?n premium completa.

## Qu? demuestra

- Dashboard tipo producto SaaS para escritorio.
- Frontend React + Vite con componentes de anal?tica visual.
- Backend Express que protege la API key del lado servidor.
- Integraci?n opcional con Gemini mediante `GEMINI_API_KEY`.
- Fallback heur?stico local cuando no hay API key o la cuota falla.
- Separaci?n clara entre demo freemium y capacidades premium.

## Stack t?cnico

- **React 19** + **TypeScript**
- **Vite** para desarrollo frontend
- **Express** como servidor full-stack local
- **Gemini API** mediante `@google/genai`
- **Tailwind CSS v4**
- **Lucide React** para iconograf?a
- **Motion** para microinteracciones

## Arquitectura resumida

```txt
Usuario
  ?
  ?? React dashboard
  ?    ?? Header / b?squeda de URL
  ?    ?? M?tricas principales
  ?    ?? Curva de retenci?n
  ?    ?? Insights de chat
  ?    ?? Consultor AI freemium
  ?
  ?? Express API
       ?? POST /api/analyze-video
       ?    ?? Obtiene metadatos p?blicos de YouTube
       ?    ?? Usa Gemini si existe GEMINI_API_KEY
       ?    ?? Usa fallback heur?stico si no hay API key
       ?
       ?? POST /api/ask-strategist
            ?? Respuesta ejecutiva capada en modo freemium
```

## Versi?n freemium incluida

La demo p?blica permite:

- Ejecutar el proyecto localmente.
- Configurar tu propia `GEMINI_API_KEY`.
- Analizar una URL p?blica de YouTube.
- Ver m?tricas estimadas, curva de retenci?n, tendencias y enfoques estrat?gicos resumidos.
- Usar un consultor AI limitado para preguntas ejecutivas breves.

## Reservado para versi?n premium

La versi?n premium completa no est? incluida en este repositorio. Quedan reservados:

- Asesor estrat?gico completo sin l?mite freemium.
- Planes paso a paso por objetivo de crecimiento.
- Guiones completos para Shorts y videos de seguimiento.
- Priorizaci?n avanzada por impacto esperado.
- Comparativas entre videos/canales.
- Integraci?n profunda con fuentes privadas o autenticadas.
- Workflows de seguimiento por iteraciones.

Esto no es esconder c?digo por inseguridad: es dise?ar un producto con una frontera clara entre demostraci?n p?blica y valor comercial.

## Instalaci?n local

### 1. Clonar el repositorio

```bash
git clone <repo-url>
cd <repo-folder>
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env.local
```

Luego edita `.env.local`:

```env
GEMINI_API_KEY="tu_api_key_de_gemini"
APP_URL="http://localhost:3000"
```

`GEMINI_API_KEY` es opcional para abrir la app, pero necesaria para probar el flujo GenAI real. Sin API key, el backend usa un generador heur?stico local para mantener la demo funcional.

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre:

```txt
http://localhost:3000
```

## Scripts disponibles

```bash
npm run dev      # Ejecuta Express + Vite en modo desarrollo
npm run lint     # Verifica TypeScript sin emitir archivos
npm run start    # Ejecuta la versi?n compilada desde dist/server.cjs
```

> Nota: `npm run build` existe para producci?n, pero este repositorio est? presentado principalmente como demo local freemium.

## API p?blica local

### `POST /api/analyze-video`

Analiza una URL de YouTube y devuelve:

- t?tulo y canal
- duraci?n
- categor?a
- resumen ejecutivo
- m?tricas estimadas
- curva de retenci?n
- anotaciones principales
- mensajes/tendencias de chat resumidas
- enfoques estrat?gicos capados

### `POST /api/ask-strategist`

Devuelve una respuesta ejecutiva limitada. El asesor premium completo est? intencionalmente fuera del repositorio p?blico.

## Decisiones de producto

Esta app est? pensada como portfolio profesional, no como ?c?digo regalado?. La versi?n p?blica demuestra que el sistema funciona, pero no entrega el motor completo de consultor?a estrat?gica.

La frontera freemium existe por tres motivos:

1. **Demostraci?n real:** quien clona el proyecto puede correrlo y probar el flujo.
2. **Protecci?n de valor:** las capacidades premium no se publican completas.
3. **Claridad profesional:** el README explica qu? es demo, qu? es producto y qu? se mantiene privado.

## Aviso de uso

Copyright ? 2026. Todos los derechos reservados.

Este repositorio se publica como material de portfolio y evaluaci?n t?cnica. No se concede una licencia open source permisiva. No est? autorizado copiar, redistribuir, revender o convertir este trabajo en un producto comercial sin permiso expl?cito del autor.

Puedes revisar el c?digo, ejecutarlo localmente y evaluar la implementaci?n freemium. Para cualquier uso m?s all? de evaluaci?n t?cnica o aprendizaje personal, se requiere autorizaci?n previa.
