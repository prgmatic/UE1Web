import { WORD_WIDTH, OPCODE_WIDTH, ARG_MASK, WORD_MASK } from "./BitConstants";

export class DecodedInstruction {

    public instruction: number;

    public static create(opcode: number, argument: number): DecodedInstruction {
        const argWidth = (WORD_WIDTH - OPCODE_WIDTH);
        opcode &= (1 << OPCODE_WIDTH) - 1
        opcode <<= argWidth;
        argument &= ARG_MASK;
        return new DecodedInstruction(opcode | argument);
    }

    get opcode(): opcode {
        return this.instruction >>> (WORD_WIDTH - OPCODE_WIDTH);
    }

    get argument(): number {
        return this.instruction & ARG_MASK;
    }

    constructor(instruction: number) {
        this.instruction = instruction & WORD_MASK;
    }
}


export enum opcode {
    nopO,
    load,
    add,
    sub,
    one,
    nand,
    or,
    xor,
    store,
    storeCompliment,
    inputEnable,
    outputEnable,
    inputOutputControl,
    return,
    conditionalSkip,
    nopF
}
