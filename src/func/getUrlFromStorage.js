
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export const getUrlFromStorage = (file, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const storageInstance = getStorage();
            const storageRef = ref(storageInstance, userId);

            const blobData = await new Promise((blobResolve, blobReject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    blobResolve(xhr.response);
                };
                xhr.onerror = function (e) {
                    console.log(e);
                    blobReject(new TypeError("Network request failed"));
                };
                xhr.responseType = "blob";
                xhr.open("GET", file, true);
                xhr.send(null);
            });

            if (blobData) {
                await uploadBytes(storageRef, blobData);

                const url = await downloadUrl(userId);

                if (blobData.close) {
                    await blobData.close();
                }

                resolve(url);
            } else {
                reject(new Error("Blob data is null"));
            }
        } catch (error) {
            console.error("Error uploading or downloading image:", error);
            reject(error);
        }
    });
};

const downloadUrl = async (userId) => {
    try {
        const storageInstance = getStorage();
        const storageRef = ref(storageInstance, userId);

        const imageUrl = await getDownloadURL(storageRef);
        console.log('IMAGE URL LOADED', imageUrl);
        return imageUrl;
    } catch (error) {
        console.error("Error downloading image:", error);
        throw error;
    }
};

