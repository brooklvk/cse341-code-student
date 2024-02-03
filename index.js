const express = require('express');
const cors = require('cors');
const app = express();
const swagger = require('swagger-autogen')();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger_output.json'); 

app
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use('/', require('./routes'))
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));// Serve the Swagger UI at a specific endpoint


const db = require('./models');
db.mongoose
  .set('strictQuery', true)
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
  });

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes/index.js']; // This is the endpoint file
swagger(outputFile, endpointsFiles);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
