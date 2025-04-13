import React, { ReactElement } from "react";
import { Register } from "../emulator/Register";
import BitDisplay from "./BitDisplay";

interface RegisterTableProperties {
    registers: { [name: string]: Register };
}

const RegisterTable: React.FC<RegisterTableProperties> = ({ registers }) => {
    const entries = Object.entries(registers);
    const midpoint = Math.ceil(entries.length / 2);
    const firstColumn = entries.slice(midpoint);
    const secondColumn = entries.slice(0, midpoint);


    const getValueDisplay = function(register: Register): ReactElement {
        if(register.shortLabel == "PC") {
            return (
                <td className="text-right w-12">{register.value}</td>
            );
        }

        return (
            <td className="pl-2">
                <BitDisplay getBitValue={() => register.value > 0} />
            </td>
        );
    }

    return (
        <div className="pb-2 min-w-full flex items-start justify-evenly gap-4">
            {[firstColumn, secondColumn].map((column, colIdx) => (
                <table key={colIdx} className="w-18">
                    <tbody>
                        {column.map(([name, register]) => (
                            <tr key={name} className="flex items-center">
                                <td className="font-bold font-mono text-right ml-auto">{register.shortLabel}</td>
                                {getValueDisplay(register)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ))}
        </div>
    );
};

export default RegisterTable;