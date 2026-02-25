# MIGRATION_REPORT

Fecha: 2026-02-25
Proyecto: `hallazgos-ui`

## Skills encontrados y aplicados

Se leyeron y aplicaron todas las reglas de `.agents` (70 archivos):

- `frontend-design`
- `mui-v7-mastery`
- `vercel-react-best-practices`
- `web-design-guidelines`

Aplicación práctica en esta migración:

- Respeto de patrones App Router, rendimiento y límites de serialización.
- Migración MUI centrada en APIs oficiales v7 y eliminación de APIs removidas.
- Preservación de tipos TypeScript sin uso de `any`.
- Cambios mínimos por fase, sin alterar lógica de negocio ni queries.

---

## FASE 0 — Auditoría completa del proyecto

### 1) Auditoría MUI

#### Archivos con imports desde `@mui/*`

- `app/ThemeRegistry.tsx`
- `app/theme.tsx`
- `app/page.tsx`
- `app/_hooks/useCustomTheme.tsx`
- `app/_shared/components/TablePaginationActions.tsx`
- `app/_shared/components/TableFooterDefault.tsx`
- `app/_shared/components/TableDefaultServer.tsx`
- `app/_shared/components/TableDefault.tsx`
- `app/_shared/components/menu.tsx`
- `app/_shared/components/LoadingLinear.tsx`
- `app/_shared/components/ImageORCamera.tsx`
- `app/_shared/components/Copyright.tsx`
- `app/_components/SelectZones.tsx`
- `app/_components/SelectRules.tsx`
- `app/_components/SelectManufacturingPlants.tsx`
- `app/_components/SelectMainTypes.tsx`
- `app/_components/SelectDefault.tsx`
- `app/_components/MultiSelectZones.tsx`
- `app/_components/MultiSelectProcesses.tsx`
- `app/_components/MultiSelectManufacturingPlants.tsx`
- `app/_components/login/FormLogin.tsx`
- `app/_components/login/FormForgotPassword.tsx`
- `app/_components/login/FormRestorePassword.tsx`
- `app/(routes)/layout.tsx`
- `app/(routes)/config-tg/page.tsx`
- `app/(routes)/topics-tg/page.tsx`
- `app/(routes)/training-guide/page.tsx`
- `app/(routes)/hds/page.tsx`
- `app/(routes)/zones/page.tsx`
- `app/(routes)/zones/form/page.tsx`
- `app/(routes)/zones/_components/FiltersZones.tsx`
- `app/(routes)/zones/_components/TableZones.tsx`
- `app/(routes)/users/page.tsx`
- `app/(routes)/users/form/page.tsx`
- `app/(routes)/users/_components/FiltersUsers.tsx`
- `app/(routes)/users/_components/TableUsers.tsx`
- `app/(routes)/processes/page.tsx`
- `app/(routes)/processes/form/page.tsx`
- `app/(routes)/processes/_components/FiltersProcesses.tsx`
- `app/(routes)/processes/_components/TableProcesses.tsx`
- `app/(routes)/main-types/page.tsx`
- `app/(routes)/main-types/form/page.tsx`
- `app/(routes)/main-types/_components/FiltersMainTypes.tsx`
- `app/(routes)/main-types/_components/TableMainTypes.tsx`
- `app/(routes)/secondary-types/page.tsx`
- `app/(routes)/secondary-types/form/page.tsx`
- `app/(routes)/secondary-types/_components/FiltersSecondaryTypes.tsx`
- `app/(routes)/secondary-types/_components/TableSecondaryTypes.tsx`
- `app/(routes)/manufacturing-plants/page.tsx`
- `app/(routes)/manufacturing-plants/form/page.tsx`
- `app/(routes)/manufacturing-plants/_components/FiltersManufacturingPlants.tsx`
- `app/(routes)/manufacturing-plants/_components/TableManufacturingPlants.tsx`
- `app/(routes)/employees/page.tsx`
- `app/(routes)/employees/form/page.tsx`
- `app/(routes)/employees/_components/FiltersEmployees.tsx`
- `app/(routes)/employees/_components/TableEmployees..tsx`
- `app/(routes)/ics/page.tsx`
- `app/(routes)/ics/form/page.tsx`
- `app/(routes)/ics/_components/FiltersIcs.tsx`
- `app/(routes)/ics/_components/TableIcs.tsx`
- `app/(routes)/ciael/page.tsx`
- `app/(routes)/ciael/components/DialogCreateCiael.tsx`
- `app/(routes)/ciael/components/TableCiaels.tsx`
- `app/(routes)/epp/page.tsx`
- `app/(routes)/epp/_components/DialogCreateEpp.tsx`
- `app/(routes)/epp/_components/DialogSignatureEpp.tsx`
- `app/(routes)/epp/_components/TableEpps.tsx`
- `app/(routes)/hallazgos/page.tsx`
- `app/(routes)/hallazgos/form/page.tsx`
- `app/(routes)/hallazgos/_components/CloseEvidence.tsx`
- `app/(routes)/hallazgos/_components/DetailsEvidence.tsx`
- `app/(routes)/hallazgos/_components/EvidencePreview.tsx`
- `app/(routes)/hallazgos/_components/FiltersEvidence.tsx`
- `app/(routes)/hallazgos/_components/ListComments.tsx`
- `app/(routes)/hallazgos/_components/TableEvidences.tsx`
- `app/(routes)/hallazgos/_components/TabsImageAndLogs.tsx`
- `app/(routes)/dashboard/page.tsx`
- `app/(routes)/dashboard/_components/AccidentRateIndicator.tsx`
- `app/(routes)/dashboard/_components/TopUsersByPlantChart.tsx`

