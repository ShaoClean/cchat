import { useRoutes } from 'react-router-dom';
import routes from '@/router';

function App() {
    return <div className="h-screen bg-secondary">{useRoutes(routes)}</div>;
}

export default App;
