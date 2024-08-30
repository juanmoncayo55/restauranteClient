import React, {useEffect, useState, useContext} from 'react';
import { FirebaseContext } from '../../firebase/';
import Orden from '../ui/Orden.jsx';

const Ordenes = () => {

	//context con las operaciones de firebase
	const { firebase } = useContext(FirebaseContext)
	const [ordenes, setOrdenes] = useState([])

	useEffect(() => {
		const obtenerOrdenes = () => {
			firebase.db.collection('ordenes').where('completado', '==', false).onSnapshot(manejarSnapshot);
		}

		obtenerOrdenes();
	}, []);

	function manejarSnapshot(snapshot) {
		const ordenes = snapshot.docs.map(doc => {
			return {
				id: doc.id,
				...doc.data()
			}
		});

		setOrdenes( ordenes );
	}

  return (
	<>
	  <h1 className="text-3xl font-light mb-4">Ordenes</h1>
	  <div className="flex flex-wrap gap-x-5 justify-center">
		  {
		  	ordenes.map(orden => (
		  		<Orden
		  			key={orden.id}
		  			orden={orden}
		  		/>
		  	))
		  }
	  </div>
	</>
  )
}

export default Ordenes
