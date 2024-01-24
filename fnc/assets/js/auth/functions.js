const Functions = {
    userSignInFromCache: async (FN) => {
        const session = await FN();
    
        if (session === undefined) {
          return session;
        }
    
        return session;
    },
    userSignIn: async (FN1, FN2) => {
        const session = FN1();
        const credentials = await session.signIn();
    
        if (credentials !== undefined) {
          /* start iot connection */
          const subscriber = FN2();
          await subscriber.connect();
        }
    
        return session;
      }
}

export const FN_cached_user = Functions.userSignInFromCache;
export const FN_user = Functions.userSignIn;