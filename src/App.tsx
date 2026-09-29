import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import ChatAssistant from './components/ChatAssistant/ChatAssistant';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';

const Tarifs = lazy(() => import('./pages/Tarifs'));
const Confiance = lazy(() => import('./pages/Confiance'));
const Recours = lazy(() => import('./pages/Recours'));
const Faq = lazy(() => import('./pages/Faq'));
const PourquoiTillit = lazy(() => import('./pages/PourquoiTillit'));
const CommentCaMarche = lazy(() => import('./pages/CommentCaMarche'));
const Difference = lazy(() => import('./pages/Difference'));
const CasUsage = lazy(() => import('./pages/CasUsage'));
const Blog = lazy(() => import('./pages/Blog'));
const Prototype = lazy(() => import('./pages/Prototype'));
const Legal = lazy(() => import('./pages/Legal'));
const Confirmation = lazy(() => import('./pages/Confirmation'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ArticlePreter = lazy(() => import('./pages/ArticlePreter'));
const ArticleImprevu = lazy(() => import('./pages/ArticleImprevu'));

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tarifs" element={<Tarifs />} />
          <Route path="/confiance" element={<Confiance />} />
          <Route path="/recours" element={<Recours />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/pourquoi-tillit" element={<PourquoiTillit />} />
          <Route path="/comment-ca-marche" element={<CommentCaMarche />} />
          <Route path="/difference" element={<Difference />} />
          <Route path="/cas-usage" element={<CasUsage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/prototype" element={<Prototype />} />
          <Route path="/cgv" element={<Legal tab="cgv" />} />
          <Route path="/confidentialite" element={<Legal tab="confidentialite" />} />
          <Route path="/cookies" element={<Legal tab="cookies" />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/article-preter-avant-virement" element={<ArticlePreter />} />
          <Route path="/article-imprevu-echeancier" element={<ArticleImprevu />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <ChatAssistant />
    </BrowserRouter>
  );
}
