// ThemeContext.js

import { createContext, useState } from 'react';

export const ThemeContext = createContext();

/* Aquí empieza nuestro ContextProvider
   Definimos el Provider para nuestro Context, es importante mandar
   como props los children que pueda contener */
export const ThemeProvider = ({ children }) => {
  // Uso de useState para almacenar y modificar los datos de nuestro Context
  const [theme, setTheme] = useState(false);

  /* Envolvemos los children dentro del Provider, enviando como value los
     datos que almacenamos en el state y la función para modificar el state */
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
