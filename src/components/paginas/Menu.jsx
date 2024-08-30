import React, {useState, useEffect, useContext} from 'react'
import {Link} from 'react-router-dom'
import {FirebaseContext} from '../../firebase' //Importamos el context de firebase para poderlo usar en este archivo
import Platillo from '../ui/Platillo'

const Menu = () => {
	const [platillos, setPlatillos] = useState([])
	const {firebase} = useContext(FirebaseContext) //agregamos el context de todo el proyecto a este archivo js, ademas extraemos la propiedad firebase para poder acceder a la bd de firebase

	//consultar la base de datos al cargar
	useEffect(() => {
	  const obtenerPlatillo = () => {
		const resultado = firebase.db.collection("productos").onSnapshot(manejarSnapshot)
	  }
	  obtenerPlatillo();
	}, [])

	function manejarSnapshot(snapshot){
		const platillos = snapshot.docs.map(doc => {
			return {
				id: doc.id,
				...doc.data()
			}
		})

		setPlatillos(platillos)
	}


  return (
	<>
		<h1 className="text-3xl font-light mb-4">Menu</h1>
		<Link to="/nuevo-platillo" className="bg-blue-800 hover:bg-blue-700 inline-block mb-5 p-2 text-white uppercase font-bold">
			Agregar Platillo
		</Link>

		{platillos.map(platillo => (
			<Platillo
				key={platillo.id}
				platillo={platillo}
			/>
		))}
	</>
  )
}

export default Menu
