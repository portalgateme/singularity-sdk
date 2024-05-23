import { createNote } from '../src/';

describe('myFunction', () => {
    it('should behave as expected', () => {
        const result = createNote();
        expect(result).toBeUndefined();
    });
});