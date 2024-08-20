namespace serverSide.BL
{
    public class Score
    {
        string gameName;
        string userName;
        int scoreNum;
        string time;

        public Score(string gameName, string userName, int scoreNum, string time)
        {
            GameName=gameName;
            UserName=userName;
            ScoreNum=scoreNum;
            Time=time;
        }
        public Score() { }

        public string GameName { get => gameName; set => gameName = value; }
        public string UserName { get => userName; set => userName = value; }
        public int ScoreNum { get => scoreNum; set => scoreNum = value; }
        public string Time { get => time; set => time=value; }

        public static bool insertNewScore(Score score)
        {
            DBservicesScoreTable dBserviecesScore = new DBservicesScoreTable();

            return 1 <= dBserviecesScore.AddNewScore(score);
        }
        public static List<Score> GetTop5Score(string gameName) 
        {
            DBservicesScoreTable dBservicesScoreTable = new DBservicesScoreTable();
            return dBservicesScoreTable.getTop5ScorePerGame(gameName);

        }

    }


}
