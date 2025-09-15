import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; 
export default function PerfilScreen() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [nome, setNome] = useState("");
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    if (user) {
      const carregarNome = async () => {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setNome(docSnap.data().nome || "");
          }
        } catch (error) {
          console.error("Erro ao carregar nome:", error);
        }
      };
      carregarNome();
    }
  }, [user]);

  const salvarNome = async () => {
    if (!nome.trim()) {
      Alert.alert("Aviso", "O nome não pode estar vazio.");
      return;
    }
    try {
      await setDoc(doc(db, "users", user!.uid), { nome }, { merge: true });
      setEditando(false);
      Alert.alert("Sucesso", "Nome atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar nome:", error);
      Alert.alert("Erro", "Não foi possível salvar o nome.");
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Você precisa estar logado para ver o perfil.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {editando ? (
        <>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Digite seu nome"
          />
          <TouchableOpacity style={styles.button} onPress={salvarNome}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.text}>Nome: {nome || "Não definido"}</Text>
          <TouchableOpacity style={styles.button} onPress={() => setEditando(true)}>
            <Text style={styles.buttonText}>Editar Nome</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
