import { getAuth, signInWithPopup, GithubAuthProvider } from "firebase/auth";

const auth = getAuth();
signInWithPopup(auth, GithubAuthProvider)
  .then((result) => {
    // This gives you a Github Access Token. You can use it to access the Github API.
    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GithubAuthProvider.credentialFromError(error);
    // ...
  });