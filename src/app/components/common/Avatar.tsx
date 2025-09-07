import React, { useState } from 'react';

interface AvatarProps {
    image?: string;
    label: string;
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
    image,
    label,
    size = 'medium',
    className = ''
}) => {
    const [imageError, setImageError] = useState(false);

    const getSizeClass = () => {
        switch (size) {
            case 'small':
                return 'w-8 h-8 text-xs';
            case 'large':
                return 'w-12 h-12 text-base';
            default:
                return 'w-20 h-20 text-sm';
        }
    };

    const renderAvatar = () => {
        if (image && !imageError) {
            return (
                <img
                    src={image}
                    alt={label}
                    onError={() => setImageError(true)}
                    className={`${getSizeClass()} rounded-full object-cover`}
                />
            );
        }

        return (
            <div
                className={`${getSizeClass()} rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold`}
            >
                {label.charAt(0).toUpperCase()}
            </div>
        );
    };

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {renderAvatar()}
            <span className="font-medium">{label}</span>
        </div>
    );
};

export default Avatar;
