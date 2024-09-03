module.exports = {
    trailingComma: "es5",
    tabWidth: 4,
    useTabs: false,
    printWidth: 80,
    semi: true,
    singleQuote: false,
    importOrder: [
        "^@?\\w", // Matches third-party packages starting with @ or a-z
        "^@/(.*)$", // Custom @/ imports
        "^[./]", // Relative imports
    ],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    importOrderGroupNamespaceSpecifiers: true,
    plugins: ["@trivago/prettier-plugin-sort-imports"],
};
