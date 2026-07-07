import { Routes, Route } from 'react-router-dom';
import MainScreen from './pages/MainScreen';
import CardScreen from './pages/CardScreen';
import FortuneScreen from './pages/FortuneScreen';
import DivinationScreen from './pages/DivinationScreen';
import SettingsScreen from './pages/SettingsScreen';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainScreen />} />
      <Route path="/cards/:category" element={<CardScreen />} />
      <Route path="/fortune" element={<FortuneScreen />} />
      <Route path="/divination" element={<DivinationScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
    </Routes>
  );
}
