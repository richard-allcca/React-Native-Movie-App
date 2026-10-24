# Plan de mejora y actualización — moviesApp

Fecha de revisión: 22 de octubre de 2026
Alcance: lectura del código en `src/`, configuración (`package.json`, Babel, Android) y documentación. No se ejecutó la app ni se modificó código de producto.

## Decisiones fijadas

- El proyecto sigue en **React Native CLI**. Se mantienen las carpetas `android/` e `ios/` y los scripts `react-native run-android` / `run-ios`. No hay migración a Expo, ni ahora ni como parte del upgrade.
- **`FetchAdapter` y `AxiosAdapter` se quedan los dos.** Cada uno conserva su cliente (`fetch` y Axios). Se actualizan para que cumplan el mismo contrato de `HttpAdapter`: misma URL, mismos query params, mismos errores. La app apunta a uno mediante un único punto de construcción (`movieDbFetcher`). El otro permanece listo para cambiarlo y probarlo. Cuál se elimina, si alguno se elimina, se decide después de esas pruebas. Este plan no descarta ninguno.

## Opinión

La estructura actual es buena y conviene conservarla. Separa presentación, casos de uso, entidades, mappers y el cliente HTTP. Para una app de catálogo con una sola API, eso es el nivel de arquitectura correcto: se entiende, se puede testear y no obliga a pasar por cinco carpetas para agregar un endpoint.

No recomiendo migrar al árbol de `RECOMMENDED-ARCHITECTURE.md`. Ese documento describe otra aplicación (videos, usuarios, likes, notificaciones) y, si se aplica aquí, añade carpetas vacías sin resolver los problemas reales. El nombre “DDD” del README es una organización por capas inspirada en DDD, no un dominio rico con repositorios, value objects y reglas de negocio. Eso está bien. Forzar DDD estricto en un cliente de The Movie DB aporta poco.

Lo que sí hay que corregir es la dirección de dependencias y varios defectos de comportamiento. Hoy `core/use-cases` importa tipos y mappers de `infrastructure`. El núcleo conoce el contrato de TMDB. Además, la paginación de populares está rota en dos sitios a la vez, el detalle no maneja errores, y el stack (React Native 0.74.4, Navigation 6, SDK 34) tiene cerca de dos años. Actualizar el framework es un proyecto aparte: primero hay que dejar la app correcta sobre la versión actual.

## Qué está bien

- Capas claras: `presentation` → `core` → (idealmente) `infrastructure`, con `config` para el cliente HTTP.
- Entidades de UI (`IMovie`, `IFullMovie`, `ICast`) separadas de las respuestas de la API.
- Mappers en un solo lugar (`MovieMapper`, `CastMapper`).
- `HttpAdapter` ya permite intercambiar Axios y `fetch` sin tocar pantallas ni casos de uso. Hoy el fetcher activo es `FetchAdapter`; `AxiosAdapter` está escrito y Axios sigue en `dependencies`. Los dos se conservan.
- Navegación tipada (`RootStackParams`) y pantallas pequeñas.
- La clave de API sale de `@env` y `.env` está en `.gitignore`. `.env.example` existe.
- Carga inicial del home con `Promise.allSettled`: si una lista falla, las demás pueden mostrarse.

## Defectos que conviene arreglar antes de actualizar dependencias

Estos cambios son pequeños y se notan al usar la app.

### 1. “Cargar más” escribe en la lista equivocada

En `useMovies`, `loadMorePopularMovies` hace `setNowPlaying`. Las películas nuevas irían al carrusel de cartelera, no a Popular. El scroll infinito que debería llamar a esa función está comentado en `HorizontalCarousel` (`FIXME`), así que el bug está dormido.

### 2. La página no llega a la API con `FetchAdapter`

`moviesPopularPlayingUseCase` pasa `{ params: { page } }`. `AxiosAdapter` lo entiende porque Axios lee `params`. `FetchAdapter.get` vuelca `options` dentro de `fetch()` y solo añade a la URL los params del constructor (`api_key`, `language`). `page` se pierde, y además `params` no es una opción válida de `RequestInit`. Aunque se reactive el scroll, con el fetcher actual todas las páginas pedirían la página 1.

Los dos adapters tienen que quedar equivalentes. El caso de uso no debe saber cuál está activo: pasa `params` y cualquiera de los dos arma la misma query string. `page` de la llamada pisa un `page` base si existiera; `api_key` y `language` del constructor se mantienen.

