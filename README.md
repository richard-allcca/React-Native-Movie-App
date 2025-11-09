# React Native Movie App

Aplicación móvil para explorar películas usando la API de The Movie DB, desarrollada con React Native y arquitectura Domain Driven Design (DDD).

## Arquitectura utilizada

Generated on: 8/14/2025, 11:03:34 PM
Root path: `c:\Repos\React-native\03-moviesApp\src`
node: 20.10.0

```md
├── 📁 config/
│   ├── 📁 adapters/
│   │   ├── 📁 http/
│   │   │   ├── 📄 axios.adapter.ts
│   │   │   └── 📄 http.adapter.ts
│   │   └── 📄 movieDbFetcher.ts
│   └── 📁 helpers/
│       └── 📄 formatter.ts
├── 📁 core/
│   ├── 📁 entities/
│   │   ├── 📄 cast.entity.ts
│   │   └── 📄 movie.entity.ts
│   └── 📁 use-cases/
│       ├── 📁 movie/
│       │   ├── 📄 get-by-id.use-case.ts
│       │   └── 📄 get-cast.use-case.ts
│       ├── 📁 movies/
│       │   ├── 📄 now_playing.use-case.ts
│       │   ├── 📄 popular.use-case.ts
│       │   ├── 📄 top_rated.use-case.ts
│       │   └── 📄 up_coming.use-case.ts
│       └── 📄 index.ts
├── 📁 infrastructure/
│   ├── 📁 interfaces/
│   │   ├── 📄 movie-db-by-id-response.ts
│   │   ├── 📄 movie-db-cast-response.ts
│   │   └── 📄 movie-db-responses.ts
│   └── 📁 mappers/
│       ├── 📄 cast.mapper.ts
│       └── 📄 movie.mapper.ts
└── 📁 presentation/
    ├── 📁 components/
    │   ├── 📁 cast/
    │   │   └── 📄 CastActor.tsx
    │   ├── 📁 loaders/
    │   │   └── 📄 FullScreenLoader.tsx
    │   ├── 📁 movie/
    │   │   ├── 📄 MovieDetails.tsx
    │   │   └── 📄 MovieHeader.tsx
    │   ├── 📁 movies/
    │   │   └── 📄 HorizontalCarousel.tsx
    │   ├── 📄 MoviePoster.tsx
    │   └── 📄 PosterCarousel.tsx
    ├── 📁 hooks/
    │   ├── 📄 useMovie.tsx
    │   └── 📄 useMovies.tsx
    ├── 📁 navigation/
    │   └── 📄 Navigation.tsx
    └── 📁 screens/
        ├── 📁 details/
        │   └── 📄 DetailsScreens.tsx
        └── 📁 home/
            └── 📄 HomeScreen.tsx
```

## Tabla de Contenido

