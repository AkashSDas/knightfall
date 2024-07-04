import { Global } from "@emotion/react";

export function Fonts(): React.JSX.Element {
    return (
        <Global
            styles={`
                /* heading */
                @font-face {
                    font-family: 'Cubano';
                    font-style: normal;
                    font-weight: 400;
                    font-display: swap;
                    src: url('../../assets/fonts/cubano.ttf');
                }
            `}
        />
    );
}
