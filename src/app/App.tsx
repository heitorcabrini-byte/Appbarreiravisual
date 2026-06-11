import { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen'; 
import { Header } from './components/Header';
import { FilterSearchBar } from './components/FilterSearchBar';
import { AnnouncementCard } from './components/AnnouncementCard';

type ContrastMode = 'normal' | 'high-contrast' | 'inverted';

// 📋 TODOS OS 10 AVISOS REAIS EXTRAÍDOS COMPLETOS DO SEU FIGMA
const ANNOUNCEMENTS_DATA = [
  {
    id: "1",
    title: "Suspensão das Aulas — Quinta-feira 28/05",
    content: "As aulas do dia 28/05 estão suspensas em razão das fortes chuvas previstas para a região.",
    category: "Urgente",
    date: "27 de maio de 2026",
    author: "Profª Maria Helena Souza",
    tags: ["cancelamento", "chuvas", "comunicado"],
    emoji: "🚨"
  },
  {
    id: "2",
    title: "Reunião Extraordinária de Pais — Hoje às 19h",
    content: "Convocamos todos os responsáveis para reunião urgente sobre o calendário do 2º semestre.",
    category: "Urgente",
    date: "27 de maio de 2026",
    author: "Secretaria Escolar",
    tags: ["reunião", "pais", "urgente"],
    emoji: "🚨"
  },
  {
    id: "3",
    title: "Entrega de Boletins — 1º Bimestre 2026",
    content: "Os boletins do 1º bimestre estarão disponíveis para retirada a partir de 30/05.",
    category: "Importante",
    date: "26 de maio de 2026",
