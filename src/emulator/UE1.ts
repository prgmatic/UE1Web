import { ArithmeticLogicUnit } from "./units/ArithmeticLogicUnit";
import { ControlUnit } from "./units/ControlUnit";
import { DecodedInstruction } from "./DecodedInstruction";
import { InputOutputUnit } from "./units/InputOutputUnit";
import { Registers } from "./Registers";
import { UE1Memory } from "./memory/UE1Memory";

export class UE1 {
    public registers: Registers = new Registers();
    public memory: UE1Memory = new UE1Memory(this.registers.result);

    public step(): void{
        this.registers.programCounter.latch();

        const skipNextInstruction = this.shouldSkipNextInstruction();
        this.resetTemporaryFlags();

        if(!skipNextInstruction) {
            const instruction = this.memory.program.read(this.registers.programCounter.value);
            this.executeInstruction(instruction);
        }
        
        this.registers.programCounter.value += 1;
                
    }

    public executeInstruction(instruction: number) {
        const decodedInstruction = new DecodedInstruction(instruction);

        
        const dataIn = this.memory.randomAccess.read(decodedInstruction.argument);

        ArithmeticLogicUnit.executeInstruction(decodedInstruction, this.registers, dataIn);
        ControlUnit.executeInstruction(decodedInstruction, this.registers);
        InputOutputUnit.executeInstruction(decodedInstruction, this.registers, this.memory.randomAccess);

        this.registers.latchAllButProgramCounter();
        this.memory.latch();
    }

    public reset(): void {
        this.registers.reset();
        this.memory.clear();
    }

    private shouldSkipNextInstruction(): boolean {
        return this.registers.returnFlag.value > 0 || this.registers.conditionalSkipFlag.value > 0;
    }

    private resetTemporaryFlags(): void {
        this.registers.oFlag.setAndLatch(0);
        this.registers.fFlag.setAndLatch(0);
        this.registers.returnFlag.setAndLatch(0);
        this.registers.conditionalSkipFlag.setAndLatch(0);
    }
}

