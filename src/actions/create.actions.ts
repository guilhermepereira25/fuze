import type { Input } from "@/lib/actions/input";
import type { FileToCreate } from "@/lib/actions/file-to-create";
import path, { normalize } from 'path';
import { exists, mkdir } from "fs/promises";
import { runFileHelper } from "@/helpers/file.helper";
import { TemplatesNames } from "@/lib/helpers/templates-names-enum.helper";
import { isNamePatternInvalid, normalizeStringToKebabCase } from "@/helpers/file-name.helper";

export const create = async (inputs: Input[]) => {
    let pathInput = inputs.find((input) => input.name === 'path')?.value;
    let resourceNameInput = inputs.find((input) => input.name === 'name')?.value;
    if (!pathInput || !resourceNameInput) {
        throw new Error("Path or resource name is missing");
    }

    const currentWorkingDirectory = process.cwd();
    pathInput = pathInput.endsWith('/') ? `${pathInput}routes` : `${pathInput}/routes`;
    const pathResolved = path.join(currentWorkingDirectory, normalize(pathInput));

    if (!await exists(pathResolved)) {
        await mkdir(pathResolved, { recursive: true });
    }

    if (isNamePatternInvalid(resourceNameInput)) {
        resourceNameInput = normalizeStringToKebabCase(resourceNameInput);
    }

    await initHelperToCreateRouterFolderStructure(
        resourceNameInput,
        pathInput + `/${resourceNameInput}/`
    );
}

const initHelperToCreateRouterFolderStructure = async (resourceName: string, dirPath: string): Promise<void> => {
    await Promise.all([
        await createHandlerFile({
            resourceName,
            path: dirPath,
            fileName: `${resourceName}.handler.ts`
        }),
        await createRouterFile({
            resourceName,
            path: dirPath,
            fileName: `${resourceName}.router.ts`
        }),
        await createIndexFile({
            resourceName,
            path: dirPath,
            fileName: `${resourceName}.index.ts`
        }),
    ])
}

const createHandlerFile = async (fileInfo: FileToCreate): Promise<void> => {
    try {
        await runFileHelper(
            fileInfo.resourceName,
            TemplatesNames.handler,
            fileInfo.path + fileInfo.fileName
        );
    } catch (err) {
        console.log(err);
    }
}

const createRouterFile = async (fileInfo: FileToCreate): Promise<void> => {
    try {
        await runFileHelper(
            fileInfo.resourceName,
            TemplatesNames.router,
            fileInfo.path + fileInfo.fileName
        );
    } catch (err) {
        console.log(err);
    }
}

const createIndexFile = async (fileInfo: FileToCreate): Promise<void> => {
    try {
        await runFileHelper(
            fileInfo.resourceName,
            TemplatesNames.index,
            fileInfo.path + fileInfo.fileName
        );
    } catch (err) {
        console.error(err);
    }
}
