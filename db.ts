import mysql from 'mysql2';

// Cria uma conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',         // Seu usuário do MySQL
  password: '1666', // Sua senha do MySQL
  database: ''
});

// Conecta ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL.');
});

export default connection;
