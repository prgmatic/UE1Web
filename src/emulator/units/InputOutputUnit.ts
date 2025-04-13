import { DecodedInstruction } from "../DecodedInstruction";
import { opcode } from "../DecodedInstruction";
import { MemoryInterface } from "../memory/MemoryInterface";
import { Registers } from "../Registers";

export class InputOutputUnit {
    public static executeInstruction(instruction: DecodedInstruction, registers: Registers, memoryInterface: MemoryInterface) {
        switch(instruction.opcode) {
            case opcode.load: {
                if(registers.inputEnable.value > 0) 
                    registers.result.value = memoryInterface.read(instruction.argument);
                break;
            }
            case opcode.store: {
                if(registers.outputEnable.value > 0)
                    memoryInterface.write(instruction.argument, registers.result.value);
                break;
            }
            case opcode.storeCompliment: {
                if(registers.outputEnable.value > 0)
                    memoryInterface.write(instruction.argument, registers.result.value == 0 ? 1 : 0);
                break;
            }

            case opcode.inputEnable: {
                registers.inputEnable.value = registers.result.value;
                break;
            }

            case opcode.outputEnable: {
                registers.outputEnable.value = registers.result.value;
                break;
            }
        }
    }
}