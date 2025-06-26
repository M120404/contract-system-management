import { auth } from '../firebase'; 

export const getFirebaseToken = async () => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  throw new Error('User not authenticated');
};