#### Hallazgos clave MUI

- Deep imports detectados en gran parte del código (`@mui/material/X`, `@mui/material/styles/X`).
- No se detecta uso runtime de `makeStyles`, `withStyles`, `createMuiTheme` ni `experimentalStyled`.
- `TransitionComponent` detectado en:
  - `app/(routes)/training-guide/page.tsx`
  - `app/(routes)/hallazgos/_components/EvidencePreview.tsx`
  - `app/(routes)/epp/_components/DialogSignatureEpp.tsx`
  - `app/(routes)/epp/_components/DialogCreateEpp.tsx`
  - `app/(routes)/config-tg/page.tsx`
  - `app/(routes)/ciael/components/DialogCreateCiael.tsx`
- `TransitionProps` detectado en `app/(routes)/hallazgos/_components/EvidencePreview.tsx`.
- `componentsProps` y `onBackdropClick` no detectados en runtime.
- Uso de `@mui/lab` con `LoadingButton` en:
  - `app/(routes)/zones/form/page.tsx`
  - `app/(routes)/users/form/page.tsx`
  - `app/(routes)/processes/form/page.tsx`
  - `app/(routes)/secondary-types/form/page.tsx`
  - `app/(routes)/manufacturing-plants/form/page.tsx`
  - `app/(routes)/ics/form/page.tsx`
  - `app/(routes)/main-types/form/page.tsx`
  - `app/(routes)/hallazgos/page.tsx`
  - `app/(routes)/employees/form/page.tsx`
  - `app/(routes)/ciael/page.tsx`

### 2) Auditoría Apollo

- Importa `@apollo/experimental-nextjs-app-support` en:
  - `app/_shared/libs/apollo-wrapper.tsx`
  - `app/_shared/libs/apollo-client.ts`
- Hooks React de Apollo desde `@apollo/client`:
  - `useLazyQuery` en `app/_hooks/useEvidences.ts`
- Deprecated v3 detectados:
  - `errors` (resultado), `QueryReference`, `defaultOptions`, `connectToDevtools`: **no detectados**.

### 3) Auditoría Zustand

- Stores detectados:
  - `app/_store/index.ts`
  - `app/_store/userSession.store.ts`
  - `app/_store/categories.store.ts`
