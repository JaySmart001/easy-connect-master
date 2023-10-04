import firebase from "./config";

export default {
    async fetchCategories() {
      let categories = [];
      await firebase.firestore().doc('utilities/general').get().then(async (doc)=> {
        categories = doc.data().categories
      })
      return categories;
    },
    async fetchListings() {
        var listings = [];
        await firebase.firestore().collection('listings').get().then(async (res)=> {
            new Promise((resolve, reject) => {
            res.docs.forEach((doc, index, array) => {
                const newDoc = doc.data()
                newDoc['id'] = doc.id
                listings.push(newDoc)
                if (index === array.length -1) resolve();
            })
            });
        })
        return listings
    },
    async fetchUsersCount() {
        const res = await firebase.firestore().collection('users').get();
        return res.docs.length;
    },
    async addBusiness({ businessImages, ...payload }) {
        var id = '';
        return new Promise(async (resolve, reject) => {
            const date = Date.now()
            var images = []
            await firebase.firestore().collection('listings').add({ ...payload, active: true, created: date  }).then(async (res) => {
                id = res.id;
                var bar = new Promise((resolve, reject) => {
                    businessImages.filter((img) => typeof(img) !== 'string').forEach(async (image, index, array) => {
                        const imageRef = firebase.storage().ref().child(`listings/${res.id}/images${index + 1}`)
                        await imageRef.put(image, { contentType: 'image/jpeg' }).then(async () => {
                            await imageRef.getDownloadURL().then(async (downloadURL) => {
                                await firebase.firestore().doc(`listings/${res.id}`).update({ businessImages: firebase.firestore.FieldValue.arrayUnion({ label: `images${index + 1}`, file: downloadURL}) }).then(() => {
                                    images[index] = { label: `images${index + 1}`, file: downloadURL}
                                    if(images.length == array.length) resolve()
                                })
                            });
                        });
                    });
                });
                bar.then(async () => {
                    resolve(id)
                }).catch((err) => reject(err));;
            }).catch((err) => reject(err));
        })
    },
    async updateBusiness(id, { businessImages, ...payload }) {
        await new Promise(async (resolve, reject) => {
            const date = Date.now()
            var images = []
            await firebase.firestore().doc(`listings/${id}`).update({ ...payload, updated: date  }).then(async (res) => {
                const bar = new Promise((resolve, reject) => {
                    businessImages.filter((img) => img !== '').forEach(async (image, index, array) => {
                        if (image?.hasOwnProperty('file')) {
                            images[index] = { label: `images${index + 1}`, file: image.file }
                            if(images.length == array.length ) resolve()
                        } else {
                            const imageRef = firebase.storage().ref().child(`listings/${id}/images${index + 1}`)
                            await imageRef.put(image, { contentType: 'image/jpeg' }).then(async () => {
                                await imageRef.getDownloadURL().then(async (downloadURL) => {
                                    await firebase.firestore().doc(`listings/${id}`).update({ businessImages: firebase.firestore.FieldValue.arrayUnion({ label: `images${index + 1}`, file: downloadURL}) }).then(() => {
                                        images[index] = { label: `images${index + 1}`, file: downloadURL}
                                        if(images.length == array.length ) resolve()
                                    })
                                });
                            })
                        }
                    });
                });
                
                bar.then(async () => {
                    resolve()
                }).catch((err) => reject(err));
            }).catch((err) => reject(err))
        })
    },
    async updateGuarantorInfo(id, { guarantorId, nationalId, ...payload }) {
        const date = Date.now()
        await firebase.firestore().doc(`listings/${id}`).update({ ...payload, updated: date  }).then(async (res) => {
            if(guarantorId !== '') {
                const guarantorIdRef = firebase.storage().ref().child(`listings/${id}/guarantorId`)
                await guarantorIdRef.put(guarantorId, { contentType: 'image/jpeg' }).then(async () => {
                    await guarantorIdRef.getDownloadURL().then(async (downloadURL) => {
                        await firebase.firestore().doc(`listings/${id}`).update({ guarantorId: downloadURL })
                    });
                })
            }
            if(nationalId !== '') {
                const nationalIdRef = firebase.storage().ref().child(`listings/${id}/nationalId`)
                await nationalIdRef.put(nationalId, { contentType: 'image/jpeg' }).then(async () => {
                    await nationalIdRef.getDownloadURL().then(async (downloadURL) => {
                        await firebase.firestore().doc(`listings/${id}`).update({ nationalId: downloadURL })
                    });
                })
            }
        })
        return id;
    },
    async paid(businessID, ref, amount) {
        const plan = (amount === 0 ) ? 'starter' : (amount === 10000) ? 'premium' : 'gold' 
        const date = Date.now()
        await firebase.firestore().doc(`listings/${businessID}`).update({
            plan, paid: date, transactionID: ref
        })
    },
    async deleteBusiness() {

    }
};

