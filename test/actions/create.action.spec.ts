import { create } from '../../src/actions/create.actions';
import { exists, mkdir } from 'fs/promises';
import {
    mock,
    jest,
    describe,
    it,
    beforeEach,
    expect
} from 'bun:test';
import type { Input } from '@/lib/actions/input';
import { runFileHelper } from '@/helpers/file.helper';

mock.module('fs/promises', () => ({
    exists: jest.fn(),
    mkdir: jest.fn(),
}));

mock.module('@/helpers/file.helper', () => ({
    runFileHelper: jest.fn(),
    TemplatesNames: {
        handler: 'handler',
        router: 'router',
        index: 'index',
    },
}));

describe('create', () => {
    const mockInputs: Input[] = [
        { name: 'path', value: 'test/path' },
        { name: 'name', value: 'testResource' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should throw an error if path or resource name is missing', async () => {
        expect(create([])).rejects.toThrow("Path or resource name is missing");
    });

    it('should create directory if it does not exist', async () => {
        (exists as jest.Mock).mockResolvedValue(false);
        await create(mockInputs);
        expect(mkdir).toHaveBeenCalledWith('test/path');
    });

    it('should not create directory if it exists', async () => {
        (exists as jest.Mock).mockResolvedValue(true);
        await create(mockInputs);
        expect(mkdir).not.toHaveBeenCalled();
    });

    it('should call runFileHelper 3 times', async () => {
        (exists as jest.Mock).mockResolvedValue(true);
        await create(mockInputs);
        expect(runFileHelper).toHaveBeenCalledTimes(3);
    });
});