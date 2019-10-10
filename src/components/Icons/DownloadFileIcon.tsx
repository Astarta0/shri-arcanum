import React from 'react';

type DownloadFileIconProps = {
    className?: string
};

const DownloadFileIcon: React.FC<DownloadFileIconProps> = ({ className = '' }) => (
    <svg
        className={className}
        viewBox="0 0 38 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect
            x=".5"
            y=".5"
            width="37"
            height="27"
            rx="2.5"
            fill="#F5F5F5"
            stroke="#CCC"
        />
        <mask
            id="a"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="38"
            height="28"
        >
            <rect
                x=".5"
                y=".5"
                width="37"
                height="27"
                rx="2.5"
                fill="#fff"
                stroke="#fff"
            />
        </mask>
        <g mask="url(#a)">
            <path
                d="M24.38 15.25c.3 0 .56.12.8.33.2.23.32.49.32.8v3c0 .32-.12.58-.33.8-.23.23-.49.32-.8.32H13.13a1 1 0 0 1-.8-.33 1 1 0 0 1-.32-.8v-3c0-.3.1-.56.33-.8.2-.2.47-.32.8-.32h2.15l-1.08-1.08c-.23-.23-.32-.49-.32-.8 0-.3.11-.56.32-.8.21-.2.47-.32.8-.32h1.5V9.62c0-.3.1-.56.33-.8.2-.2.47-.32.8-.32h2.25c.3 0 .56.12.8.33.2.23.32.49.32.8v2.62h1.5c.33 0 .59.12.8.33.2.23.32.49.32.8 0 .3-.09.56-.32.8l-1.08 1.07h2.16zM15 13.37l3.75 3.76 3.75-3.75h-2.63V9.62h-2.25v3.76H15zm9.38 6v-3h-3.29l-1.54 1.55c-.24.24-.5.33-.8.33a1 1 0 0 1-.8-.33l-1.54-1.55h-3.29v3h11.26zm-2.07-1.5c0 .17.05.31.17.4.09.12.23.17.4.17.14 0 .28-.05.4-.17.09-.09.16-.23.16-.4a.66.66 0 0 0-.17-.4.66.66 0 0 0-.4-.16.56.56 0 0 0-.56.57z"
                fill="#000"
            />
        </g>
    </svg>
);

export default DownloadFileIcon;