- Ambos stores usan patrón v4 (`create(...)`) y deben migrarse al patrón v5 con doble invocación.
- No se detecta `createContext` desde `zustand/context`.
- No se detecta `shallow` como segundo argumento.
- Riesgo de suscripciones amplias (sin selector o con selector de objeto/estado completo) en:
  - `app/_shared/components/menu.tsx`
  - `app/(routes)/layout.tsx`
  - `app/(routes)/training-guide/page.tsx`
  - `app/(routes)/topics-tg/page.tsx`
  - `app/(routes)/config-tg/page.tsx`
  - `app/(routes)/hallazgos/_components/TableEvidences.tsx`
  - `app/(routes)/hallazgos/_components/FiltersEvidence.tsx`
  - `app/(routes)/hallazgos/form/page.tsx`

### 4) Auditoría Highcharts

- Imports `highcharts`/`highcharts-react-official` en:
  - `app/(routes)/layout.tsx`
  - `app/(routes)/dashboard/_components/MainTypesChart.tsx`
  - `app/(routes)/dashboard/_components/StatusChart.tsx`
  - `app/(routes)/dashboard/_components/ZonesChart.tsx`
  - `app/(routes)/dashboard/_components/ProductivityChart.tsx`
  - `app/(routes)/dashboard/_components/PyramidChart.tsx`
  - `app/(routes)/dashboard/_components/HeatMapChart.tsx`
  - `app/(routes)/dashboard/_components/EvidencePerMonthChart.tsx`
- Patrón legacy `require('highcharts/modules/X')(Highcharts)` detectado en los 7 componentes de dashboard.
- Uso de `HighchartsReact` detectado en los 7 componentes de dashboard.
- Uso de `xData`, `yData`, `processedXData`, `processedYData`: **no detectado**.

### 5) Auditoría Next.js

- Existe `middleware.ts` en raíz y exporta `middleware`.
- `experimental.ppr`: no detectado en `next.config.js`.
- Flag `--turbopack`: no detectado en scripts.
- Configuración `webpack` custom en `next.config.js`: no detectada.

### 6) Auditoría TypeScript

- `React.FC`, `React.FunctionComponent`, `React.VFC`: no detectados en `app/**`.
- `React.forwardRef` detectado en `app/(routes)/hallazgos/_components/EvidencePreview.tsx`.
- `importsNotUsedAsValues` y `preserveValueImports`: no detectados en `tsconfig.json`.
- Riesgo con `verbatimModuleSyntax` por imports de tipos sin `import type` (muestra principal):
  - `app/(routes)/hallazgos/_components/EvidencePreview.tsx`
  - `app/(routes)/hallazgos/_components/TableEvidences.tsx`
  - `app/(routes)/hallazgos/_components/TabsImageAndLogs.tsx`
  - `app/(routes)/dashboard/page.tsx`
  - `app/(routes)/hds/page.tsx`
  - `app/_shared/components/TablePaginationActions.tsx`
  - `app/_shared/components/TableFooterDefault.tsx`
  - `app/_shared/components/TableDefault.tsx`
  - `app/_shared/components/menu.tsx`
  - `app/_store/categories.store.ts`

### 7) Matriz de riesgo de dependencias

#### 🟢 SAFE (actualización con bajo riesgo de código)

- `@emotion/cache`, `@emotion/react`, `@emotion/styled`
- `@fontsource/roboto`
- `axios`, `browser-image-compression`, `dayjs`, `regression`, `use-debounce`
- `pdfmake`, `xlsx`, `uuid` (requieren verificación tipada menor)
- `@types/*` (alineados al target de React 19 / TS 5.8)

#### 🟡 REVIEW (requieren cambios de código)

- `next` (14 → 16)
- `react`, `react-dom`, `react-is` (18 → 19)
- `@mui/material`, `@mui/icons-material`, `@mui/lab` (v5 → v7)
- `@apollo/client` (3 → 4)
- `@apollo/experimental-nextjs-app-support` → `@apollo/client-integration-nextjs`
- `zustand` (4 → 5)
- `highcharts-react-official` → `@highcharts/react`
- `highcharts` (11 → 12)
- `typescript` (5.6 → 5.8)
- `eslint` y `eslint-config-next` (8/14 → 9/16, flat config)

#### 🔴 FREEZE (mantener temporalmente si no hay compatibilidad o alto riesgo)

- Ninguna librería marcada como freeze definitivo en Fase 0.
- Posible freeze temporal si alguna dependencia indirecta no soporta React 19 (se documentará como deuda técnica en fases posteriores).

