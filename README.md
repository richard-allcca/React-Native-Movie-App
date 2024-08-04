# Init

App for movies

Para API y TOKEN

[The Movie DB](https://www.themoviedb.org/)

## Navigation General (pasos necesarios para toda la navegación)

[React Navigation](https://reactnavigation.org/)

```bash
  npm install @react-navigation/native
  npm install react-native-screens react-native-safe-area-context
```

- react-native-screens package requires one additional configuration step to properly work on Android devices.
- Edit MainActivity.kt or MainActivity.java file which is located under `android/app/src/main/java/<your package name>/`.

```kotlin

  // Necesitas tener esta importación
  import android.os.Bundle;

  // Necesitas tener este override dentro de la clase
  class MainActivity: ReactActivity() {
  // ...
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
  }
  // ...
}

```

```tsx

  // Por ultimo necesitas envolver todo en 'App' con <NavigationContainer/>
  import * as React from 'react';
  import { NavigationContainer } from '@react-navigation/native';

  export default function App() {
    return (
      <NavigationContainer>{/* Rest of your app code */}</NavigationContainer>
    );
  }

```

## Type navigation 'Stack'

```bash
  npm install @react-navigation/stack
  npm install react-native-gesture-handler
  npm install @react-native-masked-view/masked-view
```

- Now, add the following at the top (make sure it's at the top and there's nothing else before it) of your entry file, such as index.js or App.js:

```tsx
  import 'react-native-gesture-handler';
```

## Notes

Dark mode

```jsx
  const isDarkMode = useColorScheme() === 'dark';
```
