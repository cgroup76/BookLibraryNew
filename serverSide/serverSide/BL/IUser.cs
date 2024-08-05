using System.Net;
using System.Reflection.Metadata.Ecma335;

namespace serverSide.BL
{
    public class IUser
    {
        public static readonly int TIMEOUT = 20; // SET A GLOBAL VALUE FOR THE SESSION TIMEOUT -> CAN BE CHANGED AND MODIFY SO WE SAVE IN THE CODE

        int id;
        string userName = string.Empty;
        string eMail = string.Empty;
        string password = string.Empty;
        bool isAdmin = false;
        bool isActive = true;
        bool isLogIn = false; // Because there is only one user logged in every time --> an indecator for us to know
        public IUser() { }


        public IUser(string userName, string eMail, string password)
        {
            this.userName = userName;
            this.eMail = eMail;
            this.password = password;

        }
        public int Id { get => id; set => id = value; }
        public string UserName { get => userName; set => userName = value; }
        public string EMail { get => eMail; set => eMail = value; }
        public string Password { get => password; set => password = value; }
        public bool IsAdmin { get => isAdmin; set => isAdmin = value; }
        public bool IsActive { get => isActive; set => isActive = value; }
        public bool IsLogIn { get => isLogIn; set => isLogIn = value; }


        // static public List<IUser> ReadUsers() { return usersList; }



        // add new user
        public int Insert(IUser newUser)
        {
            DBservicesUsers dBservicesUsers = new DBservicesUsers();

            int newUserId = dBservicesUsers.AddNewUser(newUser, TIMEOUT);

            if (newUserId != 0) return newUserId; // success to add user

            else return 0;
        }



        // Add new book to the user's books list
        public static int addNewBook(int userId, int bookId)
        {
            DBservicesUsers dBservicesUsers = new DBservicesUsers();

            return dBservicesUsers.addNewbookToUser(userId, bookId);

        }

        //show all user's books
        public static List<dynamic> showMyBooks(int userId)
        {
            DBservicesUsers dBservicesUsers = new DBservicesUsers();
            return dBservicesUsers.GetBooksPerUser(userId);

        }

        // login a user
        public static object Login(IUser LoginUser)
        {
            DBservicesUsers dbservicesUsers = new DBservicesUsers();

            return dbservicesUsers.logInUser(LoginUser, TIMEOUT);

        }
        // logout a user - because there is always one user logged in the logout make the islogin = false
        public static bool Logout(int userId)
        {
            DBservicesUsers dbservicesUsers = new DBservicesUsers();

            dbservicesUsers.logOut(userId);

            return true;
        }
        //mark book as read by user 
        public static int readBook(int bookId, int userId)
        {
            DBservicesUsers dbservicesUsers = new DBservicesUsers();

            return dbservicesUsers.readBookByUser(bookId, userId);

        }
        //// Add sale and buy book method
        //public static bool saleAndBuyBook(int buyerId,int sellerId, int bookId)
        //{
        //    DBservicesUsers dBservicesUsers = new DBservicesUsers();

        //    return 1 == dBservicesUsers.saleAndBuyBook(buyerId, sellerId, bookId);


        //}
        public static bool insertNewRequest(int sellerId, int buyerId, int bookId)
        {
            DBservicesUsers dBservicesUsers = new DBservicesUsers();

            return 1 == dBservicesUsers.insertNewRequest(sellerId, buyerId, bookId);
        }
        public static int requestHandling(int sellerId, int buyerId, int bookId, string requestStatus)
        {
            DBservicesUsers dBservicesUsers = new DBservicesUsers();

            return  dBservicesUsers.requestHandling(sellerId, buyerId, bookId, requestStatus);
        }

        public static List<dynamic> getRequestsPerUser(int userId)
        {
            DBservicesUsers dBservicesUsers = new DBservicesUsers();

            return dBservicesUsers.getRequestsPerUser(userId);
        } 
        public static List<dynamic> GetAllIusers()
        {
            DBservicesUsers dBservicesUsers = new DBservicesUsers();

            return dBservicesUsers.GetAllIusers();
        }

    }
}
