const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const chalk = require('chalk');
const moment = require('moment');
const _ = require('lodash');


const http = require('http');
http
  .createServer(async function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    const data = await getData() //funcion getdata consulta a la api y devuelve los valores
    const responseFormat = []; // nuevo arreglo con los formatos para devolver 
    _.forEach(data, function(value, index) {
      responseFormat.push(`${index + 1}. ${formatValue(value)}`) // push meter el elemento formateado al nuevo arreglo
    });
    res.write(responseFormat.join('\n')) // nuevo arreglo une cada uno de los elementos con un salto de linea 
    res.end();
  })
    .listen(8080, () => 
      console.log('Escuchando el puerto 8080'))

const getData = async () => {
  const response = await axios.get("https://randomuser.me/api/?results=7").catch((e) => {
    console.log(e)
  })
  if (!response) return []; // si por algun motivo d¡es undefined devuelve un arreglo vacio

  const newList = []

  const { data: { results } } = response

  _.forEach(results, function(value) {
    const newData = {
      name: value.name.first || 'Sin Informacion',
      lastName: value.name.last || 'Sin Informacion',
      ID: uuidv4().slice(-6),
      timestamp: moment(value.registered.data).format('MMMM Do YYYY, LTS'),
    }
    console.log(chalk.blue.bgWhite.bold(formatValue(newData)));
    newList.push(newData)
    
  });

  return newList;
}

const formatValue = (data) => `Nombre: ${data.name} - Apellido: ${data.lastName} - ID: ${data.ID} - timestamp: ${data.timestamp}`;
