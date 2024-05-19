class DarkpoolError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DarkpoolError';
    }
}