### 3. El contador de página es global

`popularPageNumber` vive fuera del hook. Si el home se desmonta, el contador no vuelve a 1. Dos llamadas seguidas pueden pedir la misma página o saltarse una. El `setTimeout` de 200 ms en el carrusel es un candado frágil para eso.

### 4. El detalle no carga en paralelo y no tiene error

En `useMovie`, cada caso de uso se espera con `await` y después se vuelve a esperar con `Promise.all` sobre valores ya resueltos. Película y reparto van en serie. Si uno falla, `isLoading` se queda en `true` (no hay `catch`) y la pantalla permanece en el loader. `DetailsScreens` usa `movie!` y `cast!`: si el estado quedara definido a medias, eso revienta en render.

### 5. Cabecera del detalle repite el título

`MovieHeader` pinta `movie.title` en el subtítulo y otra vez en el título. `originalTitle` existe en `IFullMovie` y no se usa. El botón “Regresar” está fijo en `top: 35`, sin safe area: en dispositivos con notch o status bar grande queda tapado o demasiado abajo.

### 6. Tipos y datos de la API

- `ITopRatedResponse` está declarada dos veces en `movie-db-responses.ts`.
- `poster_path` y `backdrop_path` pueden ser `null`. El mapper concatena igual y la imagen queda rota (`.../w500null`).
- Backdrop y póster usan siempre `w500`. El header a pantalla casi completa pide una imagen pequeña.
- `release_date` llega como string; la entidad lo tipa como `Date`. Funciona por el `new Date()`, pero el tipo de la respuesta miente.
- Nombres a corregir cuando se toque ese código: `getMovieByIdUseCAse`, `DetailsScreens`, `moviesPopularPlayingUseCase`, `productionsCompany`, archivo `up_coming.use-case.ts`.

### 7. Higiene

- Hay una API key comentada en `movieDbFetcher.ts`. Aunque esté comentada, conviene borrarla. Si alguna vez fue una clave real, revocala en TMDB.
- El README documenta el `.env` con `CLAVE: valor`. El formato válido es `CLAVE=valor`. `THE_MOVIE_DB_TOKEN` está en `.env.example` y en el README, y el código no lo usa (la app autentica con `api_key`).
- `axios` permanece en `dependencies` porque `AxiosAdapter` se mantiene. No es una dependencia muerta: es el segundo cliente, a la espera de las pruebas comparativas.
- El único test (`__tests__/App.test.tsx`) monta `App` con el renderer antiguo. No cubre casos de uso ni mappers, y hoy probablemente falle por navegación y `@env`.
- Estilos en línea y varios `eslint-disable`. Aceptable en un ejercicio; se acumula si la app crece.
- `RECOMMENDED-ARCHITECTURE.md` confunde más de lo que guía. Sustituirlo por este plan o eliminarlo cuando se decida el rumbo.

## Ajuste de arquitectura (sin reescribir carpetas)

Mantener:

```text
src/
  presentation/   pantallas, componentes, hooks, navegación
  core/           entidades y casos de uso
  infrastructure/ contratos HTTP de TMDB, mappers, repositorio
  config/         adapter HTTP, env, helpers de formato
```

Cambio que sí vale la pena, en este orden:

1. Definir en `core` un puerto pequeño, por ejemplo `MovieRepository`, con `getNowPlaying`, `getPopular(page)`, `getUpcoming`, `getTopRated`, `getById`, `getCast`. Los casos de uso dependen de ese puerto, no de `HttpAdapter` ni de los tipos `INowPlayingResponse`.
2. Implementar el puerto en `infrastructure` (fetcher + mappers). `movieDbFetcher` se inyecta ahí, no en cada hook. Ese fetcher es un `HttpAdapter`: la implementación del repositorio no importa si por debajo está `fetch` o Axios.
3. Unificar los cuatro listados. Son la misma función con distinto path. Pueden seguir exportándose con nombre (`moviesNowPlayingUseCase`, etc.) si quieres la lectura explícita del curso, pero el `try/catch` + `map` no debería copiarse cuatro veces.
4. Dejar los DTOs de TMDB solo en `infrastructure`. `core` no debería importar `../../../infrastructure/...`.
5. En presentación, un hook por pantalla está bien. Cuando haya caché, reintento y paginación de verdad, sustituir el `useEffect` manual por TanStack Query. No hace falta Zustand: no hay estado global de negocio.

