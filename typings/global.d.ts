
export { };

declare global {
    interface Date {
        Format(fmt: string): string;
    }

    interface Array<T> {
        Contains(obj: any): boolean,
        Distinct(): Array<T>,
        Remove(idx: string | number): Array<T>
    }

    interface String {
        Trim(): string
    }
};