require('dotenv').config();
const PORT = process.env.PORT || 5000;
const models = require('./models/models');
const sequelize = require('./db');
const cors = require('cors');
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const router = require('./routes/index');
const errorHandler = require('./middleware/errorHandling');
const path = require('path');
app.use(cors());
app.use(express.json());
// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'WORKING!!!!' }); // что бы это проверить нужно перейти по адресу  http://localhost:${PORT} делается перед тем как создашь роутеры
// });
app.use(fileUpload({}));
app.use(express.static(path.resolve(__dirname, 'static')));

app.use('/api', router);

// обработка ошибок в конце
app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () =>
      console.log(`The server is running. Server start on port ${PORT}`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
