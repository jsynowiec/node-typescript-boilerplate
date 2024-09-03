import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';

class News extends Model {
  public id!: number;
  public title!: string;
  public content!: string;
  public user_id!: number;
  public category_id!: number;
  public published_at!: Date;
}

News.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  published_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'News',
  tableName: 'news',
  timestamps: false,
});

export default News;
