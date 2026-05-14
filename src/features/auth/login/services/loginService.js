export const loginService = async (username, password) => {
    // TODO: Implementar la llamada real a la API para la autenticación
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulamos una respuesta exitosa
            resolve({ status: 'success', token: 'jwt_simulado_12345' });
        }, 500);
    });
};