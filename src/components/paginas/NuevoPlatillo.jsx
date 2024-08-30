import React, {useContext, useState} from 'react'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import {FirebaseContext} from '../../firebase'
import {useNavigate} from 'react-router-dom'
import FileUploader from 'react-firebase-file-uploader'

const NuevoPlatillo = () => {
	//State para las imagenes
	const [subiendo, setSubiendo] = useState(false)
	const [progreso, setProgreso] = useState(0)
	const [urlImagen, setUrlImagen] = useState("")

	//context con las operaciones de firebase
	const {firebase} = useContext(FirebaseContext)
	
	const navigate = useNavigate()


	//validacion del formulario y lectura de la informacion
	const formik = useFormik({
		initialValues: {
			nombre: "",
			precio: "",
			categoria: "",
			imagen: "",
			descripcion: ""
		},
		validationSchema: Yup.object({
			nombre: Yup.string()
				.min(3, "Como minimo deben hacer 3 caracteres")
				.required("El Nombre del Platillo es Obligatorio"),
			precio: Yup.number()
				.min(1, "Debes agregar un número")
				.required("El Precio es Obligatorio"),
			categoria: Yup.string()
				.required("La Categoria es Obligatoria"),
			descripcion: Yup.string()
				.min(10, "La Descripción debe ser más larga")
				.required("La descripción es obligatoria")
		}),
		onSubmit: platillo => {
			try {
				platillo.existencia = true;
				platillo.imagen = urlImagen;
				firebase.db.collection('productos').add(platillo)

				//Redireccionar
				navigate('/menu')
			} catch (error) {
				console.log(error)
			}
		}
	})

	//Todos los metodos para la subida de imagenes
	const handleUploadStart = () => {
		setProgreso(0)
		setSubiendo(true)
	}

	const handleUploadError = (error) => {
		setSubiendo(false)
		console.log(error)
	}

	const handleUploadSuccess = async (nombre) => {
		setProgreso(100)
		setSubiendo(false)

		//Almacenar la URL de destino
		const url = await firebase
			.storage
			.ref("productos")
			.child(nombre)
			.getDownloadURL();

		console.log(url);
		setUrlImagen(url)
		
	}

	const handleProgress = (progreso) => {
		setProgreso(progreso)
		console.log(progreso)
	}

  return (
	<>
	  <h1 className="text-3xl font-light mb-4">Nuevo Platillo</h1>

	  <div className="flex justify-center mt-10">
		<div className="w-full max-w-3xl">
			<form onSubmit={formik.handleSubmit}>
				<div className="mb-4">
					<label htmlFor="nombre" className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tinght focus:outline-none focus:shadow-outline"
						id="nombre"
						type="text"
						placeholder='Nombre Platillo'
						value={formik.values.nombre}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>
				</div>
				{ formik.touched.nombre && formik.errors.nombre ? (
					<div className='animate-shake bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-5' role="alert">
						<p className="font-bold">Hubo un Error</p>
						<p>{formik.errors.nombre}</p>
					</div>
				) : null }


				<div className="mb-4">
					<label htmlFor="precio" className="block text-gray-700 text-sm font-bold mb-2">Precio</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tinght focus:outline-none focus:shadow-outline"
						id="precio"
						type="number"
						placeholder='$20'
						min="0"
						value={formik.values.precio}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>
				</div>
				{ formik.touched.precio && formik.errors.precio ? (
					<div className='animate-shake bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-5' role="alert">
						<p className="font-bold">Hubo un Error</p>
						<p>{formik.errors.precio}</p>
					</div>
				) : null }
				<div className="mb-4">
					<label htmlFor="categoria" className="block text-gray-700 text-sm font-bold mb-2">Categoria</label>
					<select
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tinght focus:outline-none focus:shadow-outline"
						name="categoria"
						id="categoria"
						value={formik.values.categoria}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}>
						<option value="">-- Seleccione --</option>
						<option value="desayuno">Desayuno</option>
						<option value="comida">Comida</option>
						<option value="cena">Cena</option>
						<option value="bebidas">Bebidas</option>
						<option value="postre">Postre</option>
						<option value="ensaladas">Ensaladas</option>
					</select>
				</div>
				{ formik.touched.categoria && formik.errors.categoria ? (
					<div className='animate-shake bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-5' role="alert">
						<p className="font-bold">Hubo un Error</p>
						<p>{formik.errors.categoria}</p>
					</div>
				) : null }
				<div className="mb-4">
					<label htmlFor="imagen" className="block text-gray-700 text-sm font-bold mb-2">Imagen</label>
					<FileUploader
						accept="image/*"
						id="imagen"
						name="imagen"
						randomizeFilename
						storageRef={firebase.storage.ref("productos")}
						onUploadStart={handleUploadStart}
						onUploadError={handleUploadError}
						onUploadSuccess={handleUploadSuccess}
						onProgress={handleProgress}					
					/>
				</div>
				{ subiendo && (
					<div className="h-12 relative w-full border">
						<div className="bg-green-500 absolute left-0 top-0 text-white px-2 text-sm h-12 flex items-center" style={{width: `${progreso}%`}}>
							{progreso} %
						</div>
					</div>
				) }
				{ urlImagen && (
					<p className="bg-green-500 text-white p-3 text-center">La Imagen se Subio Correctamente</p>
				) }

				<div className="mb-4">
					<label htmlFor="descripcion" className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
					<textarea
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tinght focus:outline-none focus:shadow-outline h-40"
						id="descripcion"
						placeholder='Descripcion del Platillo'
						value={formik.values.descripcion}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					></textarea>
				</div>
				{ formik.touched.descripcion && formik.errors.descripcion ? (
					<div className='animate-shake bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-5' role="alert">
						<p className="font-bold">Hubo un Error</p>
						<p>{formik.errors.descripcion}</p>
					</div>
				) : null }

				<input
					type="submit"
					className='bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold cursor-pointer'
					value="Agregar Platillo"
				/>
			</form>
		</div>
	  </div>
	</>
  )
}

export default NuevoPlatillo
