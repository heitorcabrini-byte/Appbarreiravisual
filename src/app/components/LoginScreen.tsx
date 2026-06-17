import { useState, useRef, useEffect, FormEvent } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, LogIn, Keyboard, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './ui/utils';
import { RegisterForm } from './RegisterForm';

type ContrastMode = 'normal' | 'high-contrast' | 'inverted';
