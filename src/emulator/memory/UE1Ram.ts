import { Register } from "../Register";
import { MemoryInterface } from "./MemoryInterface";
import { PendingWrite } from "./BasicMemory";

export class UE1Ram implements MemoryInterface {
    private static _size: number = 16;
    private static _readSize: number = 8;
    
    private data:Uint16Array = new Uint16Array(UE1Ram._size);
    private pendingWrites: PendingWrite[] = [];

    get size(): number {
        return UE1Ram._size
    }

    private _resultRegister: Register;


    constructor(resultRegister: Register){
        this._resultRegister = resultRegister;
    }

    read(address: number): number {
        if(address < 0 || address >= this.data.length)
            return 0;
        if(address >= UE1Ram._readSize){
            if(address == 8)
                return this._resultRegister.value;
            return 0; // TODO: other inputs.
        }
        return this.data[address];
    }

    readOutput(address: number): number {
        if(address < 0 || address >= this.data.length)
            return 0;
        return this.data[address];
    }
    
    write(address: number, value: number): void {
        if(address < 0 || address >= this.data.length)
            return;
        this.pendingWrites.push( { address: address, value: value } );
    }
    
    directWrite(address: number, value: number): void {
        if(address < 0 || address >= this.data.length)
            return;
        this.data[address] = value;
    }
    
    latch(): void {
        for(const pendingWrite of this.pendingWrites)
            this.data[pendingWrite.address] = pendingWrite.value;
        this.pendingWrites.length = 0;
    }

    clear(): void {
        for (let i = 0; i < this.data.length; i++) {
            this.data[i] = 0;
        }
        this.pendingWrites.length = 0; 
    }
}