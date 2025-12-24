import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import './manager/i18n.ts';
import {GameDataLoader} from "./components/GameDataLoader.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GameDataLoader>
            <App />
        </GameDataLoader>
    </StrictMode>,
)