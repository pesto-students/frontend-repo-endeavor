export const isLocalStorageItemsExists = () => {
    const userProfile = localStorage.getItem('userProfile');

    // Return true if userProfile is present, false otherwise
    return userProfile !== null;
};