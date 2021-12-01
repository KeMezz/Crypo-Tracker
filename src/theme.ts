import { DefaultTheme } from "styled-components";

export const lightTheme:DefaultTheme = {
    bgColor: "#dfe6e9",
    textColor: {
        main: "#2d3436",
        accent: "#a29bfe",
    },
    box: {
        boxBgColor: "snow",
        boxTextColor: "#2d3436",
    }
}

export const darkTheme:DefaultTheme = {
    bgColor: "#2d3436",
    textColor: {
        main: "#dfe6e9",
        accent: "#a29bfe",
    },
    box: {
        boxBgColor: "#121212",
        boxTextColor: "#dfe6e9",
    }
}