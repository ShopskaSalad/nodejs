const express = require('express')
const mongoose = require('mongoose')
const Customer = require('./models/customer')

const dotenv = require('dotenv')
dotenv.config()
const app = express();
mongoose.set('strictQuery', false)


app.use(express.json())
app.use(express.urlencoded({ extended: true}))

if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION;


 const customer = new Customer({
   name: 'kamil',
   industry: 'marketing'
 });

//customer.save()



app.get('/', (req, res) => {
  res.send("welcome")
})

app.get('/api/customers', async (req, res) => {

  try{
  const result = await Customer.find();
  res.send({"customers": result })
} catch(e) {
  res.status(500).json({error: e.message})
}

})



app.post('/', (req, res) => {
  res.send('this is a post request!!')
})

app.get('/api/customers/:id', async(req, res) => {
  console.log({
    requestParams: req.params,
    requestQuery: req.query
  })

  try{
    const customerId = req.params.id;
    console.log(customerId);

    const customer = await Customer.findById(customerId)
    console.log(customer);
    if(!customer){
      res.status(404).json({error: 'User not found'})
    } else {
    res.json({customer})
    }
  } catch(e) {
    res.status(500).json({error: 'something went wrong'})
  }

})


app.put('/api/customers/:id', async(req, res) => {
  try{
    const customerId = req.params.id;
    const result = await Customer.replaceOne({_id: customerId}, req.body)
    console.log(result)
    res.json({updatedCount: result.modifiedCount})
  } catch (e) {
    res.status(500).json({error: 'something wrong '})
  }
})

app.delete('/api/customers/:id', async(req, res) => {
  try{
    const customerId = req.params.id;
    const result = await Customer.deleteOne({_id: req.params.id});
    res.json({deletedCount: result.deletedCount})
  } catch(e) {
    res.status(500).json({error: "something went wrong"})
  }

})

app.post('/api/customers', async(req, res) => {
  console.log(req.body);
  const customer = new Customer(req.body)

  try{
      await customer.save()
      res.status(201).json({customer})
  } catch(e) {
      res.status(400).json({error: e.message})
  }


  //req.body('this is a post request!!')
})

/*
app.listen(PORT, () => {
  console.log('App listens' + PORT);
})
*/

const start = async() => {

  try{
    await mongoose.connect(CONNECTION)

    app.listen(PORT, () => {
      console.log('App listens' + PORT);
    })
  } catch(e) {
    console.log(e.message);
  }

}

start()
