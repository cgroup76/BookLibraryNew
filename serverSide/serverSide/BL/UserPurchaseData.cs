namespace serverSide.BL
{
    public class UserPurchaseData
    {
        public int UserId { get; set; }
        public int BookId { get; set; }
        public float Rating { get; set; }
        public string Genre { get; set; }
        public int Author { get; set; }
        public string Title { get; set; }
    }
}