Lo que no haría ahora: value objects, una carpeta `domain/` por feature, ni un `application/dto` paralelo a las entidades. La app no tiene reglas de negocio más allá de “pedir listas y mapearlas”.

## Clientes HTTP

Los dos adapters viven en `src/config/adapters/http/` e implementan `HttpAdapter`. Se mejoran en paralelo, sin fundirlos en un solo cliente ni borrar uno.

Contrato común, más estricto que el `Record<string, unknown>` actual:

```ts
get<T>(url: string, options?: {
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}): Promise<T>
```

Comportamiento que los dos deben cumplir:

- Unir `baseUrl` y `url` sin dobles barras ni barras perdidas. `FetchAdapter` ya lo hace a mano; `AxiosAdapter` debe seguir haciéndolo vía `baseURL` de Axios y producir la misma ruta.
- Fusionar los params del constructor (`api_key`, `language`) con los de cada `get`. Los de la llamada ganan si la clave se repite. Números como `page` salen como texto en la query (`page=2`).
- No pasar el objeto `params` al init de `fetch`. En Axios, `params` sigue siendo la opción nativa de Axios, no un campo inventado encima.
- Timeout acotado (por ejemplo 10 s) y cancelación con `AbortSignal`. En `fetch`, `AbortController`; en Axios, `signal` (Axios 1.x lo acepta) o `CancelToken` solo si la versión instalada no lo soporta. Misma idea en los dos: una petición colgada no deja el loader eterno.
- Error uniforme: status HTTP, URL pedida y un mensaje estable. Un 401 y un 404 no deben convertirse en un `Error` genérico que borre el status. Los casos de uso y las pantallas leen ese error sin importar el cliente.
- Respuesta JSON. Si el cuerpo no es JSON, el error lo dice. No tragar el body de error de TMDB: si viene `status_message`, incluirlo.

Diferencias que se conservan a propósito, porque son la razón de probar los dos:

- `FetchAdapter` usa el `fetch` global de React Native. Sin dependencia extra.
- `AxiosAdapter` usa una instancia `axios.create` con `baseURL` y params por defecto. Puede sumar interceptores de Axios (log de status en desarrollo, por ejemplo) sin cambiar el contrato. Esos interceptores no se copian a `fetch`.

Punto de cambio para las pruebas: `src/config/adapters/movieDbFetcher.ts` exporta el adapter activo. Alternar entre `new FetchAdapter(...)` y `new AxiosAdapter(...)` con las mismas `baseUrl` y `params`. Un comentario corto junto a las dos líneas indica que la elección está pendiente. No hace falta una pantalla de ajustes ni una variable de entorno para esto.

Tests de los dos adapters sobre los mismos casos: query con `page`, params base que no se pierden, status no OK, timeout. Así la comparación posterior no mezcla “este cliente falla” con “este cliente no implementa `page`”.

`THE_MOVIE_DB_TOKEN` sigue sin usarse. Si más adelante TMDB se llama con Bearer, el `headers` del contrato común sirve para los dos. Hasta entonces el token no entra en ninguno de los dos clientes.

## Actualización del stack

Estado actual relevante:

| Pieza | Versión en el repo |
| --- | --- |
| React Native | 0.88.0 |
| React | 19.3.0 |
| React Navigation | 7.5 / 7.12 |
| TypeScript | 6.0 |
| ESLint | 8 |
| Prettier | 2.8.8 |
| Android compile/target SDK | 37 / 36 |
| Gradle | 9.4.1 |
| Node | `>=22.11.0` |

Ese conjunto era coherente a mediados de 2024. En octubre de 2026 queda corto para publicar en Play (el `targetSdk` exigido ya superó 34) y para recibir parches de React Native. El salto incluye, según la versión estable del momento: React 19, New Architecture por defecto, Gradle y NDK nuevos, y Navigation 7.

No actualizar en el mismo cambio que los bugs. El camino seguro:

