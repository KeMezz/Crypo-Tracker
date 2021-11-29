import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    textColor: {
      main: string,
      accent: string,
    },
    bgColor: string,
  }
}