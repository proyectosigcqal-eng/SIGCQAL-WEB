export const PersonalTable = ({ data, onDelete, onEdit }) => (
    <table>
        <thead>
            <tr>
                <th>Nombre</th>
                <th>CURP</th>
                <th>Activo</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {data.map(p => (
                <tr key={p.idPersonal}>
                    <td>{p.nombreCompleto}</td>
                    <td>{p.curp}</td>
                    <td>{p.activo ? 'Sí' : 'No'}</td>
                    <td>
                        <button onClick={() => onEdit(p)}>Editar</button>
                        <button onClick={() => onDelete(p.idPersonal)}>Eliminar</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);