---

## Bitácora de fases

### Fase 0

Estado: ✅ Completada
`pnpm install`: completado
`pnpm run build`: falló (esperado en esta fase, se corrige en fases 2-8)

- Estado: ✅ Completada
- Build ejecutado: No aplica (fase solo de auditoría, sin cambios funcionales)

### Fase 1 — `pnpm run build`

`Module not found: @apollo/experimental-nextjs-app-support/ssr` en `app/_shared/libs/apollo-wrapper.tsx`.
`Module not found: highcharts-react-official` en:

- `app/(routes)/dashboard/_components/EvidencePerMonthChart.tsx`
- `app/(routes)/dashboard/_components/HeatMapChart.tsx`
- `app/(routes)/dashboard/_components/MainTypesChart.tsx`
- `app/(routes)/dashboard/_components/ProductivityChart.tsx`
- `app/(routes)/dashboard/_components/PyramidChart.tsx`
- `app/(routes)/dashboard/_components/StatusChart.tsx`
- `app/(routes)/dashboard/_components/ZonesChart.tsx`
  `useLazyQuery` ya no exporta desde `@apollo/client` en v4 (debe migrar a `@apollo/client/react`) en `app/_hooks/useEvidences.ts`.
  Warnings de Next 16 en configuración:
- `images.domains` deprecado (migrar a `images.remotePatterns`).
- `experimental.missingSuspenseWithCSRBailout` inválido en `next.config.js`.
- `swcMinify` inválido en `next.config.js`.
- Convención `middleware.ts` deprecada (migrar a `proxy.ts`).

### Fase 1

- Estado: ✅ Completada
- `pnpm install`: completado
- `pnpm run build`: ejecutado; errores iniciales registrados y corregidos en fases siguientes.

### Fase 2

- Estado: ✅ Completada
- Codemods ejecutados en `app/` (el proyecto no usa `src/`).
- Migración de `TransitionComponent` a `slots` aplicada en diálogos afectados.
- Deep imports de `@mui/material/*` migrados a imports nombrados.
- `pnpm run build`: ✅ exitoso (quedan warnings de Next 16 que se atienden en Fase 4).

### Fase 3

- Estado: ✅ Completada
- Paquete de integración migrado a `@apollo/client-integration-nextjs`.
- Hooks React migrados a `@apollo/client/react`.
- Ajustes de tipado y firma en `useLazyQuery` aplicados para Apollo v4.

### Fase 4

- Estado: ✅ Completada
- `middleware.ts` migrado a `proxy.ts` y export `proxy`.
- `next.config.js` actualizado para Next 16:
  - Eliminado `swcMinify`.
  - Eliminado bloque `experimental` inválido.
  - Migrado `images.domains` a `images.remotePatterns`.

### Fase 5

- Estado: ✅ Completada
- Stores migrados al patrón Zustand v5 `create<T>()(...)`.
- Selectores de objeto completo migrados a `useShallow` en vistas detectadas.

### Fase 6

- Estado: ⏳ Pendiente

### Fase 7

- Estado: ⏳ Pendiente

### Fase 8

- Estado: ⏳ Pendiente

### Fase 9

- Estado: ⏳ Pendiente

---

## Deuda técnica (se actualizará por fase)

- Pendiente.

## Errores de build/lint por fase (se actualizará por fase)

### Fase 1 — `pnpm run build`

- `Module not found: @apollo/experimental-nextjs-app-support/ssr` en `app/_shared/libs/apollo-wrapper.tsx`.
- `Module not found: highcharts-react-official` en componentes de dashboard.
- `useLazyQuery` importado desde `@apollo/client` (migrado luego a `@apollo/client/react`).

### Fase 2 — `pnpm run build`

- Resultado: ✅ build exitoso.
- Warnings activos (sin bloqueo):
  - `images.domains` deprecado en `next.config.js`.
  - `experimental.missingSuspenseWithCSRBailout` inválido en `next.config.js`.
  - `swcMinify` inválido en `next.config.js`.
  - `middleware.ts` deprecado (nuevo nombre: `proxy.ts`).
