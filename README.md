# React Native Movie App

Aplicación móvil para explorar y buscar películas con la API de The Movie DB. Está hecha con React Native CLI y organizada por capas.

## Arquitectura

`presentation` pinta pantallas y no conoce The Movie DB. `core` define entidades, el puerto `MovieRepository` y los casos de uso. `infrastructure` implementa ese puerto contra la API. `config` tiene los clientes HTTP. `composition/movies.ts` une los casos de uso con el repositorio.

```text
src/
├── composition/
│   └── movies.ts
├── config/
│   ├── adapters/
│   │   ├── http/
│   │   │   ├── axios.adapter.ts
│   │   │   ├── fetch.adapter.ts
│   │   │   └── http.adapter.ts
│   │   └── movieDbFetcher.ts
│   └── helpers/
│       ├── formatter.ts
│       └── movie-image.ts
├── core/
│   ├── entities/
│   │   ├── cast.entity.ts
│   │   └── movie.entity.ts
│   ├── repositories/
│   │   └── movie.repository.ts
│   └── use-cases/
│       ├── movie/
│       │   ├── get-by-id.use-case.ts
│       │   └── get-cast.use-case.ts
│       ├── movies/
│       │   ├── now_playing.use-case.ts
│       │   ├── popular.use-case.ts
│       │   ├── search.use-case.ts
│       │   ├── top_rated.use-case.ts
│       │   └── upcoming.use-case.ts
│       └── index.ts
├── infrastructure/
│   ├── interfaces/
│   │   ├── movie-db-by-id-response.ts
│   │   ├── movie-db-cast-response.ts
│   │   └── movie-db-responses.ts
│   ├── mappers/
│   │   ├── cast.mapper.ts
│   │   └── movie.mapper.ts
│   └── repositories/
│       └── movie-db.repository.ts
└── presentation/
    ├── components/
    │   ├── cast/CastActor.tsx
    │   ├── feedback/ErrorState.tsx
    │   ├── loaders/FullScreenLoader.tsx
    │   ├── movie/MovieDetails.tsx
    │   ├── movie/MovieHeader.tsx
    │   ├── movies/HorizontalCarousel.tsx
    │   ├── MoviePoster.tsx
    │   └── PosterCarousel.tsx
    ├── hooks/
    │   ├── useMovie.tsx
    │   ├── useMovies.tsx
    │   └── useSearch.tsx
    ├── navigation/Navigation.tsx
    └── screens/
        ├── details/DetailsScreen.tsx
        ├── home/HomeScreen.tsx
        └── search/SearchScreen.tsx
```

## Tabla de contenido

1. [Introducción](#introducción)
2. [Requisitos previos](#requisitos-previos)
3. [Instalación](#instalación)
4. [Configuración de entorno](#configuración-de-entorno)
5. [Ejecución](#ejecución)
6. [Navegación](#navegación)
7. [Cliente HTTP](#cliente-http)
8. [Notas](#notas)

## Introducción

La app consulta [The Movie DB](https://www.themoviedb.org/): cartelera, populares, próximos estrenos, mejor valoradas, detalle con reparto y búsqueda.

- [Documentación de la API](https://developer.themoviedb.org/reference/getting-started)
- [Documentación de React Native](https://reactnative.dev/docs/getting-started)
- [Plan de los cambios](./PLAN-ACTUALIZACION.md)

## Requisitos previos

- Node.js 22.11 o superior
- npm
- SDK Android 37 y `targetSdk` 36, los que pide React Native 0.88
- Un emulador o un dispositivo
- Para iOS, un Mac con Xcode. El deployment target del proyecto es 15.1

## Instalación

```bash
npm install
```

En Windows, `postinstall` ejecuta `scripts/shorten-gesture-handler-objects.js`. Copia los shadow nodes de `react-native-gesture-handler` a una ruta corta dentro de `android/`. Sin eso, Ninja (el de CMake 3.22) rechaza archivos objeto de más de 260 caracteres y `assembleDebug` falla. El script vuelve a aplicarse en cada `npm install` porque el cambio vive en `node_modules`.

## Configuración de entorno

1. Crea una API key en [The Movie DB](https://www.themoviedb.org/settings/api). La app la envía como `api_key`. El token de lectura no se usa.

2. Crea `.env` en la raíz. El formato es `CLAVE=valor`. Hay un modelo en `.env.example`.

   ```env
   THE_MOVIE_DB_KEY=tu_api_key_aquí
   ```

3. `react-native-dotenv` ya está en las dependencias de desarrollo. `babel.config.js` lo carga así:

   ```js
   module.exports = {
     presets: ['module:@react-native/babel-preset'],
     plugins: [
       [
         'module:react-native-dotenv',
         {
           envName: 'APP_ENV',
           moduleName: '@env',
           path: '.env',
         },
       ],
     ],
   };
   ```

4. Los tipos están en `types/env.d.ts`:

   ```ts
   declare module '@env' {
     export const THE_MOVIE_DB_KEY: string;
   }
   ```

## Ejecución

```bash
npm start
npm run android
npm run ios
```

`npm run ios` necesita macOS. En Windows el proyecto iOS ya está en la plantilla 0.88 (`AppDelegate.swift` y `SceneDelegate.swift`), pero no se ha compilado aquí.

## Navegación

El stack ya está instalado: `@react-navigation/native` 7.5.1 y `@react-navigation/stack` 7.12.1, con `react-native-screens` 4.30.0, `react-native-safe-area-context` 5.5.2 y `react-native-gesture-handler` 3.4.0. Stack 7 no usa `@react-native-masked-view/masked-view`.

`index.js` y `App.tsx` importan `react-native-gesture-handler` antes que el resto. La raíz envuelve el navegador así:

```tsx
<GestureHandlerRootView style={styles.root}>
  <SafeAreaProvider>
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  </SafeAreaProvider>
</GestureHandlerRootView>
```

Las pantallas son `Home`, `Details` (`movieId`) y `Search`. El header nativo está oculto.

En Android, `MainActivity` registra la fábrica de fragmentos de `react-native-screens` antes de `super.onCreate`:

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
  supportFragmentManager.fragmentFactory = RNScreensFragmentFactory()
  super.onCreate(savedInstanceState)
}
```

## Cliente HTTP

El proyecto sigue en React Native CLI, con las carpetas `android/` e `ios/`. No usa Expo.

`FetchAdapter` y `AxiosAdapter` cumplen el mismo contrato (`HttpAdapter`): misma URL, mismos query params, timeout de 10 s y error con status. Los dos se quedan. El activo se elige en `src/config/adapters/movieDbFetcher.ts`:

```ts
const activeAdapter = 'fetch' as 'fetch' | 'axios';
```

La base de la API es `https://api.themoviedb.org/3`.

En el emulador Android los dos clientes cargan las mismas listas y las mismas páginas de Popular. Sin red, `fetch` muestra "Network request failed" y Axios muestra "Network Error". En los dos casos la pantalla ofrece Reintentar.

## Notas

Las listas usan `ScrollView` y `FlatList` de React Native. Gesture Handler 3 renombró los suyos a `LegacyScrollView` y `LegacyFlatList`.

### Finales de línea en Windows

Windows guarda CRLF (`\r\n`). Este proyecto usa LF (`\n`). `.gitattributes` ya contiene:

```text
* text=auto eol=lf
```

Si Git en este clon convierte a CRLF, limítalo al repositorio:

```bash
git config core.autocrlf false
git add --renormalize .
```

Eso no cambia la configuración global de Git.
