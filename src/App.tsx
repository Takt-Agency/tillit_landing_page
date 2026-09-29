import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import ChatAssistant from './components/ChatAssistant/ChatAssistant';
import ScrollToTop from './components/ScrollToTop';
import PageMeta from './components/PageMeta';
import Home from './pages/Home';
import { localize } from './i18n';

const Tarifs = lazy(() => import('./pages/Tarifs'));
const Confiance = lazy(() => import('./pages/Confiance'));
const Recours = lazy(() => import('./pages/Recours'));
const Faq = lazy(() => import('./pages/Faq'));
const NotreHistoire = lazy(() => import('./pages/PourquoiTillit'));
const CommentCaMarche = lazy(() => import('./pages/CommentCaMarche'));
const Difference = lazy(() => import('./pages/Difference'));
const CasUsage = lazy(() => import('./pages/CasUsage'));
const Blog = lazy(() => import('./pages/Blog'));
const Prototype = lazy(() => import('./pages/Prototype'));
const Legal = lazy(() => import('./pages/Legal'));
const Contact = lazy(() => import('./pages/Contact'));
const Confirmation = lazy(() => import('./pages/Confirmation'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ArticlePreter = lazy(() => import('./pages/ArticlePreter'));
const ArticleImprevu = lazy(() => import('./pages/ArticleImprevu'));

// Each page is declared once with its French path; the English route comes from i18n.
const PAGES: [string, JSX.Element][] = [
  ['/', <Home />],
  ['/tarifs', <Tarifs />],
  ['/confiance', <Confiance />],
  ['/recours', <Recours />],
  ['/faq', <Faq />],
  ['/notre-histoire', <NotreHistoire />],
  ['/comment-ca-marche', <CommentCaMarche />],
  ['/difference', <Difference />],
  ['/cas-usage', <CasUsage />],
  ['/blog', <Blog />],
  ['/prototype', <Prototype />],
  ['/mentions-legales', <Legal tab="mentions" />],
  ['/conditions', <Legal tab="conditions" />],
  ['/confidentialite', <Legal tab="confidentialite" />],
  ['/cookies', <Legal tab="cookies" />],
  ['/contact', <Contact />],
  ['/confirmation', <Confirmation />],
  ['/article-preter-avant-virement', <ArticlePreter />],
  ['/article-imprevu-echeancier', <ArticleImprevu />],
  ['/404', <NotFound />],
];

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PageMeta />
      <Navbar />
      <Suspense fallback={null}>
        <Routes>
          {PAGES.flatMap(([path, element]) => [
            <Route key={path} path={path} element={element} />,
            <Route key={`en${path}`} path={localize(path, 'en')} element={element} />,
          ])}
          <Route path="/en" element={<Home />} />
          <Route path="/pourquoi-tillit" element={<Navigate to="/notre-histoire" replace />} />
          <Route path="/cgv" element={<Navigate to="/conditions" replace />} />
          <Route path="/en/*" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <ChatAssistant />
    </BrowserRouter>
  );
}
