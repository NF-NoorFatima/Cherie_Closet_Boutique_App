
import React, { createContext, useState } from 'react';

export const UserContext = createContext();
import app from "../../firebaseConsole"; // your firebase config
import { getDatabase, ref, set, get } from "firebase/database";

const db = getDatabase(app);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user = { userId, email, username, loyaltyPoints }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
