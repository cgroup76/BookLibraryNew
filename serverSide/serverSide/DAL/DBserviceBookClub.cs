using serverSide.BL;
using System.Dynamic;
using System.Data.SqlClient;
using System.Data;

namespace serverSide.DAL
{
    public class DBserviceBookClub
    {
        public DBserviceBookClub() { }

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
        // This method adds a new Club
        //--------------------------------------------------------------------------------------------------
        public int AddNewBookClub( string clubName, int userId)
        {

            SqlConnection con;
            SqlCommand cmd;
            SqlParameter returnValue = new SqlParameter(); // add a return value parameter
            try
            {
                con = connect("myProjDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            cmd = CreateCommandWithStoredProcedureAddNewBookClub("creatNewBookClub", con, clubName, userId);             // create the command

            returnValue.ParameterName = "@RETURN_VALUE";
            returnValue.Direction = ParameterDirection.ReturnValue;
            cmd.Parameters.Add(returnValue);

            try
            {
                cmd.ExecuteNonQuery(); // execute the command

                int numEffected = (int)cmd.Parameters["@RETURN_VALUE"].Value; // get the return value
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
        // Create the SqlCommand using a stored procedure to  adds a new Club
        //---------------------------------------------------------------------------------

        private SqlCommand CreateCommandWithStoredProcedureAddNewBookClub(String spName, SqlConnection con, string clubName, int userId)
        {

            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

            cmd.Parameters.AddWithValue("@userId", userId);

            cmd.Parameters.AddWithValue("@title", clubName);

            return cmd;
        }

        //--------------------------------------------------------------------------------------------------
        // This method show all membersInBookClub 
        //--------------------------------------------------------------------------------------------------

        public List<object> getAllmembersInBookClub(int clubId)

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

            cmd = CreateCommandWithStoredProceduregetAllmembersInBookClub("getMembersPerClub", con, clubId);             // create the command


            List<dynamic> membersInClub = new List<dynamic>();

            try
            {
                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

                while (dataReader.Read())
                {
                    dynamic member = new ExpandoObject();
                    member.userName = Convert.ToString(dataReader["userName"]);


                    membersInClub.Add(member);

                }
                return membersInClub;
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
        // Create the SqlCommand using a stored procedure to get membersInBookClub 
        //---------------------------------------------------------------------------------

        private SqlCommand CreateCommandWithStoredProceduregetAllmembersInBookClub(String spName, SqlConnection con, int clubId)
        {

            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

            cmd.Parameters.AddWithValue("@clubId", clubId);

            return cmd;
        }













        //--------------------------------------------------------------------------------------------------
        // This method let users join club
        //--------------------------------------------------------------------------------------------------
        public int joinClub(int clubId, int userId)
        {

            SqlConnection con;
            SqlCommand cmd;
            SqlParameter returnValue = new SqlParameter(); // add a return value parameter
            try
            {
                con = connect("myProjDB"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            cmd = CreateCommandWithStoredProcedurejoinClub("joinToBookClub", con, clubId, userId);             // create the command

            returnValue.ParameterName = "@RETURN_VALUE";
            returnValue.Direction = ParameterDirection.ReturnValue;
            cmd.Parameters.Add(returnValue);

            try
            {
                cmd.ExecuteNonQuery(); // execute the command

                int numEffected = (int)cmd.Parameters["@RETURN_VALUE"].Value; // get the return value
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
        // Create the SqlCommand using a stored procedure to let users join club
        //---------------------------------------------------------------------------------

        private SqlCommand CreateCommandWithStoredProcedurejoinClub(String spName, SqlConnection con, int bookClubId, int userId)
        {

            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

            cmd.Parameters.AddWithValue("@userid", userId);

            cmd.Parameters.AddWithValue("@bookClubId", bookClubId);

            return cmd;
        }

        //---------------------------------------------------------------------------------
        // Create the SqlCommand using a stored procedure to getAllClubs
        //---------------------------------------------------------------------------------


        public List<object> getAllBookClub()

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

            cmd = CreateCommandWithStoredProceduregetAllBookClub("getAllClubs", con);             // create the command


            List<dynamic> Clubs = new List<dynamic>();

            try
            {
                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

                while (dataReader.Read())
                {
                    dynamic BookClub = new ExpandoObject();
                    BookClub.clubId = Convert.ToString(dataReader["clubId"]);
                    BookClub.ClubName = Convert.ToString(dataReader["bookName"]);


                    Clubs.Add(BookClub);

                }
                return Clubs;
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
        // Create the SqlCommand using a stored procedure to get membersInBookClub 
        //---------------------------------------------------------------------------------

        private SqlCommand CreateCommandWithStoredProceduregetAllBookClub(String spName, SqlConnection con)
        {

            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text


            return cmd;
        }





    }





}