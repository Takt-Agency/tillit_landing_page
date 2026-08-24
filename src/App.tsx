import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import ChatAssistant from './components/ChatAssistant/ChatAssistant';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';

const Tarifs = lazy(() => import('./pages/Tarifs'));

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tarifs" element={<Tarifs />} />
        </Routes>
      </Suspense>
      <ChatAssistant />
    </BrowserRouter>
  );
}
