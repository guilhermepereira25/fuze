import templatesPathConstant from "@/lib/constants/templates-path.constant";
import { type BunFile } from "bun";
import { TemplatesNames } from "@/lib/helpers/templates-names-enum.helper";

export const runFileHelper = async (
    resourceName: string,
    templateName: TemplatesNames,
    inputFilePath: string,
): Promise<void> => {
    const templateFile: BunFile = await loadTemplateFile(resolveTemplatePath(templateName));
    const fileContent = await getTemplateContent(templateFile);

    const fileOutput = Bun.file(inputFilePath);
    await writeContentToFile(fileOutput, replaceFileContent(fileContent, resourceName));
}

export const loadTemplateFile = async (templateFilePath: string): Promise<BunFile> => {
    return Bun.file(templateFilePath);
}

export const resolveTemplatePath = (template: TemplatesNames): string => {
    let templatePath: string;
    switch (template) {
        case TemplatesNames.index:
            templatePath = templatesPathConstant.INDEX_TEMPLATE_PATH;
            break;
        case TemplatesNames.handler:
            templatePath = templatesPathConstant.HANDLER_TEMPLATE_PATH;
            break;
        case TemplatesNames.router:
            templatePath = templatesPathConstant.ROUTER_TEMPLATE_PATH;
            break;
        default:
            throw new Error('TemplatePathNotImplemented');
    }

    return Bun.resolveSync(templatePath, import.meta.dir);
}

export const getTemplateContent = async (file: BunFile): Promise<string> => {
    return await file.text();
}

export const writeContentToFile = async (file: BunFile, content: string): Promise<void> => {
    await Bun.write(file, content);
}

export const replaceFileContent = (fileContent: string, resourceName: string): string => {
    return fileContent.replace(/\${resourceName}/g, resourceName);
}
