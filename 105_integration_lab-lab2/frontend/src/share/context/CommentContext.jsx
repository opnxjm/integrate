import React, { createContext, useState, useMemo } from 'react';

const CommentContext = createContext();

const CommentContextProvider = ({ children }) => {
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState({});
  const commentContextValue = useMemo(()=> {
    return { 
      comments, 
      setComments,
      setStatus,
    };
  }, [comments, setComments, setStatus]); 
  return (
    <CommentContext.Provider value={ commentContextValue }>
      {children}
    </CommentContext.Provider>
  );
};

export { CommentContext, CommentContextProvider };
