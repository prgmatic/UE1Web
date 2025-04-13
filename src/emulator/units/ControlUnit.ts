import { DecodedInstruction } from "../DecodedInstruction";
import { opcode } from "../DecodedInstruction";
import { Registers } from "../Registers";

export class ControlUnit {
    public static executeInstruction(instruction: DecodedInstruction, registers: Registers): void {
        switch (instruction.opcode) {
            case opcode.nopO: {
                registers.oFlag.value = 1;
                break;
            }

            case opcode.return: {
                registers.returnFlag.value = 1;
                break;
            }

            case opcode.conditionalSkip: {
                if(registers.result.value == 0)
                    registers.conditionalSkipFlag.value = 1;
                break;
            }

            case opcode.inputOutputControl: {
                registers.ioControlFlag.value = 1;
                break;
            }

            case opcode.nopF: {
                registers.fFlag.value = 1;
                break;
            }
        }
    }
}