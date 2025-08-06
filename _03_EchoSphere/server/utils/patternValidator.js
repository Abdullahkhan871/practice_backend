const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

const isValidEmail = (email) => emailPattern.test(email);
const isValidPassword = (password) => passwordPattern.test(password);

export { isValidEmail, isValidPassword };