1. Dejar `main` (o la rama actual) con los defectos de la sección anterior corregidos y la app arrancando en 0.74.
2. Consultar la guía oficial de upgrade de React Native el día que se haga, y subir de versión en saltos que la guía marque (no un único `npm install react-native@latest`).
3. En cada salto: `npm run android`, home, detalle, regreso, y una petición real a TMDB.
4. En cada salto del upgrade, comprobar los dos adapters: el mismo home y el mismo detalle con `FetchAdapter` y, cambiando solo `movieDbFetcher`, con `AxiosAdapter`. El upgrade no es el momento de borrar uno.
5. Subir `compileSdk` / `targetSdk` al nivel que pida esa versión de React Native y la Play Console.
6. Node: alinear `engines` con lo que pida la plantilla CLI nueva (hoy el README dice 18 y el `package.json` dice `>=18`).
7. Mantener el proyecto como app CLI: `android/`, `ios/`, Metro y el CLI de React Native. No introducir `expo`, `expo-modules` ni prebuild. Si una guía de upgrade asume Expo, se usa la variante “React Native CLI” de esa misma guía.

## Mejoras de producto, después de lo anterior

Prioridad alta, porque cierran huecos de la app actual:

- Estados de error y vacío en home y detalle, con reintento. El loader infinito es el fallo visible más grave.
- Paginación real de Popular (y, si interesa, del resto) cuando el `FlatList` llegue al final, con guarda contra llamadas duplicadas.
- Pull to refresh en el home.
- Safe area en el detalle y botón de regreso que no dependa de `top: 35`.
- Imágenes: tamaño según uso (`w300` póster de lista, `w780` o `original` en el header) y placeholder si no hay path.
- Títulos de sección en español, igual que “Historia”, “Presupuesto” y “Actores”. Hoy Popular / Upcoming / Top Rated quedan en inglés.

Prioridad media, si la app va a dejar de ser solo el ejercicio del curso:

- Búsqueda (`/search/movie`) con debounce.
- Pantalla o sección de género.
- Favoritos en el dispositivo (`AsyncStorage` o MMKV). Aquí sí aparece estado que sobrevive a la pantalla; un contexto pequeño o la caché de Query basta.
- Ficha de actor (el componente ya existe; no navega a ningún sitio).
- Idioma de la API configurable. Hoy `language: 'es'` está fijo en el fetcher.

Prioridad baja:

- Tema claro/oscuro. El README lo menciona y la UI está en claro con colores sueltos.
- Extraer un `theme` mínimo (espaciado, radios, tipografía) para quitar los estilos en línea. No hace falta una librería de UI.
- Internacionalización de textos. Con una sola lengua, constantes en un archivo alcanzan.

## Pruebas que justifican el diseño actual

Los casos de uso y los mappers son funciones puras alrededor de un `HttpAdapter`. Ahí el test es barato y protege la paginación y los `null` de imágenes:

- Mapper: póster presente, póster `null`, fecha inválida, presupuesto 0.
- `FetchAdapter` y `AxiosAdapter`, con los mismos casos: `page` en la query, params base conservados, status HTTP no OK, timeout.
- Caso de uso de populares: el adapter recibe `page` y el resultado es `IMovie[]`, sin importar qué implementación de `HttpAdapter` se le pase.
- `useMovies` / `useMovie`: con un repositorio falso, error de red deja de ser loader eterno y la página se acumula en `popular`.

El test de “App renderiza” puede quedar como smoke test cuando el upgrade de Jest lo permita. No es la red de seguridad de esta app.

## Plan por fases

Cada fase es revisable por separado. No empieces la 4 hasta que la 1 esté verificada en un emulador.

### Fase 0 — Documentación (medio día)

- Corregir el ejemplo de `.env` en el README (`=` en lugar de `:`).
- Aclarar que la app usa `THE_MOVIE_DB_KEY` y que el token no participa.
- Decidir si `RECOMMENDED-ARCHITECTURE.md` se archiva o se borra. Este archivo pasa a ser la referencia.
- Borrar la clave comentada en `movieDbFetcher.ts`.

### Fase 1 — Comportamiento (1–2 días)

- `loadMorePopularMovies` actualiza `popular`.
- Igualar `FetchAdapter` y `AxiosAdapter` al contrato de la sección “Clientes HTTP”: params combinados, `page` en la query, timeout, error con status. Tests de los dos sobre los mismos casos. El fetcher activo puede seguir siendo `FetchAdapter`; `AxiosAdapter` queda intercambiable en `movieDbFetcher.ts`.
- Contador de página dentro del hook, ignorar llamadas solapadas, no incrementar la página si la petición falla.
- Reactivar `onEndReached` (mejor que el cálculo manual de `onScroll`, que era el `FIXME`).
- `useMovie`: `Promise.all` de las dos peticiones, `catch` con estado de error, y pantalla de detalle que no use assertions `!`.
- Header: subtítulo = título original cuando difiera, safe area en el botón de regreso.
- Placeholder si `poster_path` es `null`.
- Quitar el `interface` duplicado de top rated.

