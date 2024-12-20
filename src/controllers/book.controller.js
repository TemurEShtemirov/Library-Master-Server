import {
  getAllBook,
  getBookByQuery,
  getBookByUUID,
  DeleteAllBooks,
  addBook,
} from "../services/book.service.js";
import redis from "../config/redis.js"; // Importing Redis
import redisClient from "../config/redis.js";

// Fetch all books with Redis cache
export async function FetchAllBook(req, res) {
  try {
    // Check if data is in Redis cache
    const cachedBooks = await redisClient.get("all_books");

    if (cachedBooks) {
      console.log("🚀 Using cached data");
      return res.json(JSON.parse(cachedBooks)); // Send cached response
    }

    // If not cached, fetch books from the database
    const books = await getAllBook(); // Replace with your actual DB call

    // Cache the result in Redis with expiration time (1 hour)
    await redisClient.set("all_books", JSON.stringify(books), {
      EX: 3600, // Cache expires in 1 hour
    });

    console.log("🚀 Fetched books from DB");
    res.json(books); // Send response with fetched books
  } catch (err) {
    console.error("💥 Error fetching books:", err);
    res.status(500).send("Error fetching books");
  }
}
// Fetch book by query with Redis cache
export const BookGetQuery = async (req, res) => {
  try {
    const { query } = req.query;
    const cacheKey = `book_query_${query}`;

    // Check if the data is cached in Redis
    const cachedBook = await redis.get(cacheKey);

    if (cachedBook) {
      return res.status(200).json({
        success: true,
        message: "Fetched book by query from cache",
        data: JSON.parse(cachedBook),
      });
    }

    // If not cached, fetch from DB
    const books = await getBookByQuery(query);

    // Cache the result for 1 hour (3600 seconds)
    await redis.setex(cacheKey, 3600, JSON.stringify(books));

    res.status(200).json({
      success: true,
      message: "Fetched book by query from database",
      data: books,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Fetch book by UUID with Redis cache
export const getBookUUID = async (req, res) => {
  try {
    const { bookId } = req.params;
    const cacheKey = `book_${bookId}`;

    // Check if the data is cached in Redis
    const cachedBook = await redis.get(cacheKey);

    if (cachedBook) {
      return res.status(200).json({
        success: true,
        message: "Fetched book by UUID from cache",
        data: JSON.parse(cachedBook),
      });
    }

    // If not cached, fetch from DB
    const book = await getBookByUUID(bookId);

    // Cache the result for 1 hour (3600 seconds)
    await redis.setex(cacheKey, 3600, JSON.stringify(book));

    res.status(200).json({
      success: true,
      message: "Fetched book by UUID from database",
      data: book,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const addNewBook = async (req, res) => {
  try {
    const {
      title,
      author,
      publication_year,
      language,
      keywords,
      description,
      book_status,
      genre,
      year,
      total_copies,
      isbn,
      publisher,
      pages,
    } = req.body;

    // Check if a file was uploaded
    const image = req.file ? req.file.filename : null;

    const newBook = await addBook({
      title,
      author,
      publication_year,
      language,
      keywords,
      description,
      book_status,
      genre,
      year,
      total_copies,
      available: total_copies,
      isbn,
      publisher,
      pages,
      image, // Save the filename for the uploaded image
    });

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      newData: newBook,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const updateData = req.body;

    await updateBook(bookId, updateData);

    return res.status(200).json({ message: "Book updated successfully." });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteBookByUUID = async (req, res) => {
  try {
    const { bookId } = req.params;

    const result = await deleteBookByUUID(bookId);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteAllBooks = async (req, res) => {
  try {
    const result = await DeleteAllBooks(Book);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
