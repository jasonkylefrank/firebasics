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

const createThingBtn = document.getElementById('createThingBtn');
const thingsList = document.getElementById('thingsList');





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

// ------- Firestore ---------

const db = firebase.firestore();

let thingsRef;
let unsubscribe;

auth.onAuthStateChanged(user => {
    if (user) {
        thingsRef = db.collection('things');

        createThingBtn.onclick = () => {
            const { serverTimestamp } = firebase.firestore.FieldValue;

            // Add a new doc to the collection and generate the unique ID
            thingsRef.add({
                uid: user.uid,
                name: faker.commerce.productName(),
                createdAt: serverTimestamp()
            });
        };

        unsubscribe = thingsRef
            .where('uid', '==', user.uid)
            // Add this second part to the query makes it a "compound query".  This will
            //  require a "composite index" in Firestore.
            .orderBy('createdAt') 
            // .get() // If we only only wanted to read the data once
            .onSnapshot(querySnapshot => {
                const items = querySnapshot.docs.map(doc =>
                    `<li>${ doc.data().name }</li>`
                );

                thingsList.innerHTML = items.join('');
            });
    } else {
        unsubscribe && unsubscribe();
    }
});