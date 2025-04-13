import { describe, it, expect } from 'vitest';
import { ArithmeticLogicUnit } from './ArithmeticLogicUnit';


describe('ALU.fullAdder', () => {
  it('adds two 4-bit numbers with no carry-in', () => {
    const { sum, carryOut } = ArithmeticLogicUnit.fullAdder(4, 5, 3, 0); // 5 + 3 = 8
    expect(sum).toBe(8);
    expect(carryOut).toBe(0);
  });

  it('adds with carry-in', () => {
    const { sum, carryOut } = ArithmeticLogicUnit.fullAdder(4, 5, 3, 1); // 5 + 3 + 1 = 9
    expect(sum).toBe(9);
    expect(carryOut).toBe(0);
  });

  it('overflows when result exceeds bit width', () => {
    const { sum, carryOut } = ArithmeticLogicUnit.fullAdder(4, 15, 1, 0); // 15 + 1 = 16
    expect(sum).toBe(0); // 16 masked to 4 bits = 0
    expect(carryOut).toBe(1);
  });

  it('max carry: 15 + 15 + 1 in 4-bit', () => {
    const { sum, carryOut } = ArithmeticLogicUnit.fullAdder(4, 15, 15, 1); // 31
    expect(sum).toBe(15); // 0b1111
    expect(carryOut).toBe(1);
  });

  it('max carry: 15 + 4 in 4-bit', () => {
    const { sum, carryOut } = ArithmeticLogicUnit.fullAdder(4, 15, 5, 0); // 31
    expect(sum).toBe(4); // 0b0100
    expect(carryOut).toBe(1);
  });


  it('works with 1-bit inputs (half adder style)', () => {
    const { sum, carryOut } = ArithmeticLogicUnit.fullAdder(1, 1, 0, 0);
    expect(sum).toBe(1); // 1 + 0 = 1
    expect(carryOut).toBe(0); // No carry
  });
});

describe('ALU.fullSubtractor', () => {
  it('subtracts two 4-bit numbers with no borrow-in', () => {
    const { difference, borrowOut } = ArithmeticLogicUnit.fullSubtractor(4, 7, 2, 0); // 7 - 2 = 5
    expect(difference).toBe(5);
    expect(borrowOut).toBe(0);
  });

  it('subtracts with borrow-in', () => {
    const { difference, borrowOut } = ArithmeticLogicUnit.fullSubtractor(4, 7, 2, 1); // 7 - 2 - 1 = 4
    expect(difference).toBe(4);
    expect(borrowOut).toBe(0);
  });

  it('underflows when result is negative', () => {
    const { difference, borrowOut } = ArithmeticLogicUnit.fullSubtractor(4, 2, 3, 0); // 2 - 3 = -1
    expect(difference).toBe(15); // -1 masked to 4 bits = 0b1111 = 15
    expect(borrowOut).toBe(1);
  });

  it('underflows when result is more negative', () => {
    const { difference, borrowOut } = ArithmeticLogicUnit.fullSubtractor(4, 2, 4, 0); // 2 - 4 = -2
    expect(difference).toBe(14); // -2 masked to 4 bits = 0b1110 = 14
    expect(borrowOut).toBe(1);
  });

  it('underflows with borrow-in', () => {
    const { difference, borrowOut } = ArithmeticLogicUnit.fullSubtractor(4, 2, 2, 1); // 2 - 2 - 1 = -1
    expect(difference).toBe(15);
    expect(borrowOut).toBe(1);
  });

  it('works with 1-bit inputs (half subtractor style)', () => {
    const { difference, borrowOut } = ArithmeticLogicUnit.fullSubtractor(1, 0, 1, 0); // 0 - 1 = -1
    expect(difference).toBe(1); // -1 masked to 1 bit = 1
    expect(borrowOut).toBe(1);
  });

  it('no borrow, edge case', () => {
    const { difference, borrowOut } = ArithmeticLogicUnit.fullSubtractor(4, 15, 0, 0); // 15 - 0 = 15
    expect(difference).toBe(15);
    expect(borrowOut).toBe(0);
  });

  it('subtracts with max values and borrow-in', () => {
    const { difference, borrowOut } = ArithmeticLogicUnit.fullSubtractor(4, 15, 15, 1); // 15 - 15 - 1 = -1
    expect(difference).toBe(15);
    expect(borrowOut).toBe(1);
  });
});