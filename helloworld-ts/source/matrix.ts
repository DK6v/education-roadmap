
interface HasToString { toString(): string }

export class Matrix<T extends HasToString> implements Iterable<T> {

    protected _width: number;
    protected _height: number;
    protected _matrix: T[];

    constructor(width: number,
                height: number,
                element: (x: number, y: number) => T) {

        this._width = width;
        this._height = height;
        this._matrix = []

        for (let y = 0; y < this._width; y++) {
            for (let x = 0; x < this._height; x++) {

                this.set(x, y, element(x, y));
            }
        }
    }

    toString() {

        let retval = "";

        for (let y = 0; y < this._width; y++) {
            for (let x = 0; x < this._height; x++) {

                retval += this.get(x, y)
                    .toString()
                    .padEnd(2, ' ') + " ";
            }
            retval += "\n";
        }

        return retval;
    }

    get(x: number, y: number) {
        return this._matrix[x + y * this.width];
    }

    set(x: number, y: number, value: T) {
        this._matrix[x + y * this.width] = value;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get matrix() {
        return this._matrix;
    }

    [Symbol.iterator]() {

        let x: number = 0;
        let y: number = 0;

        return {
            next: () => {

                if (y == this.height) {
                    return {
                        done: true,
                        value: undefined!
                    };
                }

                let value = {
                    done: false,
                    value: this.get(x, y)
                }

                x += 1;
                if (x == this.width) {
                    x = 0;
                    y++;
                }

                return value;
            }
        }
    }
}
