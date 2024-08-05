namespace serverSide.BL
{
    public class Author
    {

        string name = string.Empty;
        int id;
        string dateOfBirth;
        string dateOfDeath;
        int age;
        string nationality;
        string notableWork;
        string awars;
        string description;

        public Author() { }

        public Author(string name, int id, string dateOfBirth, string dateOfDeath, int age, string nationality, string notableWork, string awars, string description)
        {
            this.name = name;
            this.id = id;
            this.dateOfBirth = dateOfBirth;
            this.dateOfDeath = dateOfDeath;
            this.age = age;
            this.nationality = nationality;
            this.notableWork = notableWork;
            this.awars = awars;
            this.description = description;
        }

        public string Name { get => name; set => name = value; }
        public int Id { get => id; set => id = value; }
        public string DateOfBirth { get => dateOfBirth; set => dateOfBirth = value; }
        public string DateOfDeath { get => dateOfDeath; set => dateOfDeath = value; }
        public int Age { get => age; set => age = value; }
        public string Nationality { get => nationality; set => nationality = value; }
        public string NotableWork { get => notableWork; set => notableWork = value; }
        public string Awars { get => awars; set => awars = value; }
        public string Description { get => description; set => description = value; }

        public static List<Book> findBookByAuthorName(string authorName)
        {
            DBservicesAuthor dBservicesAuthor = new DBservicesAuthor();

            return dBservicesAuthor.findBookByAuthorName(authorName);

        }

        public static List<Author> showAllAuthors()
        {
            DBservicesAuthor dBservicesAuthor = new DBservicesAuthor();

            return dBservicesAuthor.getAllAuthors();

        }
        // public static Author addNewAuthor(int id, string name) { }
    }
}
