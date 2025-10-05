
// Simulamos un delay como si fuera un backend real
function fakeDelay(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Simulación de base de datos en memoria
const users = [
  { id: 1, name: "Viviana", email: "vivi@test.com", password: "123" },
];

// Iniciar sesión
export async function loginUser(email, password) {
  await fakeDelay();

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    throw new Error("Credenciales incorrectas. Intenta de nuevo.");
  }

  return {
    user: { name: user.name, email: user.email },
    token: "fake-jwt-token-" + user.id,
  };
}

// Registrar usuario
export async function registerUser(name, email, password) {
  await fakeDelay();

  const exists = users.some((u) => u.email === email);
  if (exists) {
    throw new Error("El correo ya está registrado");
  }

  const newUser = { id: users.length + 1, name, email, password };
  users.push(newUser);

  return { message: `Usuario ${name} registrado correctamente` };
}
