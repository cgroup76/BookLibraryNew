using serverSide.DAL;

namespace serverSide.BL
{
    public class BookClub
    {
        int clubId;
        int bookId;
        string clubName;
        string bookImage;
        public int ClubId { get => clubId; set => clubId = value; }
        public int BookId { get=>bookId; set => bookId = value; }
        public string ClubName { get => clubName; set => clubName = value; }
        public string BookImage { get => bookImage; set => bookImage = value; }


        public BookClub(int clubId,int bookId, string clubName, string bookImage)
        {
            ClubId = clubId;
            BookId = bookId;
            ClubName = clubName;
            BookImage = bookImage;
        }

        public static int createNewClub(string clubName, int userId)
        {
            DBserviceBookClub dBservicesBookClub = new DBserviceBookClub();

           return (dBservicesBookClub.AddNewBookClub(clubName, userId));

           
        }
        public static List<dynamic> getAllMembersPerClub(int clubId)
        {
            DBserviceBookClub dBservicesBookClub = new DBserviceBookClub();
            return dBservicesBookClub.getAllmembersInBookClub(clubId);

        }
        public static int JoinClub(int clubId, int userId)
        {
            DBserviceBookClub dBservicesBookClub = new DBserviceBookClub();

            return (dBservicesBookClub.joinClub(clubId, userId));


        }
        public static List<dynamic> getAllClubs()
        {
            DBserviceBookClub dBservicesBookClub = new DBserviceBookClub();
            return dBservicesBookClub.getAllBookClub();

        }

    }


}
