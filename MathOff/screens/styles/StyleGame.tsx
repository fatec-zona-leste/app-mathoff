import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 205,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#00cc88',
    alignSelf: 'flex-start',
  },
  question: {
    fontSize: 36,
    marginVertical: 30,
  },
  finalScore: {
  fontSize: 28,
  fontWeight: 'bold',
  color: '#FFD700',
  textAlign: 'center',
  marginVertical: 16,
},
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 10,
    padding: 12,
    width: '60%',
    fontSize: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderWidth: 2,
    borderColor: '#009af2',
    borderRadius: 8,
  },
  buttonText: {
    color: '#009af2',
    fontSize: 18,
  },
  score: {
    marginTop: 30,
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalScore: {
    marginTop: 10,
    fontSize: 20,
  },
  livesContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 40,
    right: 20,
  },
  lifeDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'red',
    marginHorizontal: 4,
  },

  timer: { 
    fontSize: 18, 
    position: "absolute", 
    top: 40, 
    right: 20 
  },
});

export default styles;