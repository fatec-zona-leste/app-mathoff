import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'userToken';
const EMAIL_KEY = 'userEmail';

// authSession.ts
export const setUserEmail = async (email: string) => {
  try {
    await AsyncStorage.setItem('userEmail', email);
  } catch (error) {
    console.error('Erro ao salvar email:', error);
  }
};

export const getUserEmail = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('userEmail');
  } catch (error) {
    console.error('Erro ao obter email:', error);
    return null;
  }
};



export const clearUserEmail = async () => {
  try {
    await AsyncStorage.removeItem(EMAIL_KEY);
  } catch (error) {
    console.error('Erro ao remover e-mail:', error);
  }
};

export const setUserToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Erro ao salvar token:', error);
  }
};

export const getUserToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Erro ao obter token:', error);
    return null;
  }
};

export const clearUserToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Erro ao remover token:', error);
  }
};
