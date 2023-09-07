const Book = require('./models/BookModel.js');

const getBooks = async (req, res)=>{
  const books = await Book.find({}).select("+title +_id +comment")

    if(!books){
      res.json([]);
    }

  const formattedData = books.map((book) => {
        return {
          _id:  book._id,
          title: book.title,
          commentcount: book.comments?.length,
        }
      })
  
      res.json(formattedData);
}

const getBookById = async (req, res)=>{
  let bookId = req.params.id;
  const book = await Book.findById(bookId);

  if(!book) {
    res.send("no book exists");
    return
  }

  res.json({
        title: book.title,
        _id: book._id,
        comments: book?.comments,
      })
    }

const addBook = async (req, res)=>{
      let title = req.body.title;
      if (!title) {
        res.send("missing required field title");
        return;
      }

  const book = await Book.create({ title, comments: [] })
  
      if(!book) {
          res.send("there was an error saving");
      }
      res.json({ _id: book._id, title: book.title });
    }

const deleteAllBooks = async (req, res)=>{
    const books = await Book.deleteMany();

    if (!books) {
          res.send("error");
        }
  
    res.send("complete delete successful");

    }

const addComment = async (req, res)=>{
      let bookId = req.params.id;
      let comment = req.body.comment;
  
      if(!comment){
        return res.send("missing required field comment");
      }

    const book = await Book.findById(bookId).select("+title +_id +comments");
  
    if(!book){
      return res.send('no book exists');
    }

    let formattedData;

    const commentPosted = await Book.findOneAndUpdate(
      { _id: bookId },
      {
        $push: { comments: comment},
      },
      { new: true }
    ).then(book=>{
  formattedData = {
          title: book.title,
          _id: book._id,
          comments: book?.comments,
          commentcount: book.comments?.length,
        };
    });
  
    return res.json(formattedData);
  
    }

const deleteBookById = async (req, res)=>{
      let bookId = req.params.id;
      const book = await Book.findByIdAndRemove(bookId);
  
        if (!book) {
          res.send("no book exists");
          return
        } 
      res.send("delete successful");
    }

module.exports = {getBooks, getBookById, addBook, deleteAllBooks, addComment, deleteBookById}
