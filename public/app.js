const auth = firebase.auth();

const whenSignedIn  = document.getElementById('whenSignedIn');
const whenSignedOut  = document.getElementById('whenSignedOut');

const googleSignInBtn  = document.getElementById('googleSignInBtn');
const createEmailAccountBtn = document.getElementById('createEmailAccountBtn');
const signInViaEmailBtn = document.getElementById('signInViaEmailBtn');
const submitCreateAccountBtn = document.getElementById('submitCreateAccountBtn');
const emailSignInSubmitBtn = document.getElementById('emailSignInSubmitBtn');

const createAccountUI = document.getElementById('createAccountUI');
const emailSignInUI = document.getElementById('emailSignInUI');


const signOutBtn  = document.getElementById('signOutBtn');

const userDetails  = document.getElementById('userDetails');

const googleProvider = new firebase.auth.GoogleAuthProvider();

googleSignInBtn.onclick = () => auth.signInWithPopup(googleProvider);



createEmailAccountBtn.onclick = async () => {

    createAccountUI.hidden = false;
    createEmailAccountBtn.hidden = true;
    googleSignInBtn.hidden = true;
    signInViaEmailBtn.hidden = true;  
};

submitCreateAccountBtn.onclick = async () => {
    
    const emailElement = document.getElementById('createAccountEmail');
    const passwordElement = document.getElementById('createAccountPassword');

    console.log(`Email: ${emailElement.value}`);
    console.log(`Password: ${passwordElement.value}`);
    
    try {
        const userCredential = 
            await auth.createUserWithEmailAndPassword(emailElement.value, passwordElement.value);
        
    } catch (error) {
        console.log(error);
    }
}


signInViaEmailBtn.onclick = () => {
    emailSignInUI.hidden = false;
    createEmailAccountBtn.hidden = true;
    googleSignInBtn.hidden = true;
    signInViaEmailBtn.hidden = true;
};

emailSignInSubmitBtn.onclick = () => {
    alert("todo");

    // See: https://firebase.google.com/docs/auth/web/password-auth#sign_in_a_user_with_an_email_address_and_password
    
};


signOutBtn.onclick = () => auth.signOut();


auth.onAuthStateChanged(user => {
    const isSignedIn = Boolean(user);
    if (isSignedIn) {
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `
            <h3>Hello ${user.displayName} </h3>
            <p>UID: ${user.uid}</p>
        `;
    } else {
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;

        createAccountUI.hidden = true;
        emailSignInUI.hidden = true;
        
        userDetails.innerHTML = ``;
    }
});