using System.Net;

namespace serverSide.BL
{
    public class Book
    {
        int id;
        string title;
        string subTitle = "";
        int isEbook;
        int isActive;
        int isAvailable;
        double price;
        string category;
        string smallThumbnail;
        string thumbnail;
        int numOfPages;
        string description;
        string previewLink;
        string publishDate;
        string firstAuthorName;
        string secondAuthorName;
        int numOfReviews;
        double rating;
        string textSnippet;

        Random randomPrice = new Random();  // generate a random price for each book
        public Book() { }
        public Book(int id, string title, string subTitle, int isEbook, int isActive, int isAvailable, string category, string smallThumbnail,
            string thumbnail, int numOfPages, string description, string previewLink, string publishDate, string firstAuthorName, string secondAuthorName,
            int numOfReviews, double rating, string textSnippet)
        {
            this.id = id;
            this.title = title;
            this.subTitle = subTitle;
            this.isEbook = isEbook;
            this.isActive = isActive;
            this.isAvailable = isAvailable;
            this.price = Math.Round(randomPrice.NextInt64(50, 301) + randomPrice.NextDouble(), 2);  // generate a random decimal price between 50 to 300 
            this.category = category;
            this.smallThumbnail = smallThumbnail;
            this.thumbnail = thumbnail;
            this.numOfPages = numOfPages;
            this.description = description;
            this.previewLink = previewLink;
            this.publishDate = publishDate;
            this.firstAuthorName = firstAuthorName;
            this.secondAuthorName = secondAuthorName;
            this.numOfReviews = numOfReviews;
            this.rating = rating;
            this.textSnippet = textSnippet;
        }

        public int Id { get => id; set => id = value; }
        public string Title { get => title; set => title = value; }
        public string SubTitle { get => subTitle; set => subTitle = value; }
        public int IsEbook { get => isEbook; set => isEbook = value; }
        public int IsActive { get => isActive; set => isActive = value; }
        public int IsAvailable { get => isAvailable; set => isAvailable = value; }
        public double Price { get => price; set => price = value; }
        public string Category { get => category; set => category = value; }
        public string SmallThumbnail { get => smallThumbnail; set => smallThumbnail = value; }
        public string Thumbnail { get => thumbnail; set => thumbnail = value; }
        public int NumOfPages { get => numOfPages; set => numOfPages = value; }
        public string Description { get => description; set => description = value; }
        public string PreviewLink { get => previewLink; set => previewLink = value; }
        public string PublishDate { get => publishDate; set => publishDate = value; }
        public string FirstAuthorName { get => firstAuthorName; set => firstAuthorName = value; }
        public string? SecondAuthorName { get => secondAuthorName; set => secondAuthorName = value; }
        public int NumOfReviews { get => numOfReviews; set => numOfReviews = value; }
        public double Rating { get => rating; set => rating = value; }
        public string TextSnippet { get => textSnippet; set => textSnippet = value; }

        // Add new book to the database 
        public bool AddNewBook(Book book)
        {
            DBservicesBooks dBserviecesBooks = new DBservicesBooks();

            return 1 == dBserviecesBooks.AddNewBook(book);
        }
        //show all Books
        public static List<object> showBooks()
        {
            DBservicesBooks dBserviecesBooks = new DBservicesBooks();

            return dBserviecesBooks.getAllBooks();
        }
        public static int RateBook(int bookID, int newRating, int userID, string review)
        {
            DBservicesBooks dBserviecesBooks = new DBservicesBooks();

            return dBserviecesBooks.RateBook(bookID, newRating, userID, review);

        }
        public static List<object> showTop5BooksByrating()
        {
            DBservicesBooks dBserviecesBooks = new DBservicesBooks();

            return dBserviecesBooks.getTop5BooksByRating();
        }
        public static bool changeBookActivity(int bookId)
        {
            DBservicesBooks dBserviecesBooks = new DBservicesBooks();

            return 1 == dBserviecesBooks.changeBookActivity(bookId);
        }
    }

}
