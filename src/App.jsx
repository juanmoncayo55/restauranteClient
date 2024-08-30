import React from 'react'
import {Routes, Route} from 'react-router'

import firebase, {FirebaseContext} from './firebase'

import Ordenes from './components/paginas/Ordenes.jsx'
import Menu from './components/paginas/Menu.jsx' 
import NuevoPlatillo from './components/paginas/NuevoPlatillo.jsx'
import Sidebar from './components/ui/Sidebar.jsx'

const App = () => {
  return (
    <FirebaseContext.Provider
      value={{
        firebase
      }}
    >
      <div className="md:flex min-h-screen">
        <Sidebar />

        <div className="md:w-3/5 xl:w-4/5 p-6">
          <Routes>
            <Route path="/" element={<Ordenes/>} />
            <Route path="/menu" element={<Menu/>} />
            <Route path="/nuevo-platillo" element={<NuevoPlatillo/>} />
          </Routes>
        </div>
      </div>
    </FirebaseContext.Provider>
  )
}

export default App
