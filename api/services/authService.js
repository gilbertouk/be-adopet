import bcrypt from 'bcrypt';

class AuthService {
  static async createHash(password) {
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    return hash;
  }

  static async authenticate(password, hash) {
    const result = bcrypt.compareSync(password, hash);

    if (result) {
      console.log('Usuário autenticado com sucesso');
      return result;
    }

    console.log('Usuário ou senha incorretos.');
    return result;
  }
}

export default AuthService;
