using serverSide.DAL;

namespace serverSide.BL
{
    public class BookClub
    {
        int clubId;
        int bookId;
        string clubName;
        public int ClubId { get => clubId; set => clubId = value; }
        public int BookId { get=>bookId; set => bookId = value; }
        public string ClubName { get => clubName; set => clubName = value; }


        public BookClub(int clubId,int bookId, string clubName)
        {
            ClubId = clubId;
            BookId = bookId;
            ClubName = clubName;
        }

        public static int createNewClub(int bookId,string clubName, int userId)
        {
            DBserviceBookClub dBservicesBookClub = new DBserviceBookClub();

           return (dBservicesBookClub.AddNewBookClub(bookId,clubName, userId));

           
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
    }

}
