using serverSide.BL;
using System.Dynamic;
using System.Data.SqlClient;
using System.Data;
using static System.Net.Mime.MediaTypeNames;

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
                    member.userId = Convert.ToString(dataReader["userId"]);


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
                    BookClub.ClubId = Convert.ToInt32(dataReader["id"]);
                    BookClub.ClubName = Convert.ToString(dataReader["bookName"]);
                    BookClub.ClubImage = Convert.ToString(dataReader["bookImage"]);
                    BookClub.ClubMembers = Convert.ToInt32(dataReader["clubMembers"]);


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



        //--------------------------------------------------------------------------------------------------
        // This method adds a new Post
        //--------------------------------------------------------------------------------------------------
        public int addNewPost(int clubId,int userId,string description,string image)
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

            cmd = CreateCommandWithStoredProcedureaddNewPost("addNewPost", con, clubId, userId, description, image);             // create the command

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
        // Create the SqlCommand using a stored procedure to  adds a new post
        //---------------------------------------------------------------------------------

        private SqlCommand CreateCommandWithStoredProcedureaddNewPost(String spName, SqlConnection con, int clubId, int userId, string description, string image)
        {

            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

            cmd.Parameters.AddWithValue("@userId", userId);
            cmd.Parameters.AddWithValue("@clubId", clubId);
            cmd.Parameters.AddWithValue("@description", description);
            cmd.Parameters.AddWithValue("@image", image);

            

            return cmd;
        }


        //---------------------------------------------------------------------------------
        // Create the SqlCommand using a stored procedure to get Post Per Club
        //---------------------------------------------------------------------------------


        public List<object> getPostPerClub(int clubId)

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

            cmd = CreateCommandWithStoredProceduregetPostPerClub("getPostPerClub", con,clubId);             // create the command


            List<dynamic> posts = new List<dynamic>();

            try
            {
                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

                while (dataReader.Read())
                {
                    dynamic post = new ExpandoObject();
                    post.PostId = Convert.ToInt32(dataReader["id"]);
                    post.ClubId = Convert.ToInt32(dataReader["clubId"]);
                    post.UserId = Convert.ToInt32(dataReader["userId"]);
                    post.UserName = Convert.ToString(dataReader["userName"]);
                    post.Description = Convert.ToString(dataReader["description"]);
                    post.Image= Convert.ToString(dataReader["image"]);
                    post.Likes = Convert.ToInt32(dataReader["numOfLikes"]);
                    post.PostDate=Convert.ToString(dataReader["postDate"]);

                    posts.Add(post);

                }
                return posts;
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
        // Create the SqlCommand using a stored procedure to get Post Per Club
        //---------------------------------------------------------------------------------

        private SqlCommand CreateCommandWithStoredProceduregetPostPerClub(String spName, SqlConnection con,int clubId)
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
        // This method let user add Like To Post
        //--------------------------------------------------------------------------------------------------
        public int addLikeToPost(int postId, int userId)
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

            cmd = CreateCommandWithStoredProcedureaddLikeToPost("addLikeToPost", con, postId, userId);             // create the command

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
        // Create the SqlCommand using a stored procedure to let users add Like To Post
        //---------------------------------------------------------------------------------

        private SqlCommand CreateCommandWithStoredProcedureaddLikeToPost(String spName, SqlConnection con, int postId, int userId)
        {

            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

            cmd.Parameters.AddWithValue("@userid", userId);

            cmd.Parameters.AddWithValue("@postId", postId);

            return cmd;
        }

    }





}