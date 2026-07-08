import React, { useState, useEffect } from 'react';
import * as service from '../services/personalService'; // Asegúrate de la ruta correcta
import styles from '../styles/FormPersonal.module.css';

const FormPersonal = ({ onSave , onCancel, personalData}) => {
    const [catalogos, setCatalogos] = useState({
        estados: [],
        municipios: [],
        tiposPersona: []
    });

    const [formData, setFormData] = useState({
        idPerdonal:'', nombre: '', apellidoPaterno: '', apellidoMaterno: '', curp: '', rfc: '', 
        correo: '', telefono: '', telefonoFijo: '', comunidad: '', rec: '', 
        identificacionOficial: '', numeroIdFolio: '', tipoIdentificacion: '', 
        idTipoPersona: '', activo: true, calle: '', numExt: '', numInt: '', 
        colonia: '', cp: '', idMunicipio: '', idEstado: ''
    });

    useEffect(() => {
        const cargarCatalogos = async () => {
            try {
                const [resEdo, resMun, resTipo] = await Promise.all([
                    service.getEstados(),
                    service.getMunicipios(),
                    service.getTiposPersona()
                ]);
                setCatalogos({
                    estados: resEdo.data,
                    municipios: resMun.data,
                    tiposPersona: resTipo.data
                });
            } catch (error) {
                console.error("Error al cargar catálogos:", error);
            }
        };
        cargarCatalogos();
    }, []);

    useEffect(() => {
    if (personalData) {
        console.log("Datos recibidos para edición:", personalData); // <-- MIRA LA CONSOLA
        const partesNombre = personalData.nombreCompleto ? personalData.nombreCompleto.split(' ') : ['', '', ''];
        // Mapeamos los datos del servidor a tu estado
        // IMPORTANTE: Asegúrate de que las llaves coincidan con lo que devuelve el API
        setFormData({
            // Si el API devuelve "nombreCompleto" y tú tienes "nombre", debes mapearlo:
            nombre: partesNombre[0] || '', 
            apellidoPaterno: partesNombre[1] || '', 
            apellidoMaterno: partesNombre[2] || '', 
            curp: personalData.curp || '',
            rfc: personalData.rfc || '',
            correo : personalData.correo || '',
            telefono: personalData.telefono || '',
            telefonoFijo: personalData.telefonoFijo || '',
            comunidad: personalData.comunidad || '',
            rec: personalData.rec || '',
            identificacionOficial: personalData.identificacionOficial || '',
            numeroIdFolio: personalData.numeroIdFolio || '',
            tipoIdentificacion: personalData.tipoIdentificacion || '',
            idTipoPersona: personalData.idTipoPersona || '',
            activo: personalData.activo || '',
            calle: personalData.calle || '',
            numExt: personalData.numExt || '',
            numInt: personalData.numInt || '',
            colonia: personalData.colonia || '',
            cp: personalData.cp || '',
            idMunicipio: personalData.idMunicipio || '',
            idEstado: personalData.idEstado || '',
        });
    } else {
        // Limpieza si no hay personalData
        setFormData({
            nombre: '', apellidoPaterno: '', apellidoMaterno: '', curp: '', rfc: '', 
            correo: '', telefono: '', telefonoFijo: '', comunidad: '', rec: '', 
            identificacionOficial: '', numeroIdFolio: '', tipoIdentificacion: '', 
            idTipoPersona: '', activo: true, calle: '', numExt: '', numInt: '', 
            colonia: '', cp: '', idMunicipio: '', idEstado: ''
        });
    }
}, [personalData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            {/* SECCIÓN 1: DATOS GENERALES */}
            <fieldset className={styles.fieldset}>
                <legend>{personalData ? "Editar Personal" : "Registrar Personal"}</legend>
                <div className={styles.formGroup}>
                    <input name="nombre" value={formData.nombre || ''} className={styles.formInput} placeholder="Nombre(s)" onChange={handleChange} />
                    <input name="apellidoPaterno" value={formData.apellidoPaterno || ''} className={styles.formInput} placeholder="Apellido Paterno" onChange={handleChange} />
                    <input name="apellidoMaterno" value={formData.apellidoMaterno || ''} className={styles.formInput} placeholder="Apellido Materno" onChange={handleChange} />
                    <input name='telefono'  value={formData.telefono || ''} className={styles.formInput} placeholder="Teléfono" onChange={handleChange}/>
                </div>

                <div className={styles.formGroup}>
                    <input name="curp" value={formData.curp || ''} className={styles.formInput} placeholder="CURP" onChange={handleChange} />
                    <input name="rfc" value={formData.rfc || ''} className={styles.formInput} placeholder="RFC" onChange={handleChange} />
                    <select name="idTipoPersona" value={formData.idTipoPersona || ''} className={styles.formSelect} onChange={handleChange}>
                        <option value="">Tipo de Persona</option>
                        {catalogos.tiposPersona.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                    </select>
                    <input name="correo" value={formData.correo || ''} className={styles.formInput} placeholder="Correo" onChange={handleChange} />
                </div >
            
                <div className={styles.formGroup}>
                    <input name="tipoIdentificacion" value={formData.tipoIdentificacion || ''} className={styles.formInput} placeholder="Tipo de identificación" onChange={handleChange} />
                    <input name="identificacionOficial" value={formData.identificacionOficial || ''} className={styles.formInput} placeholder="Número de identificación" onChange={handleChange} />  
                </div>
            </fieldset>

            {/* SECCIÓN 2: DOMICILIO */}
            <fieldset className={styles.fieldset}>
                <legend>Domicilio</legend>
                <div className={styles.formGroup}>
                    <input name="calle" value={formData.calle || ''} className={styles.formInput} placeholder="Calle" onChange={handleChange} />
                    <input name="numExt" value={formData.numExt || ''} className={styles.formInput} placeholder="Núm. Ext" onChange={handleChange} />
                    <input name="numInt" value={formData.numInt || ''} className={styles.formInput} placeholder="Núm. Int" onChange={handleChange} />
                    <input name="colonia" value={formData.colonia || ''} className={styles.formInput} placeholder="Colonia" onChange={handleChange} />
                </div>

                <div className={styles.formGroup}>
                    <select name="idEstado" value={formData.idEstado || ''} className={styles.formSelect} onChange={handleChange}>
                        <option value="">Estado</option>
                        {catalogos.estados.map(e => <option key={e.id} value={e.id}>{e.nombreEstado}</option>)}
                    </select>
                    <select name="idMunicipio" value={formData.idMunicipio || ''} className={styles.formSelect} onChange={handleChange}>
                        <option value="">Municipio</option>
                        {catalogos.municipios.map(m => <option key={m.id} value={m.id}>{m.nombreMunicipio}</option>)}
                    </select>
                    {/* Espacios extra para que no se estiren demasiado los selects */}
                    <input name="cp" value={formData.cp || ''} className={styles.formInput} placeholder="Código Postal" onChange={handleChange} />
                    <div /> 
                    <div />
                </div>
            </fieldset>

            <div className={styles.buttonGroup}>
                <button type="submit" className={styles.btnSubmit}>
                    {personalData ? "Actualizar Registro" : "Guardar Registro"}
                </button>
                <button 
                    type="button" 
                    className={styles.btnCancel} 
                    onClick={onCancel}
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
};

export default FormPersonal;