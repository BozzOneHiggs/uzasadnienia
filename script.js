document.addEventListener('DOMContentLoaded', () => {
    // --- Konfiguracja Firebase ---
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    // --- Inicjalizacja Firebase ---
    const { initializeApp } = firebase;
    const { getAuth, signInAnonymously } = firebase.auth;
    const { getFirestore, doc, onSnapshot, setDoc, getDoc, collection, addDoc, deleteDoc, updateDoc } = firebase.firestore;

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const orzeczeniaCollectionRef = collection(db, "orzeczenia");
    // ... (reszta referencji bez zmian)

    let unsubscribeOrzeczenie = null; // Do zarządzania subskrypcją onSnapshot

    // --- Wyszukiwanie i wczytywanie orzeczenia ---
    const wyszukajBtn = document.getElementById('wyszukaj_btn');
    const numerSprawyInput = document.getElementById('zn_numer_sprawy');

    wyszukajBtn.addEventListener('click', async () => {
        const numerSprawy = numerSprawyInput.value.trim();
        if (!numerSprawy) return alert('Proszę podać numer sprawy.');

        if (unsubscribeOrzeczenie) unsubscribeOrzeczenie(); // Zakończ poprzednią subskrypcję

        const orzeczenieDocRef = doc(db, "orzeczenia", numerSprawy);

        unsubscribeOrzeczenie = onSnapshot(orzeczenieDocRef, (doc) => {
            if (doc.exists()) {
                wypelnijFormularz(doc.data());
            } else {
                alert('Nie znaleziono orzeczenia o podanym numerze. Możesz wypełnić formularz i zapisać jako nowe.');
                // Opcjonalnie: wyczyść formularz
            }
        });
    });

    const wypelnijFormularz = (data) => {
        // ... (logika wypełniania formularza na podstawie danych)
    };

    // --- Ręczny zapis danych orzeczenia ---
    const zapiszDaneOrzeczeniaBtn = document.getElementById('zapisz_dane_orzeczenia_btn');

    zapiszDaneOrzeczeniaBtn.addEventListener('click', async () => {
        const numerSprawy = numerSprawyInput.value.trim();
        if (!numerSprawy) return alert('Numer sprawy jest wymagany do zapisu.');

        const data = pobierzDaneFormularza(); // Ta funkcja zbiera dane z całego formularza
        const orzeczenieDocRef = doc(db, "orzeczenia", numerSprawy);

        await setDoc(orzeczenieDocRef, data, { merge: true });
        alert('Dane orzeczenia zostały zapisane.');
    });

    // --- Usunięcie automatycznego zapisu ---
    // Usuwamy wszystkie nasłuchiwacze 'input' i 'change' z głównego formularza

    // ... (reszta kodu, w tym zarządzanie szablonami i zmiennymi, pozostaje bez zmian)
});
