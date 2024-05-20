const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

let books = require('./data.json');

app.get ('/', (req, res) =>
{
    res.send('Hello World!')
})

// get all

app.get('/api/books', (req, res) => 
{
  res.json(books)
})

app.post('/api/books', (req, res) =>
{
  const newBook = req.body
  let maxId = 0
  for (const book of books)
  {
    if (book.id> maxId)
    {
      maxId = book.id
    }
  }
  newBook.id = maxId +1,
  books.push(newBook)
  fs.writeFileSync('data.json',JSON.stringify(books))
  res.json(newBook)
})

// get id

app.get('/api/books/:id', (req, res) =>
{
  const book = books.find(b=>b.id === parseInt(req.params.id))
  if (!book) {
    return  res.status(404).send('not found')
  }
  res.json(book)
})

//update id

app.put('/api/books/:id', (req, res) =>
{
  const bookId = parseInt(req.params.id)
  let index = books.findIndex(b=>b.id === bookId)
  const update = req.body
  if (index === -1) {
    return  res.status(404).send('not found')
  }
  books[index] = {...books[index],...update}
  fs.writeFileSync('data.json', JSON.stringify(books))
  res.json(books[index])
})

//delete id

app.delete('/api/books/:id', (req, res) =>
{
  let newBooks = books.filter(b => b.id != req.params.id);

  fs.writeFileSync('data.json', JSON.stringify(books))

  res.json(newBooks)

})


app.listen(3000, () => console.log('Server running on port: http://localhost:3000'));