import { Register } from "./Register";

export class Registers {
    result              : Register = new Register(1,  "RR");
    carry               : Register = new Register(1,  "CR");
    inputEnable         : Register = new Register(1,  "IE");
    outputEnable        : Register = new Register(1,  "OE");
    ioControlFlag       : Register = new Register(1,  "IOC");
    returnFlag          : Register = new Register(1,  "RTN");
    conditionalSkipFlag : Register = new Register(1,  "SKZ");
    oFlag               : Register = new Register(1,  "FLGO");
    fFlag               : Register = new Register(1,  "FLGF");
    programCounter      : Register = new Register(16, "PC");


    public latch(): void {
        this.result.latch();
        this.carry.latch();
        this.inputEnable.latch();
        this.outputEnable.latch();
        this.ioControlFlag.latch();
        this.returnFlag.latch();
        this.conditionalSkipFlag.latch();
        this.oFlag.latch();
        this.fFlag.latch();
        this.programCounter.latch();
    }

    public latchAllButProgramCounter(): void {
        this.result.latch();
        this.carry.latch();
        this.inputEnable.latch();
        this.outputEnable.latch();
        this.ioControlFlag.latch();
        this.returnFlag.latch();
        this.conditionalSkipFlag.latch();
        this.oFlag.latch();
        this.fFlag.latch();
        this.outputEnable.latch();
    }

    public reset(): void {
        this.result.setAndLatch(0);
        this.inputEnable.setAndLatch(0);
        this.outputEnable.setAndLatch(0);
        this.carry.setAndLatch(0);
        this.ioControlFlag.setAndLatch(0);
        this.returnFlag.setAndLatch(0);
        this.conditionalSkipFlag.setAndLatch(0);
        this.oFlag.setAndLatch(0);
        this.fFlag.setAndLatch(0);
        this.programCounter.setAndLatch(0);
        this.latch();
    }
}
