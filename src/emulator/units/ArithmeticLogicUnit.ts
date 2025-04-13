import { DecodedInstruction } from "../DecodedInstruction";
import { opcode } from "../DecodedInstruction";
import { Registers } from "../Registers";

export class ArithmeticLogicUnit {

    public static executeInstruction(instruction: DecodedInstruction, registers: Registers, dataIn: number): void {
        switch(instruction.opcode)
        {
            case opcode.add: {
                const carryIn = registers.carry.value;
                const addResult = this.fullAdder(1, registers.result.value, dataIn, carryIn);
                console.log(`${addResult.sum} ${addResult.carryOut}`);
                registers.result.value = addResult.sum;
                registers.carry.value = addResult.carryOut;
                break;
            }
            case opcode.sub: {
                const carryIn = registers.carry.value;
                const addResult = this.fullSubtractor(1, registers.result.value, dataIn, carryIn);
                registers.result.value = addResult.difference;
                registers.carry.value = addResult.borrowOut;
                break;
            }
            case opcode.one: {
                registers.result.value = 1;
                registers.carry.value = 0;
                break;
            }
            case opcode.nand: {
                const nandResult = ~(registers.result.value & dataIn);
                registers.result.value = nandResult;
                break;
            }
            case opcode.or: {
                const nandResult = registers.result.value | dataIn;
                registers.result.value = nandResult;
                break;
            }
            case opcode.xor: {
                const nandResult = registers.result.value ^ dataIn;
                registers.result.value = nandResult;
                break;
            }
        }
    }

    public static fullAdder(bitWidth: number, a: number, b: number, carryIn: number): { sum: number, carryOut: number } {
        const resultMask = (1 << bitWidth) - 1;
        const result = a + b + carryIn;
        const sum = result & resultMask;
        const carry = (result & ~(resultMask)) > 0 ? 1 : 0;      
        return { sum, carryOut: carry };
    }

    public static fullSubtractor(bitWidth: number, a: number, b: number, borrowIn: number): { difference: number, borrowOut: number } {
        const resultMask = (1 << bitWidth) - 1;
        const result = a - b - borrowIn;
        const difference = result & resultMask;
        const borrowOut = result < 0 ? 1 : 0;
    
        return { difference: difference, borrowOut };
    }
}