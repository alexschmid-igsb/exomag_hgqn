import './PageLogo.scss'

import "@fontsource-variable/signika/wght.css"
// import '@fontsource-variable/signika';          // Supports weights 300-700
// import '@fontsource-variable/dosis';            // Supports weights 200-800
// import '@fontsource-variable/comfortaa';        // Supports weights 300-700
// import '@fontsource-variable/quicksand';        // Supports weights 300-700
// import '@fontsource/varela-round';
// import '@fontsource/fredoka-one';

import '@fontsource/indie-flower'
// import '@fontsource/opendyslexic'
// import '@fontsource/special-elite'
// import '@fontsource/poiret-one'
// import '@fontsource/swanky-and-moo-moo'
// import '@fontsource/happy-monkey'

export default function PageLogo() {
    return(
        <div className="page-logo">
            <div className="primary">ExomAG</div>
            <div className="secondary">Database</div>
        </div>
    )
}

