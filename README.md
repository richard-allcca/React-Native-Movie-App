# React Native Movie App

Aplicación móvil para explorar películas usando la API de The Movie DB, desarrollada con React Native y arquitectura Domain Driven Design (DDD).

## Arquitectura recomendada

```md
src/
├── domain/
│   ├── video/
│   │   ├── entities/
│   │   ├── valueObjects/
│   │   ├── repositories/
│   │   └── services/
│   ├── user/
│   │   ├── entities/
│   │   ├── valueObjects/
│   │   ├── repositories/
│   │   └── services/
│   └── shared/
│       ├── types/
│       └── utils/
├── application/
│   ├── useCases/
│   │   ├── uploadVideo/
│   │   ├── followUser/
│   │   └── likeVideo/
│   └── dto/
├── infrastructure/
│   ├── api/
│   ├── storage/
│   ├── database/
│   └── notifications/
├── presentation/
│   ├── screens/
│   │   ├── Home/
│   │   ├── Profile/
│   │   └── VideoPlayer/
│   ├── components/
│   ├── navigation/
│   └── theme/
├── config/
│   ├── env/
│   └── constants/
└── main.tsx
```

## Tabla de Contenido

1. [Introducción](#introducción)
2. [Requisitos Previos](#requisitos-previos)
3. [Instalación](#instalación)
4. [Configuración de Entorno](#configuración-de-entorno)
5. [Ejecución de la App](#ejecución-de-la-app)
6. [Navegación y Dependencias](#navegación-y-dependencias)
7. [Notas y Consejos](#notas-y-consejos)

---

## Introducción

Esta app permite consultar información de películas, ver detalles, elencos y navegar entre diferentes categorías usando la API de [The Movie DB](https://www.themoviedb.org/).

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

1. Regístrate y obtén tu API KEY en [The Movie DB](https://www.themoviedb.org/).
2. Crea un archivo `.env` en la raíz del proyecto y agrega tu variable:

```env
API_KEY=tu_api_key_aqui
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

## Ejecución de la App

Para iniciar el proyecto en modo desarrollo:

```bash
npm run start
# o
yarn start
```

## Navegación y Dependencias

### Instalación de React Navigation

Sigue la [documentación oficial](https://reactnavigation.org/):

```bash
npm install @react-navigation/native
npm install react-native-screens react-native-safe-area-context
```

#### Configuración Adicional para Android

Edita `MainActivity.kt` o `MainActivity.java` en `android/app/src/main/java/<tu paquete>/`:

```kotlin
import android.os.Bundle

class MainActivity: ReactActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
  }
}
```

#### Envolviendo la App con NavigationContainer

```tsx
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>{/* Resto de tu app */}</NavigationContainer>
  );
}

```

### Stack Navigation y Gestos

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

¡Listo! Ahora puedes comenzar a desarrollar y personalizar tu Movie App 🚀
