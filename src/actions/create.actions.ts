import type { Input } from "@/lib/actions/input";
import type { FileToCreate } from "@/lib/actions/file-to-create";
import { normalize } from 'path';
import { exists, mkdir } from "fs/promises";
import { runFileHelper } from "@/helpers/file.helper";
import { TemplatesNames } from "@/lib/helpers/templates-names-enum.helper";

export const create = async (inputs: Input[]) => {
    const pathInput = inputs.find((input) => input.name === 'path')?.value;
    const resourceNameInput = inputs.find((input) => input.name === 'name')?.value;
    if (!pathInput || !resourceNameInput) {
        throw new Error("Path or resource name is missing");
    }

    const currentWorkingDirectory = process.cwd();
    const pathResolved = await Bun.resolve(currentWorkingDirectory, normalize(pathInput));

    if (!await exists(pathResolved)) {
        await mkdir(pathInput);
    }

    await createFiles(resourceNameInput, pathInput + 'routes/');
}

const createFiles = async (resourceName: string, dirPath: string): Promise<void> => {
    await Promise.all([
        await createHandlerFile({
            resourceName,
            path: dirPath,
        }),
        await createRouterFile({
            resourceName,
            path: dirPath,
        }),
        await createIndexFile({
            resourceName,
            path: dirPath,
        }),
    ])
}

const createHandlerFile = async (fileInfo: FileToCreate): Promise<void> => {
    try {
        await runFileHelper(
            fileInfo.resourceName,
            TemplatesNames.handler,
            fileInfo.path + `${fileInfo.resourceName}.handler.ts`
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
            fileInfo.path + `${fileInfo.resourceName}.router.ts`
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
            fileInfo.path + `${fileInfo.resourceName}.index.ts`
        );
    } catch (err) {
        console.error(err);
    }
}
