import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f8',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  profileButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  button1: {
    width: '100%',
    backgroundColor: "#04DB68",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginVertical: 10,
    alignItems: 'center',
    elevation: 3,
    borderWidth: 2, 
    borderColor: 'green',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  button2: {
    width: '100%',
    backgroundColor: "#E1D045",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginVertical: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    borderWidth: 2,
    borderColor: 'yellow', 
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  button3: {
    width: '100%',
    backgroundColor: "#E16E46",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginVertical: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    borderWidth: 2,
    borderColor: 'red', 
    shadowOffset: { width: 0, height: 2 },
  },
  button: {
    width: '100%',
    backgroundColor: "#3489DE",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginVertical: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    borderWidth: 2,
    borderColor: 'blue', 
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  topLeftButton: {
  position: "absolute",
  top: 40,
  left: 20,
  zIndex: 10,
},

modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "center",
  alignItems: "center",
},

modalBox: {
  backgroundColor: "#fff",
  padding: 30,
  borderRadius: 15,
  alignItems: "center",
  width: "80%",
},

modalTitle: {
  fontSize: 22,
  fontWeight: "bold",
  marginBottom: 20,
},

modalText: {
  fontSize: 18,
  marginLeft: 10,
  marginRight: 10,
},

row: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
},

});

export default styles;