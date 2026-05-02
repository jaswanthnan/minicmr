import admin from "firebase-admin";

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
    });
}

export const verifyFirebaseToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decodedUser = await admin.auth().verifyIdToken(token);
        req.user = decodedUser;

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Firebase token" });
    }
};