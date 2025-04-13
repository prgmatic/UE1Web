import { Register } from "../Register";
import { BasicMemory } from "./BasicMemory";
import { MemoryInterface } from "./MemoryInterface";
import { UE1Ram } from "./UE1Ram";

export class UE1Memory {

    get program(): MemoryInterface {
        return this._program;
    }
    get randomAccess(): UE1Ram {
        return this._randomAccess;
    }

    private _program: BasicMemory;
    private _randomAccess: UE1Ram;

    constructor(resultRegister: Register) {
        this._program = new BasicMemory(0xFFF); //4096
        this._randomAccess = new UE1Ram(resultRegister);
    }

    clear() {
        this._program.clear();
        this._randomAccess.clear();
    }
    latch() {
        this._program.latch();
        this._randomAccess.latch();
    }
}