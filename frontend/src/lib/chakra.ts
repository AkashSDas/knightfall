import { extendTheme } from "@chakra-ui/react";

// ERROR: Comment this when generating theme types using the ChakraCLI else
// it would give the following error:
//
// Chakra UI CLI  v2.4.1 by Chakra UI
// Generate theme typings for autocomplete
// ✘ [ERROR] No loader is configured for ".woff2" files: node_modules/.pnpm/@fontsource-variable+nunito@5.0.19/node_modules/@fontsource-variable/nunito/files/nunito-latin-wght-normal.woff2
//     node_modules/.pnpm/@fontsource-variable+nunito@5.0.19/node_modules/@fontsource-variable/nunito/index.css:47:7:
//       47 │   src: url(./files/nunito-latin-wght-normal.woff2) format('woff2-variations');
//
// I've tried using unplugin-fonts/vite but it didn't worked.
//
// Also, in order to make ChakraCLI work with pnpm I had to install @chakra-ui/styled-system
// as a dev dependency. https://github.com/chakra-ui/chakra-ui/issues/5919
//
// All of this is done for using ChakraCLI for custom types in colors, ... but
// it isn't as beneficial as to go and lookout for above issues
import "@fontsource-variable/nunito";

export const theme = extendTheme({
    components: {},
    fonts: {
        heading: `'Nunito', sans-serif`,
        body: `'Nunito', sans-serif`,
        body2: `'Nunito', sans-serif`,
        cubano: `'Cubano', sans-serif`,
    },
    colors: {
        transparent: "transparent",
        black: "#000",
        white: "#fff",
        brand: {
            50: "#eef3ed",
            100: "#cbdbc7",
            200: "#b1caab",
            300: "#8eb185",
            400: "#78a26d",
            500: "#568b49",
            600: "#4e7e42",
            700: "#3d6334",
            800: "#2f4c28",
            900: "#243a1f",
        },
        gray: {
            50: "#f0f1f0",
            100: "#dbdbdb",
            200: "#c2c3c2",
            300: "#929392",
            400: "#616261",
            500: "#4e4f4e",
            600: "#303230",
            700: "#292B29",
            800: "#1f211f",
            900: "#0c0e0c",
        },
        green: {
            50: "#eef3ed",
            100: "#cbdbc7",
            200: "#b1caab",
            300: "#8eb185",
            400: "#78a26d",
            500: "#568b49",
            600: "#4e7e42",
            700: "#3d6334",
            800: "#2f4c28",
            900: "#243a1f",
        },
        red: {
            50: "#f9eeed",
            100: "#ecc9c7",
            200: "#e3afac",
            300: "#d78b86",
            400: "#cf756f",
            500: "#c3524b",
            600: "#b14b44",
            700: "#8a3a35",
            800: "#6b2d29",
            900: "#522220",
        },
        blue: {
            50: "#ecf4fa",
            100: "#c5dcf1",
            200: "#a9cbea",
            300: "#82b3e0",
            400: "#69a4da",
            500: "#448dd1",
            600: "#3e80be",
            700: "#306494",
            800: "#254e73",
            900: "#1d3b58",
        },
    },
});
