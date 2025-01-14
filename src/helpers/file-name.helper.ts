export const isNamePatternInvalid = (fileName: string): boolean => {
    const regex = /([a-z\d])([A-Z])/g;
    return regex.test(fileName);
}

export const normalizeStringToKebabCase = (input: string): string => {
    return input
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}
