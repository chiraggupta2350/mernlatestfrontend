import React, { createContext, useState } from 'react'

export const addData = createContext();
export const updateData = createContext();
export const dltData = createContext();

const ContextProvider = ({ children }) => {

  const [userAdd, setuserAdd] = useState("");
  const [update, setUpdate] = useState("");
  const [deleteData, setDeleteData] = useState("");

  return (
    <>
      <addData.Provider value={{ userAdd, setuserAdd }}>
        <updateData.Provider value={{ update, setUpdate }}>
          <dltData.Provider value={{ deleteData, setDeleteData }}>
            {children}
          </dltData.Provider>
        </updateData.Provider>
      </addData.Provider>
    </>
  )
}

export default ContextProvider