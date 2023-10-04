import firebase from "./config";

export default {
  loginUser({email, password}) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  },
  getUserData(email) {
    return firebase.firestore().doc(`users/${email}`).get();
  },
  async registerUser({ email, password, conPassword, ...payload}){
    await firebase.auth().createUserWithEmailAndPassword(email, password).then(async (res) => {
      const date = Date.now();
      await firebase.firestore().doc(`users/${email}`).set({ ...payload, email, registered: date  }).then(async () => {
        res.user.sendEmailVerification();
      })
    })
  },
  async updateUser(payload){
    const updated = Date.now();
    await firebase.firestore().doc(`users/${payload.email}`).update({ ...payload, updated })
  },
  logoutUser() {
    return firebase.auth().signOut();
  },
  resetPassword(payload) {
    return firebase.auth().sendPasswordResetEmail(payload.email);
  },
};
