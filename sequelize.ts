import { Sequelize } from 'sequelize';

// Configura o Sequelize
const sequelize = new Sequelize('AcademicCenterDB', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

// Testa a conexão
sequelize.authenticate()
  .then(() => {
    console.log('Conectado ao banco de dados MySQL com Sequelize.');
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });

export default sequelize;