1. [Introducción](#introducción)
2. [Requisitos Previos](#requisitos-previos)
3. [Instalación](#instalación)
4. [Configuración de Entorno](#configuración-de-entorno)
5. [Navegación y Dependencias](#navegación-y-dependencias)
6. [Notas y Consejos](#notas-y-consejos)

---

## Introducción

Esta app permite consultar información de películas, ver detalles, elencos y navegar entre diferentes categorías usando la API de [The Movie DB](https://www.themoviedb.org/).

## Enlaces Útiles

- [Documentación de la API de The Movie DB](https://developer.themoviedb.org/reference/getting-started)
- [Documentación de React Native](https://reactnative.dev/docs/getting-started)

## Requisitos Previos

- Node.js 18
- SDK Android 34 (para desarrollo en Android)
- Tener un emulador o dispositivo físico corriendo
- Yarn o npm instalado

## Instalación

Clona el repositorio y ejecuta:

```bash
npm install
# o
yarn install
```

## Configuración de Entorno

  1. Regístrate y obtén tu API KEY y TOKEN en [The Movie DB](https://www.themoviedb.org/).

      Dentro de tu cuenta, ve a Perfil > API para generar tus credenciales.

  2. Crea un archivo `.env` en la raíz del proyecto y agrega tu variable:

      ```env
      THE_MOVIE_DB_KEY: tu_api_key_aquí
      THE_MOVIE_DB_TOKEN: tu_token_aquí
      ```

  3. Instala dotenv:

      ```bash
      npm i -D react-native-dotenv
      ```

  4. Configura el plugin en `babel.config.js`:

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
          // NOTA: Si usas otros plugins de react-native, este debe ir al final
        ],
      };
      ```

  5. (Opcional) Si usas TypeScript, crea `types/env.d.ts`:

      ```ts
      declare module '@env' {
        export const API_KEY: string;
      }
      ```

  6. Ejecución de la App

      Para iniciar el proyecto en modo desarrollo:

      ```bash
      npm run start
      # o
      yarn start
      ```

## Navegación y Dependencias

  1. Instalación de React Navigation.

     Sigue la [documentación oficial](https://reactnavigation.org/)

      ```bash
        npm install @react-navigation/native
        npm install react-native-screens react-native-safe-area-context
      ```

  2. Configuración Adicional para Android

      Edita `MainActivity.kt` o `MainActivity.java` en `android/app/src/main/java/<tu paquete>/`:

      ```kotlin
      import android.os.Bundle

      class MainActivity: ReactActivity() {
      override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(null)
      }
      }
      ```

  3. Envolviendo la App con NavigationContainer

      ```tsx
        import * as React from 'react';
        import { NavigationContainer } from '@react-navigation/native';

        export default function App() {
          return (
            <NavigationContainer>
              {/* Resto de tu app */}
            </NavigationContainer>
          );
        }
      ```

  4. Stack Navigation y Gestos

      ```bash
      npm install @react-navigation/stack
      npm install react-native-gesture-handler
      npm install @react-native-masked-view/masked-view
      ```

      Agrega al inicio de tu archivo de entrada (`index.js` o `App.js`):

      ```js
      import 'react-native-gesture-handler';
      ```

## Notas y Consejos

- Para detectar el modo oscuro:

```jsx
const isDarkMode = useColorScheme() === 'dark';
```

- Consulta la documentación oficial de cada dependencia para detalles avanzados.

---

## Problema de finales de línea (CRLF vs LF) en Windows

### ¿Por qué ocurre?

En sistemas Windows, los archivos de texto suelen guardarse con finales de línea CRLF (`\r\n`). Sin embargo, muchos proyectos multiplataforma (especialmente en React Native, Node.js, y otros frameworks modernos) prefieren el formato LF (`\n`) para evitar problemas de compatibilidad, lint y compilación entre diferentes sistemas operativos.

Si tu configuración global de Git tiene `core.autocrlf=true`, Git convertirá automáticamente los finales de línea a CRLF al guardar archivos en Windows. Esto puede causar errores en proyectos que requieren LF, como este de React Native.

### ¿Cómo solucionarlo solo para este proyecto?

Para evitar que este problema afecte otros proyectos, puedes sobrescribir la configuración de Git solo en este repositorio:

1. Crea el archivo `.gitattributes` en la raíz del proyecto con el siguiente contenido:

   ```bash
   * text=auto eol=lf
   ```

2. Ejecuta en la terminal dentro de la carpeta del proyecto:

   ```bash
   git config core.autocrlf false
   git add --renormalize .
   git commit -m "Renormalize line endings to LF for React Native project"
   ```

Esto fuerza el uso de LF solo en este proyecto, sin modificar la configuración global de Git ni afectar otros repositorios que usen CRLF.

### Recomendación

Mantén esta configuración si trabajas en proyectos multiplataforma o colaborativos. Si el resto de tus proyectos funcionan bien con CRLF, no necesitas cambiar la configuración global de Git.

---

¡Listo! Ahora puedes comenzar a desarrollar y personalizar tu Movie App 🚀
