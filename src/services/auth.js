// Definir la URL base de la API 
const BASE_URL = "https://api.midominio.com";

// Función auxiliar para manejar peticiones
async function request(endpoint, method, body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  // Si la respuesta falla, intentamos leer el mensaje del backend
  if (!response.ok) {
    let errorMessage = "Error en la petición";
    try {
      const errorData = await response.json();
      if (errorData.message) errorMessage = errorData.message;
    } catch {
      // Si no hay JSON válido, dejamos el mensaje genérico
    }
    throw new Error(errorMessage);
  }

  // Devolver los datos en formato JSON
  return response.json();
}

// Iniciar sesión
export async function loginUser(email, password) {
  return request("/login", "POST", { email, password });
}

// Registrar usuario
export async function registerUser(name, email, password) {
  return request("/register", "POST", { name, email, password });
}
