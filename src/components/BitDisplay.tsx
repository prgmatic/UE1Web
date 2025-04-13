
interface BitDisplay {
    getBitValue: () => boolean;
    className?: string;
}

const BitDisplay: React.FC<BitDisplay> = ({
    getBitValue,
    className = "",

}) => {

    const color = getBitValue() ? "bg-sky-400" : "bg-neutral-300";
    return (
        <div className={`${className} ${color} w-6 h-4 rounded-2xl`} />
    );
};

export default BitDisplay;
