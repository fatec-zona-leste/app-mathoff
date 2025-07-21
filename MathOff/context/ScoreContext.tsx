import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserEmail } from '../authSession';

type ScoreItem = {
  pontos: number;
  nivel?: number;
  operacao?: string;
  modo?: string;
};

type ScoreContextType = {
  scores: ScoreItem[];
  historico: ScoreItem[];
  addScore: (
    pontos: number,
    nivel?: number,
    operacao?: string,
    modo?: string
  ) => void;
  clearScores: () => void;
  clearRecentScores: () => void;
};

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export function ScoreProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [scores, setScores] = useState<ScoreItem[]>([]);
  const [historico, setHistorico] = useState<ScoreItem[]>([]);

  // Sempre que o email mudar, recarrega os dados
  useEffect(() => {
    const watchUserEmail = async () => {
      const interval = setInterval(async () => {
        const newEmail = await getUserEmail();
        if (newEmail !== email) {
          setEmail(newEmail);
        }
      }, 500); // checa a cada meio segundo

      return () => clearInterval(interval);
    };

    watchUserEmail();
  }, [email]);

  // Sempre que o email mudar, carrega os dados correspondentes
  useEffect(() => {
    const loadUserData = async () => {
      if (!email) return;

      const scoresKey = `scores-${email}`;
      const historicoKey = `historico-${email}`;

      const savedScores = await AsyncStorage.getItem(scoresKey);
      const savedHistorico = await AsyncStorage.getItem(historicoKey);

      setScores(savedScores ? JSON.parse(savedScores) : []);
      setHistorico(savedHistorico ? JSON.parse(savedHistorico) : []);
    };

    loadUserData();
  }, [email]);

  const persistData = async (key: string, data: ScoreItem[]) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Erro ao salvar ${key}`, error);
    }
  };

  const addScore = (
    pontos: number,
    nivel?: number,
    operacao?: string,
    modo?: string
  ) => {
    if (!email) return;

    const novo = { pontos, nivel, operacao, modo };
    const newScores = [...scores, novo];
    const newHistorico = [...historico, novo];

    setScores(newScores);
    setHistorico(newHistorico);

    persistData(`scores-${email}`, newScores);
    persistData(`historico-${email}`, newHistorico);
  };

  const clearScores = async () => {
    if (!email) return;

    setScores([]);
    setHistorico([]);

    await AsyncStorage.setItem(`scores-${email}`, JSON.stringify([]));
    await AsyncStorage.setItem(`historico-${email}`, JSON.stringify([]));
  };

  const clearRecentScores = async () => {
    if (!email) return;

    setScores([]);
    await AsyncStorage.setItem(`scores-${email}`, JSON.stringify([]));
  };

  return (
    <ScoreContext.Provider
      value={{ scores, historico, addScore, clearScores, clearRecentScores }}
    >
      {children}
    </ScoreContext.Provider>
  );
}

export function useScore() {
  const context = useContext(ScoreContext);
  if (!context) throw new Error('useScore must be used within a ScoreProvider');
  return context;
}