### Fase 2 — Límites entre capas (1–2 días)

- Puerto `MovieRepository` en `core`.
- Implementación en `infrastructure`.
- Un solo flujo interno para las cuatro listas.
- Hooks de presentación dependen del repositorio (o de funciones de casos de uso ya cerradas sobre ese repositorio), no de `movieDbFetcher`.
- Renombrar los identificadores rotos (`UseCAse`, `DetailsScreens`, etc.) en el mismo cambio para no dejar dos nombres.

### Fase 3 — UX mínima (2–3 días)

- Error con reintento en home y detalle.
- Pull to refresh.
- Tamaños de imagen y textos de sección.
- Probar a mano el mismo flujo (home, página 2 de Popular, detalle, fallo de red) con cada adapter, cambiando solo la instancia en `movieDbFetcher.ts`. Anotar diferencias reales de comportamiento. No eliminar ninguno en esta fase.

### Fase 4 — Upgrade de plataforma (varios días, en rama aparte)

Aplicada el 23 de octubre de 2026 en la rama `upgrade/react-native-0.88`, de 0.74.4 a 0.88.0, con el diff de la plantilla CLI. Sin Expo. `FetchAdapter` y `AxiosAdapter` siguen los dos; el activo queda en `fetch`. `app:assembleDebug` generó `android/app/build/outputs/apk/debug/app-debug.apk`. En Windows, Ninja rechaza rutas de objeto de más de 260 caracteres: `scripts/shorten-gesture-handler-objects.js` se ejecuta en `postinstall` y compila una copia corta de los shadow nodes de gesture-handler.

En el Pixel 8 (API 35), con los dos adapters: el home muestra las cuatro listas; Popular pide la página 2 (`Digger`) y la 3 (`No dejes a los niños solos`) y esas películas aparecen en el carrusel; el detalle abre historia, presupuesto y reparto; sin red hay error y Reintentar, no un spinner eterno; al volver la red, Reintentar carga la película. La única diferencia vista: sin red, `FetchAdapter` muestra "Network request failed" y `AxiosAdapter` muestra "Network Error". Falta compilar y recorrer lo mismo en iOS, en un Mac.

- Seguir la guía oficial de **React Native CLI** desde 0.74 hasta la estable vigente, en los saltos que indique. Sin plantilla Expo.
- Subir Navigation, tipos de React, TypeScript, ESLint, Prettier y `axios` junto con cada salto, no por separado “a ojo”. `axios` se actualiza para seguir compilando con el `AxiosAdapter`.
- Ajustar SDK de Android y, si se compila iOS, el deployment target que pida la versión nueva, dentro de los proyectos nativos que ya genera el CLI.
- Probar con cada adapter: arranque, home con cuatro listas, paginación, detalle, reparto, regreso, fallo de red (modo avión).

### Fase 5 — Siguiente producto (cuando la base esté estable)

Elegir una sola de estas para no abrir tres frentes:

1. Búsqueda.
2. Favoritos locales.
3. Tema.

La búsqueda es la que más se parece a lo que la app ya sabe hacer (caso de uso + mapper + pantalla).

## Qué no haría

- Reemplazar la estructura por el árbol de videos/usuarios de `RECOMMENDED-ARCHITECTURE.md`.
- Introducir Redux.
- Migrar a Expo, añadir módulos de Expo o sustituir `android/` e `ios/` por un prebuild.
- Eliminar `FetchAdapter` o `AxiosAdapter`, o quitar `axios` de `package.json`, antes de las pruebas comparativas.
- Reescribir los componentes de UI antes de arreglar paginación y errores.
- Subir React Native y rediseñar la arquitectura en el mismo diff.

## Criterio para dar por buena la fase 1

En un emulador, con una clave válida en `.env`:

- El home muestra cartelera, popular, próximos estrenos y mejor valoradas.
- Al llegar al final de Popular se piden las páginas 2 y 3, y esas películas aparecen en Popular. El mismo resultado con `FetchAdapter` y, tras cambiar la instancia en `movieDbFetcher.ts`, con `AxiosAdapter`.
- Cortar la red en el detalle muestra un error y un reintento, no un spinner eterno.
- El botón de regreso no queda bajo el status bar.
- Una película sin póster no muestra una imagen rota con la URL `w500null`.
