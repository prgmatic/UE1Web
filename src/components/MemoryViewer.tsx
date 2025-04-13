import { Register } from "../emulator/Register";
import BitDisplay from "./BitDisplay";
import ToggleSwitch from "./ToggleSwitch";

interface MemoryViewerProps {
  readMemory: (addr: number) => number;
  setToggle: (index: number, value: boolean) => void;
  resultRegister: Register;
  className?: string;
}

const MemoryViewer: React.FC<MemoryViewerProps> = ({
  readMemory,
  setToggle,
  resultRegister,
  className = "",
}) => {

  const displayRow = function (offset: number, size: number) {
    const displays = [];

    for (let i = offset; i < offset + size; i++) {
      displays.push(
        <BitDisplay getBitValue={() => readMemory(i) > 0} />
      );
    }

    return (
      <div className="flex w-full flex-row justify-center gap-3">
        {displays}
      </div>
    );
  }

  const toggleRow = function() {
    const toggles = [];

    for (let i = 0; i < 7; i++) {
      toggles.push(
        <ToggleSwitch onChange={(enabled) => setToggle(i, enabled)} />
      );
    }

    return (
      <div className="flex w-full flex-row justify-center gap-3">
        <div className="flex flex-col">
          <BitDisplay getBitValue={() => resultRegister.value > 0} />
          <div className="font-bold font-mono">RR</div>
        </div>
        {toggles}
      </div>
    );
  }

  return (

    <div className={`${className}`}>
      {displayRow(0, 8)}
      <div className="text-lg uppercase font-mono font-bold pb-4">Scratch</div>
      {displayRow(8, 8)}
      <div className="text-lg uppercase font-mono font-bold pb-4">Output</div>
      {toggleRow()}
      <div className="text-lg uppercase font-mono font-bold">Input</div>
    </div>
  );
};

export default MemoryViewer;
