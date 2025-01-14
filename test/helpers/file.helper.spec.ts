import { beforeAll, describe, expect, it, jest, mock } from 'bun:test';
import { runFileHelper, loadTemplateFile, resolveTemplatePath, getTemplateContent, replaceFileContent, writeContentToFile } from '@/helpers/file.helper';
import { TemplatesNames } from '@/lib/helpers/templates-names-enum.helper';
import type { BunFile } from 'bun';

mock.module('@/helpers/file.helper', () => ({
    runFileHelper: jest.fn(),
    loadTemplateFile: jest.fn().mockResolvedValue({
        text: jest.fn().mockResolvedValue('template content ${resourceNome}'),
        write: jest.fn(),
    }),
    resolveTemplatePath: jest.fn().mockResolvedValue('path/to/file'),
    getTemplateContent: jest.fn(async () => {
        return 'content ${resourceName}';
    }),
    replaceFileContent: jest.fn((string: string, stringToBeReplaced: string,) => {
        return string.replace(/\${resourceName}/g, stringToBeReplaced);
    }),
    writeContentToFile: jest.fn(),
}))

describe('file-helper', () => {
    let fileMock: BunFile;

    beforeAll(async () => {
        fileMock = {
            text: jest.fn().mockResolvedValue('template content'),
        } as unknown as BunFile;
    })

    it('should replace string content', async () => {
        const replacedContent = replaceFileContent('content ${resourceName}', 'test-resource');
        expect(replaceFileContent).toBeCalledWith(
            'content ${resourceName}',
            'test-resource'
        );
        expect(replacedContent).toBe('content test-resource');
    })

    it('should resolve template path', () => {
        const templatePath = resolveTemplatePath(TemplatesNames.index);
        expect(resolveTemplatePath).toBeCalledWith(TemplatesNames.index);
        expect(templatePath).toBeDefined();
    });

    it('should load template file', async () => {
        const templateFile: BunFile = await loadTemplateFile('path/to/template');
        expect(loadTemplateFile).toBeCalledWith('path/to/template');
        expect(templateFile).toBeDefined();
    });

    it('should get template content', async () => {
        const content = await getTemplateContent(fileMock);
        expect(getTemplateContent).toBeCalledWith(fileMock);
        expect(content).toBe('content ${resourceName}');
    });

    it('should write content to file', async () => {
        await writeContentToFile(fileMock, 'content');
        expect(writeContentToFile).toBeCalledWith(fileMock, 'content');
    });

    it('should run file helper', async () => {
        await runFileHelper('test-resource', TemplatesNames.index, 'path/to/output');
        expect(runFileHelper).toBeCalledWith('test-resource', TemplatesNames.index, 'path/to/output');
    });
})