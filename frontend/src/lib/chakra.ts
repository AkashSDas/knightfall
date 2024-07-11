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

// This is not working
// import "@fontsource-variable/nunito";

export const theme = extendTheme({
    styles: {
        global: {
            "html, body": {
                backgroundColor: "gray.800",
                color: "gray.50",
            },
        },
    },
    components: {
        FormLabel: {
            baseStyle: {
                color: "gray.100",
                fontWeight: "bold",
            },
        },
        Input: {
            variants: {
                contained: {
                    field: {
                        height: "48px",
                        borderRadius: "10px",
                        border: "2px solid",
                        borderColor: "gray.900",
                        bgColor: "gray.400",
                        boxShadow: "inset 4px -4px 0px rgba(0,0,0,0.25)",
                        fontWeight: "500",
                        _placeholder: {
                            color: "gray.300",
                        },
                    },
                },
            },
        },
        Text: {
            baseStyle: {
                fontFamily: "body",
            },
        },
        Button: {
            baseStyle: {
                fontFamily: "display",
                fontWeight: "600",
                borderRadius: "4px",
                height: "44px",
                letterSpacing: "0.5px",
            },
            variants: {
                primary: {
                    bgColor: "brand.500",
                    borderRadius: "10px",
                    borderBottom: "6px solid",
                    borderBottomColor: "brand.700",
                    transition:
                        "background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-bottom-width 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    _hover: {
                        bgColor: "brand.600",
                        borderBottom: "6px solid",
                        borderBottomColor: "brand.700",
                        _disabled: {
                            bgColor: "brand.600",
                            borderBottom: "6px solid",
                            borderBottomColor: "brand.700",
                        },
                    },
                    _active: {
                        bgColor: "brand.600",
                        borderBottom: "2px solid",
                        borderBottomColor: "brand.700",
                    },
                },
                contained: {
                    color: "gray.800",
                    bgColor: "gray.50",
                    borderRadius: "10px",
                    borderBottom: "6px solid",
                    borderBottomColor: "gray.200",
                    transition:
                        "background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-bottom-width 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    _hover: {
                        bgColor: "gray.100",
                        borderBottom: "6px solid",
                        borderBottomColor: "gray.200",
                        _disabled: {
                            bgColor: "gray.100",
                            borderBottom: "6px solid",
                            borderBottomColor: "gray.200",
                        },
                    },
                    _active: {
                        bgColor: "gray.100",
                        borderBottom: "2px solid",
                        borderBottomColor: "gray.200",
                    },
                },
                ghost: {
                    color: "gray.200",
                    borderRadius: "10px",
                    transition:
                        "background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    _hover: {
                        bgColor: "gray.600",
                        _disabled: { bgColor: "gray.600" },
                    },
                    _active: { bgColor: "gray.700" },
                },
                subtle: {
                    fontFamily: "body",
                    borderRadius: "10px",
                    bgColor: "gray.600",
                    color: "gray.200",
                    transition:
                        "background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    _hover: {
                        bgColor: "gray.700",
                    },
                    _active: {
                        bgColor: "gray.800",
                    },
                },
            },
        },
    },
    fonts: {
        heading: `'Nunito', sans-serif`,
        body: `'Nunito', sans-serif`,
        body2: `'Nunito', sans-serif`,
        display: `'Cubano', sans-serif`,
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
