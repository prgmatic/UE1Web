import { describe, it, expect } from 'vitest';
import { DecodedInstruction } from './DecodedInstruction';
import { WORD_WIDTH, OPCODE_WIDTH, ARG_MASK, WORD_MASK } from './BitConstants';

describe('DecodedInstruction', () => {
  it('creates instruction with proper encoding', () => {
    const opcode = 0b101; // 5
    const argument = 0b110011001; // 409
    const instruction = DecodedInstruction.create(opcode, argument);

    // Recalculate what the encoded value should be
    const argWidth = WORD_WIDTH - OPCODE_WIDTH;
    const expectedInstruction = ((opcode & ((1 << OPCODE_WIDTH) - 1)) << argWidth) | (argument & ((1 << argWidth) - 1));
    expect(instruction.instruction).toBe(expectedInstruction & WORD_MASK);
  });

  it('extracts opcode correctly', () => {
    const opcode = 0b011;
    const argument = 0;
    const instruction = DecodedInstruction.create(opcode, argument);
    expect(instruction.opcode).toBe(opcode);
  });

  it('extracts argument correctly', () => {
    const opcode = 0b000;
    const argument = 0b1010101010101010;
    const instruction = DecodedInstruction.create(opcode, argument);
    expect(instruction.argument).toBe(argument & ARG_MASK);
  });

  it('masks instruction to WORD_MASK in constructor', () => {
    const overflow = (1 << WORD_WIDTH) | 0b101010101010101;
    const decoded = new DecodedInstruction(overflow);
    expect(decoded.instruction).toBe(overflow & WORD_MASK);
  });
});
