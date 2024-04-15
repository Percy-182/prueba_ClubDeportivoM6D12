import fs from "fs";
import express from "express";
import path from "path";

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(
    `El servidor está inicializado en el puerto http://localhost:${port}`
  );
});

// Middleware para servir archivos estáticos desde la carpeta public
app.use(express.static("public"));

// Manejar las solicitudes a la ruta raíz y enviar el archivo index.html como respuesta
// app.get("/", (req, res) => {
//   res.sendFile(__dirname, "/index.html");
// });

//1. Crear una ruta que reciba el nombre y precio de un nuevo deporte, lo persista en un archivo JSON
app.get("/agregar", (req, res) => {
  const { nombre, precio } = req.query;
  const nuevoDeporte = {
    nombre,
    precio,
  };

  const data = JSON.parse(fs.readFileSync("nuevoDeporte.json", "utf-8"));
  const nuevosDeportes = data.nuevoDeporte;
  nuevosDeportes.push(nuevoDeporte);

  fs.writeFileSync("nuevoDeporte.json", JSON.stringify(data));
  res.send(`Deporte: ${deporte} guardado con éxito`);
  //console.log([nuevoDeporte.nombre, nuevoDeporte.precio]);
});

// 2. Crear una ruta que al consultarse devuelva en formato JSON todos los deportes registrados (2 Puntos).

// Ruta para devolver todos los usuarios de archivo Json.
app.get("/deportes", (req, res) => {
  //Parseo de Json.
  const data = JSON.parse(fs.readFileSync("nuevoDeporte.json", "utf-8"));
  res.json(data);
});

// Ruta para modificar el precio de un deporte
app.get("/editar", (req, res) => {
  const { nombre, precio } = req.query; // Obtener nombre y precio de la consulta

  // Leer el archivo JSON de deportes
  fs.readFile("nuevoDeporte.json", "utf8", (err, data) => {
    if (err) {
      // Manejar error si no se puede leer el archivo
      return res.status(500).send(`Error no es posible leer el archivo.`);
    }

    // Parsear el contenido del archivo JSON a un objeto JavaScript
    const objeto = JSON.parse(data);

    // Buscar el deporte por su nombre
    const deporte = objeto.nuevoDeporte.find((d) => d.nombre === nombre);

    // Si se encuentra el deporte
    if (deporte) {
      // Actualizar el precio del deporte
      deporte.precio = precio;

      // Guardar los cambios en el archivo JSON
      fs.writeFile("nuevoDeporte.json", JSON.stringify(objeto), (err) => {
        if (err) {
          // Manejar error si no se puede escribir en el archivo
          return res
            .status(500)
            .send("Error al guardar los cambios en el servidor");
        }
        // Enviar respuesta de éxito
        res.send(
          `Precio: $${precio} actualizado correctamente para ${nombre}.`
        );
      });
    } else {
      // Si no se encuentra el deporte, enviar mensaje de error
      res
        .status(404)
        .send(`Error no existe Deporte ingresado de Nombre: ${deporte}.`);
    }
  });
});

// Ruta para eliminar un deporte
app.get("/eliminar", (req, res) => {
  const { nombre } = req.query;

  // Leer el contenido del archivo JSON
  const data = JSON.parse(fs.readFileSync("nuevoDeporte.json", "utf-8"));

  // Filtrar el arreglo de deportes para excluir el deporte que deseas eliminar, se añade excepcion en caso de undefined
  data.nuevoDeporte = data.nuevoDeporte.filter(
    (nuevoDeporte) =>
      nuevoDeporte.nombre !== nombre &&
      nuevoDeporte.nombre !== undefined &&
      nuevoDeporte.precio !== undefined
  );

  // Escribir el contenido actualizado en el archivo JSON
  fs.writeFileSync("nuevoDeporte.json", JSON.stringify(data));

  // Enviar una respuesta indicando que el deporte se ha eliminado con éxito
  res.send(`Deporte ${nombre} eliminado con éxito`);
});

app.get("*", (req, res) => {
  // Paso 2
  res.send("<center><h1>Sorry, aquí no hay nada :/ </h1></center>");
});
