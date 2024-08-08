using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Data;
using System.Text;
using System.Data.Common;
using serverSide.BL;
using System.Dynamic;

/// <summary>
/// DBServices is a class created by me to provides some DataBase Services
/// </summary>
public class DBservicesScoreTable
{

    public DBservicesScoreTable() { }

    //--------------------------------------------------------------------------------------------------
    // This method creates a connection to the database according to the connectionString name in the web.config 
    //--------------------------------------------------------------------------------------------------
    public SqlConnection connect(String conString)
    {

        // read the connection string from the configuration file
        IConfigurationRoot configuration = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json").Build();
        string cStr = configuration.GetConnectionString("myProjDB");
        SqlConnection con = new SqlConnection(cStr);
        con.Open();
        return con;
    }

    //--------------------------------------------------------------------------------------------------
    // This method adds a new Score
    //--------------------------------------------------------------------------------------------------
    public int AddNewScore(Score newScore)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        cmd = CreateCommandWithStoredProcedureAddNewScore("insertNewScore", con, newScore);             // create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }


    //---------------------------------------------------------------------------------
    // Create the SqlCommand using a stored procedure to  adds a new Score
    //---------------------------------------------------------------------------------

    private SqlCommand CreateCommandWithStoredProcedureAddNewScore(String spName, SqlConnection con,Score newScore)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        cmd.Parameters.AddWithValue("@gameName", newScore.GameName);

        cmd.Parameters.AddWithValue("@userName", newScore.UserName);

        cmd.Parameters.AddWithValue("@score", newScore.ScoreNum);

        cmd.Parameters.AddWithValue("@time", newScore.Time);

        return cmd;
    }
    //--------------------------------------------------------------------------------------------------
    // This method show top 5 score per game
    //--------------------------------------------------------------------------------------------------

    public List<Score> getTop5ScorePerGame(string gameName)

    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        cmd = CreateCommandWithStoredProceduregetTop5ScorePerGame("getTop5Score", con,gameName);             // create the command


        List<Score> top5score = new List<Score>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
               Score score = new Score();
                score.GameName = Convert.ToString(dataReader["gameName"]);
                score.UserName=Convert.ToString(dataReader["userName"]);
                score.ScoreNum=Convert.ToInt32(dataReader["score"]);
                score.Time=Convert.ToString(dataReader["time"]);
                top5score.Add(score);
            }
            return top5score;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }


    //---------------------------------------------------------------------------------
    // Create the SqlCommand using a stored procedure to get TOP 5 score per game
    //---------------------------------------------------------------------------------

    private SqlCommand CreateCommandWithStoredProceduregetTop5ScorePerGame(String spName, SqlConnection con,string gameName)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        cmd.Parameters.AddWithValue("@gameName",gameName);


        return cmd;
    }

}