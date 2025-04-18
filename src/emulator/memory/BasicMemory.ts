import { MemoryInterface } from "./MemoryInterface"

export type PendingWrite = {
    address: number, 
    value: number
};

export class BasicMemory implements MemoryInterface {
    private data:Uint16Array;
    private pendingWrites: PendingWrite[] = [];

    constructor(size: number){
        this.data = new Uint16Array(size); 
    }

    read(address: number): number {
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

    clear(): void{
        for (let i = 0; i < this.data.length; i++) {
            this.data[i] = 0;
        }
        this.pendingWrites.length = 0; 
    }

    get size(): number {
        return this.data.length;
    }

}