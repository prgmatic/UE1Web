import { useState } from 'react';

type ToggleSwitchProps = {
    defaultValue?: boolean;
    onChange?: (value: boolean) => void;
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ defaultValue = false, onChange }) => {
    const [enabled, setEnabled] = useState<boolean>(defaultValue);
    
    const toggle = () => {
        setEnabled(!enabled);
        if(onChange)
            onChange(!enabled);
    };

    return (
        <div
            className={`w-6 h-10 flex items-start bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${enabled ? "bg-sky-400" : "bg-neutral-300"
                }`}
            onClick={toggle}
        >
            <div
                className={`bg-neutral-500 w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${enabled ? 'translate-y-0' : 'translate-y-4'
                    }`}
            />
        </div>
    );
}

export default ToggleSwitch;