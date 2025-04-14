import { Register } from "../Register";
import { MemoryInterface } from "./MemoryInterface";
import { PendingWrite } from "./BasicMemory";

export class UE1Ram implements MemoryInterface {
    private static _size: number = 16;
    private static _scratchSize: number = 8;
    
    private data:Uint8Array = new Uint8Array(UE1Ram._size);
    private toggles:Uint8Array = new Uint8Array(UE1Ram._scratchSize - 1);
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
        if(address >= UE1Ram._scratchSize){
            if(address == 8)
                return this._resultRegister.value;
            return this.toggles[address - 9];
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

    setToggle(index: number, value: boolean): void {
        this.toggles[index] = value ? 1 : 0;
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