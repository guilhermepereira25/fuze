import * as path from 'path';
import { existsSync } from 'fs';

export const resolveRelativeTemplatePath = (importDir: string, templatePath: string): string => {
    const possiblePathsToTemplate = [
        importDir + '/../', // templates directory from importDir file.helper
        importDir + '/../src/' // src directory with templates in build
    ];
    for (const possibleTemplatePath of possiblePathsToTemplate) {
        const fullPath = path.join(possibleTemplatePath, templatePath);
        if (existsSync(fullPath)) {
            return fullPath;
        }
    }
    throw new Error(`Template not found: ${templatePath}`);
}