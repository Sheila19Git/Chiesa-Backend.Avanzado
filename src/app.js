 import express from 'express'
import { engine } from 'express-handlebars'
import http from 'http'
import { Server } from 'socket.io'

import ProductManager from './managers/ProductManager.js'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'

const app = express()
const PORT = 8080

const productManager = new ProductManager('./src/data/products.json')
const httpServer = http.createServer(app)
const io = new Server(httpServer)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './src/views')
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.set('io', io)
app.get('/', async (req, res) => {
const products = await productManager.getProducts()
  res.render('home', { products })
})
app.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts()
  res.render('realTimeProducts', { products })
})

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id)

  socket.on('nuevoProducto', async (productoData) => {
  const nuevoProducto = await productManager.addProduct(productoData)
    
  io.emit('actualizarProductos', nuevoProducto)
  })

  socket.on('eliminarProducto', async (id) => {
    await productManager.deleteProduct(id)
    
    io.emit('actualizarEliminacion', id)
  })

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id)
  })
})

httpServer.listen(PORT, () => {
  console.log(`Servidor levantado en puerto ${PORT}`)
})