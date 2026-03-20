import express from 'express'
import { engine } from 'express-handlebars'
import http from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'

import { ProductModel } from './model/productModel.js'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.routes.js'

const app = express()
const PORT = 8080
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const httpServer = http.createServer(app)
const io = new Server(httpServer)

//Mongo
mongoose.connect('mongodb+srv://Shei:2hkCHo9VxOEMSTXh@backend1.lmm10x9.mongodb.net/ecommerce?retryWrites=true&w=majority')
  .then(() => console.log(' Mongo conectado'))
  .catch(err => console.log(' ERROR MONGO:', err.message))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)


app.set('io', io)

app.get('/', async (req, res) => {
  const products = await ProductModel.find()
  res.render('products', { products })
})

app.get('/realtimeproducts', async (req, res) => {
  const products = await ProductModel.find()
  res.render('products', { products })
})

//Socket
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id)

  socket.on('nuevoProducto', async (productoData) => {
    console.log('Nuevo producto (pendiente migrar a Mongo)')
  })

  socket.on('eliminarProducto', async (id) => {
    console.log('Eliminar producto (pendiente migrar a Mongo)')
  })

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id)
  })
})

httpServer.listen(PORT, () => {
  console.log(`Servidor levantado en puerto ${PORT}`)
})