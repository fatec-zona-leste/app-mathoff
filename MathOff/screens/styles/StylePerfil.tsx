import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  info: { fontSize: 16, marginBottom: 20 },
  subtitle: { fontSize: 20, fontWeight: '600', marginBottom: 10 },

  scrollArea: { width: '100%', maxHeight: 300 },
  cardsContainer: { paddingBottom: 20 },
  noScore: { fontSize: 16, textAlign: 'center', marginTop: 10 },

  footer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  footerText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 4,
  },
  statsText: {
    fontSize: 13,
    color: '#555',
  },

  card: {
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  cardText: { fontSize: 16 },

  // Card animado de estatísticas
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b5998',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  statsItem: {
    alignItems: 'center',
    flex: 1,
  },
  statsValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e90ff',
  },
  statsLabel: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  statsMotivation: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginTop: 8,
  },

  // Botão para limpar apenas a lista
  clearButton: {
    marginTop: 10,
    backgroundColor: '#E1D045',
    borderColor: 'gold',
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  clearText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 15,
  },

  logoutButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#E16E46',
    borderWidth: 2,
    borderColor: 'red',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    zIndex: 10,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },


  dangerButton: {
    marginTop: 10,
    backgroundColor: '#ff4d4d',
    borderColor: '#cc0000',
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  dangerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  linksContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },

  linkText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
    fontSize: 14,
    marginVertical: 4,
  },

});

export default styles;