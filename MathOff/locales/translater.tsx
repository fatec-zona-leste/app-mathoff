import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";

type Language = "pt" | "en";

const STORAGE_KEY = "@app_language";

const translations = {
    pt: {
        welcome: "Bem-vindo ao MathOff!",
        choose_your_level: "Escolha seu nível de desafio:",
        other_modes: "Outros Modos",
        level1: "Nível 1 — Fácil",
        level2: "Nível 2 — Médio",
        level3: "Nível 3 — Difícil",
        error: "Erro",
        login_error: "Erro ao fazer login.",
        profile: "Perfil",
        signup: "Cadastrar",
        signup_success: "Usuário cadastrado com sucesso!",
        signup_error: "Erro ao cadastrar usuário.",
        fill_fields: "Preencha todos os campos.",
        email_exists: "Este e-mail já está em uso.",
        invalid_email: "E-mail inválido.",
        weak_password: "A senha deve ter pelo menos 6 caracteres.",
        server_error: "Erro ao conectar com o servidor.",
        success: "Sucesso",
        email: "Email",
        password: "Senha",
        login: "Entrar",
        login_success: "Login realizado com sucesso!",
        email_not_found: "E-mail não encontrado.",
        wrong_password: "Senha incorreta.",
        user_disabled: "Usuário desativado.",
        reset_error: "Erro ao solicitar redefinição.",
        reset_success: "Email de redefinição enviado!",
        provide_email_reset: "Informe seu e-mail para redefinir a senha.",
        forgot_password: "Esqueceu sua senha?",
        no_account: "Não tem conta? Cadastre-se",
        operations: "Operações",
        choose_operation_type: "Escolha o tipo de operação:",
        level_not_specified: "Erro: nível não especificado.",
        random: "Aleatório",
        addition: "Soma (+)",
        subtraction: "Subtração (-)",
        multiplication: "Multiplicação (×)",
        division: "Divisão (÷)",
        choose_different_mode: "Escolha uma forma diferente de jogar:",
        relax: "Relax",
        hunt: "Caça",
        turbo: "Turbo",
        logout: "Sair",
        logged_in_info: "Você está logado no MathOff.",
        score_history: "Histórico de Pontuação",
        no_scores: "Nenhuma pontuação registrada.",
        game: "Jogo",
        mode: "Modo",
        level: "Nível",
        operation: "Operação",
        points: "Pontuação",
        points_suffix: "ponto(s)",
        your_stats: "Suas Estatísticas",
        games: "Jogos",
        highest_score: "Maior Pontuação",
        profile_motivation: "Obrigado por jogar o MathOff! Continue praticando e se divertindo!",
        clear_list_title: "Limpar lista de pontuações?",
        clear_list_message: "Isso irá remover apenas os cards visíveis. As estatísticas continuarão salvas.",
        clear_list: "Limpar pontuações da lista",
        clear_all_title: "Apagar tudo?",
        clear_all_message: "Isso apagará todos os dados, incluindo estatísticas e histórico.",
        clear_all: "Apagar tudo",
        cancel: "Cancelar",
        privacy_policy: "Política de Privacidade",
        account_deletion_policy: "Política de Exclusão de Conta",
        loading: "Carregando...",
        time: "Tempo",
        turbo_mode: "Turbo Mode",
        type_answer: "Digite a resposta",
        submit: "Responder",
        score: "Pontuação",
        final_score: "Pontuação final",
        end_back: "Fim! Voltar",

        game_over: "Fim de Jogo!",
        back_menu: "Voltar ao menu",
        sound_error: "Erro ao reproduzir som",
        back_to_menu: "Voltar ao menu",

        error_hunt: "Caça ao Erro",
        is_correct: "Está correta",
        is_wrong: "Está errada",
        correct: "Acertou!",
        wrong: "Errou!",
        relax_mode: "Sem contagem",
        game_mode: "Jogo",
        error_hunt_mode: "Caça ao Erro",
        // adicione outras chaves aqui...
    },
    en: {
        welcome: "Welcome to MathOff!",
        choose_your_level: "Choose your challenge level:",
        other_modes: "Other Modes",
        level1: "Level 1 — Easy",
        level2: "Level 2 — Medium",
        level3: "Level 3 — Hard",
        error: "Error",
        login_error: "Login failed.",
        profile: "Profile",
        signup: "Sign Up",
        signup_success: "User registered successfully!",
        signup_error: "Error registering user.",
        fill_fields: "Fill in all fields.",
        email_exists: "This email is already in use.",
        invalid_email: "Invalid email.",
        weak_password: "Password should be at least 6 characters.",
        server_error: "Error connecting to server.",
        success: "Success",
        email: "Email",
        password: "Password",
        login: "Login",
        login_success: "Logged in successfully!",
        email_not_found: "Email not found.",
        wrong_password: "Incorrect password.",
        user_disabled: "User disabled.",
        reset_error: "Error requesting reset.",
        reset_success: "Reset email sent!",
        provide_email_reset: "Provide your email to reset password.",
        forgot_password: "Forgot password?",
        no_account: "Don't have an account? Sign Up",
        operations: "Operations",
        choose_operation_type: "Choose the operation type:",
        level_not_specified: "Error: level not specified.",
        random: "Random",
        addition: "Addition (+)",
        subtraction: "Subtraction (-)",
        multiplication: "Multiplication (×)",
        division: "Division (÷)",
        choose_different_mode: "Choose a different way to play:",
        relax: "Relax",
        hunt: "Hunt",
        turbo: "Turbo",
        logout: "Logout",
        logged_in_info: "You are logged in to MathOff.",
        score_history: "Score History",
        no_scores: "No scores recorded.",
        game: "Game",
        mode: "Mode",
        level: "Level",
        operation: "Operation",
        points: "Points",
        points_suffix: "point(s)",
        your_stats: "Your Statistics",
        games: "Games",
        highest_score: "Highest Score",
        profile_motivation: "Thanks for playing MathOff! Keep practicing and having fun!",
        clear_list_title: "Clear score list?",
        clear_list_message: "This will remove only visible cards. Statistics will remain saved.",
        clear_list: "Clear score list",
        clear_all_title: "Clear everything?",
        clear_all_message: "This will delete all data, including stats and history.",
        clear_all: "Clear All",
        cancel: "Cancel",
        privacy_policy: "Privacy Policy",
        account_deletion_policy: "Account Deletion Policy",
        loading: "Loading...",
        time: "Time",
        turbo_mode: "Turbo Mode",
        type_answer: "Type your answer",
        submit: "Submit",
        score: "Score",
        final_score: "Final Score",
        end_back: "End! Back",

        game_over: "Game Over!",
        back_menu: "Back to menu",
        sound_error: "Error playing sound",
        back_to_menu: "Back to menu",

        error_hunt: "Error Hunt",
        is_correct: "Correct",
        is_wrong: "Wrong",
        correct: "Correct!",
        wrong: "Wrong!",
        relax_mode: "Relax Mode",
        game_mode: "Game",
        error_hunt_mode: "Error Hunt",
        // adicione outras chaves aqui...
    },
} as const;

type Dict = typeof translations["pt"];
export type TranslationKey = keyof Dict;

const LanguageContext = createContext<{
    language: Language;
    setLanguage: (lang: Language) => void;
    t: <K extends TranslationKey>(key: K) => string;
}>({
    language: "pt",
    setLanguage: () => { },
    t: (key) => translations.pt[key],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
    const deviceLang = (Localization.getLocales?.()[0]?.languageCode ?? "pt") as Language;
    const initialLang: Language = deviceLang === "en" ? "en" : "pt";

    const [language, setLanguageState] = useState<Language>(initialLang);

    useEffect(() => {
        (async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (saved === "pt" || saved === "en") setLanguageState(saved);
            } catch (e) {
                // ignore
            }
        })();
    }, []);

    const setLanguage = useCallback(
        async (lang: Language) => {
            setLanguageState(lang);
            try {
                await AsyncStorage.setItem(STORAGE_KEY, lang);
            } catch { }
        },
        []
    );

    const t = useCallback(
        <K extends TranslationKey>(key: K) => {
            const table = translations[language];
            return (table[key] as string) ?? (key as string);
        },
        [language]
    );

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
