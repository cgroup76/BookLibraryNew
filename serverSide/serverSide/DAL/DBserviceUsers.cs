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
using System.Net;

/// <summary>
/// DBServices is a class created by me to provides some DataBase Services
/// </summary>
public class DBservicesUsers
{

    public DBservicesUsers() { }

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
    // This method adds a new user to the users table 
    //--------------------------------------------------------------------------------------------------
    public int AddNewUser(IUser user, int timeout)
    {

        SqlConnection con;
        SqlCommand cmd;
        SqlParameter newUserId = new SqlParameter("@userId", SqlDbType.Int); // the new user id value

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        cmd = CreateCommandWithStoredProcedureAddNewUser("AddNewIUser", con, user, timeout);             // create the command

        // create an output parameter to get back from the store presigere 

        newUserId.Direction = ParameterDirection.Output;
        cmd.Parameters.Add(newUserId);

        try
        {
            cmd.ExecuteNonQuery(); // execute the command

            int userId = (int)cmd.Parameters["@userId"].Value; // get the return value
            return userId;
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
    // Create the SqlCommand using a stored procedure to add new user
    //---------------------------------------------------------------------------------

    private SqlCommand CreateCommandWithStoredProcedureAddNewUser(String spName, SqlConnection con, IUser user, int timeout)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        cmd.Parameters.AddWithValue("@username", user.UserName);

        cmd.Parameters.AddWithValue("@email", user.EMail);

        cmd.Parameters.AddWithValue("@password", user.Password);

        cmd.Parameters.AddWithValue("@timeout", timeout);

        return cmd;
    }


    //--------------------------------------------------------------------------------------------------
    // login user - return user id
    //--------------------------------------------------------------------------------------------------
    public object logInUser(IUser user, int timeout)
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

        cmd = CreateCommandWithStoredProcedurelogInUser("LoginIUser", con, user, timeout);             // create the command

        dynamic userDetails = new ExpandoObject(); // create a dynamic object 
        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                userDetails.userId = Convert.ToInt32(dataReader["userId"]);
                userDetails.userName = Convert.ToString(dataReader["userName"]);
            }
            return userDetails;
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
    // Create the SqlCommand using a stored procedure to login user
    //---------------------------------------------------------------------------------

    private SqlCommand CreateCommandWithStoredProcedurelogInUser(String spName, SqlConnection con, IUser user, int timeout)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        cmd.Parameters.AddWithValue("@email", user.EMail);

        cmd.Parameters.AddWithValue("@password", user.Password);

        cmd.Parameters.AddWithValue("@sessionTimeOut", timeout);

        return cmd;
    }

    //--------------------------------------------------------------------------------------------------
    // This method logout the log in user
    //--------------------------------------------------------------------------------------------------
    public void logOut(int userId)
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

        cmd = CreateCommandWithStoredProcedureLogOut("LogoutIUser", con, userId);             // create the command


        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);


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
    // Create the SqlCommand using a stored procedure to logout user
    //---------------------------------------------------------------------------------

    private SqlCommand CreateCommandWithStoredProcedureLogOut(String spName, SqlConnection con, int userId)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        cmd.Parameters.AddWithValue("@userId", userId);

        return cmd;
    }


    //--------------------------------------------------------------------------------------------------
    // This method add New book To user
    //--------------------------------------------------------------------------------------------------

    public int addNewbookToUser(int userID, int bookID)
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

        cmd = CreateCommandWithStoredProcedureaddNewbookToUser("addNewbookToUser", con, userID, bookID);             // create the command

        // create an return parameter to get back from the store presigere 

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
    // Create the SqlCommand using a stored procedure to add new book to user
    //---------------------------------------------------------------------------------

    private SqlCommand CreateCommandWithStoredProcedureaddNewbookToUser(String spName, SqlConnection con, int userId, int bookId)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        cmd.Parameters.AddWithValue("@userid", userId);

        cmd.Parameters.AddWithValue("@bookid", bookId);


        return cmd;
    }

    //--------------------------------------------------------------------------------------------------
    // This method show all books from specific user
    //--------------------------------------------------------------------------------------------------

    public List<dynamic> GetBooksPerUser(int userId)

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

        cmd = CreateCommandWithStoredProcedureGetBooksPerUser("GetBooksPerUser", con, userId);             // create the command


        List<dynamic> userBooks = new List<dynamic>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                dynamic book = new ExpandoObject();
                book.Id = Convert.ToInt32(dataReader["id"]);
                book.Title = Convert.ToString(dataReader["title"]);
                book.SubTitle = Convert.ToString(dataReader["subTitle"]);
                book.IsEbook = Convert.ToByte(dataReader["isEbook"]);
                book.IsActive = Convert.ToByte(dataReader["isActive"]);
                book.IsAvailable = Convert.ToByte(dataReader["isAvailable"]);
                book.Price = (float)Convert.ToDouble(dataReader["price"]);
                book.Category = Convert.ToString(dataReader["category"]);
                book.SmallThumbnail = Convert.ToString(dataReader["smallThumbnail"]);
                book.Thumbnail = Convert.ToString(dataReader["thumbnail"]);
                book.NumOfPages = Convert.ToInt32(dataReader["numOfPages"]);
                book.Description = Convert.ToString(dataReader["description"]);
                book.PreviewLink = Convert.ToString(dataReader["previewLink"]);
                book.PublishDate = Convert.ToString(dataReader["publishedDate"]);
                book.FirstAuthorName = Convert.ToString(dataReader["firstAuthor"]);
                book.SecondAuthorName = Convert.ToString(dataReader["secondAuthor"]);
                book.NumOfReviews = Convert.ToInt32(dataReader["numOfReviews"]);
                book.Rating = (float)Convert.ToDouble(dataReader["rating"]);
                book.TextSnippet = Convert.ToString(dataReader["textSnippet"]);
                book.UserId = Convert.ToString(dataReader["userid"]);
                book.IsRead = Convert.ToString(dataReader["isRead"]);
                book.WasRated = Convert.ToByte(dataReader["wasRated"]);
                userBooks.Add(book);

            }
            return userBooks;
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
    // Create the SqlCommand using a stored procedure to get books per user
    //---------------------------------------------------------------------------------

    private SqlCommand CreateCommandWithStoredProcedureGetBooksPerUser(String spName, SqlConnection con, int userId)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        cmd.Parameters.AddWithValue("@userId", userId);

        return cmd;
    }

    //---------------------------------------------------------------------------------
    // Create the SqlCommand using a stored procedure to mark book as read by user 
    //---------------------------------------------------------------------------------


    public int readBookByUser(int bookId, int userId)
    {

        SqlConnection con;
        SqlCommand cmd;
        SqlParameter returnValue = new SqlParameter();

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        cmd = CreateCommandWithStoredProcedurereadBookByUser("ReadBook", con, bookId, userId);             // create the command

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
    // Create the SqlCommand using a stored procedure to mark book as read by user
    //---------------------------------------------------------------------------------

    private SqlCommand CreateCommandWithStoredProcedurereadBookByUser(String spName, SqlConnection con, int bookId, int userId)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        cmd.Parameters.AddWithValue("@bookId", bookId);

        cmd.Parameters.AddWithValue("@userId", userId);

        return cmd;
    }


    

    //--------------------------------------------------------------------------------------------------
    // This method Insert new Request
    //--------------------------------------------------------------------------------------------------

    public int insertNewRequest(int sellerId, int buyerId, int bookID)
    {

        SqlConnection con;
        SqlCommand cmd;
        SqlParameter returnValue = new SqlParameter();

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        cmd = CreateCommandWithStoredProcedureInsertNewReqest("insertNewRequest", con, sellerId, buyerId, bookID);             // create the command

        returnValue.ParameterName = "@RETURN_VALUE";
        returnValue.Direction = ParameterDirection.ReturnValue;
        cmd.Parameters.Add(returnValue);

        try
        {
            cmd.ExecuteNonQuery(); // execute the command

            int numEffected = (int)cmd.Parameters["@RETURN_VALUE"].Value;
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
    // Create the SqlCommand using a stored procedure to insert new request
    //---------------------------------------------------------------------------------

    private SqlCommand CreateCommandWithStoredProcedureInsertNewReqest(String spName, SqlConnection con, int sellerId, int buyerId, int bookID)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        cmd.Parameters.AddWithValue("@sellerId", sellerId);

        cmd.Parameters.AddWithValue("@buyyerId", buyerId);

        cmd.Parameters.AddWithValue("@bookID", bookID);


        return cmd;
    }


    //--------------------------------------------------------------------------------------------------
    // This method Insert new Request
    //--------------------------------------------------------------------------------------------------

    public int requestHandling(int sellerId, int buyerId, int bookID, string requestStatus)
    {

        SqlConnection con;
        SqlCommand cmd;
        SqlParameter returnValue = new SqlParameter();

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        cmd = CreateCommandWithStoredProcedurerequestHandling("requestHandling", con, sellerId, buyerId, bookID, requestStatus);             // create the command

        returnValue.ParameterName = "@RETURN_VALUE";
        returnValue.Direction = ParameterDirection.ReturnValue;
        cmd.Parameters.Add(returnValue);

        try
        {
            cmd.ExecuteNonQuery(); // execute the command

            int numEffected = (int)cmd.Parameters["@RETURN_VALUE"].Value;
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
    // Create the SqlCommand using a stored procedure to handling request
    //---------------------------------------------------------------------------------

    private SqlCommand CreateCommandWithStoredProcedurerequestHandling(String spName, SqlConnection con, int sellerId, int buyerId, int bookID, string requstStatus)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        cmd.Parameters.AddWithValue("@sellerId", sellerId);

        cmd.Parameters.AddWithValue("@buyyerId", buyerId);

        cmd.Parameters.AddWithValue("@bookID", bookID);

        cmd.Parameters.AddWithValue("@requestStatus", requstStatus);


        return cmd;
    }

    //--------------------------------------------------------------------------------------------------
    // This method reads all the requests to sale for a user
    //--------------------------------------------------------------------------------------------------

    public List<dynamic> getRequestsPerUser(int userId)
    {
        SqlConnection con=null;
        SqlCommand cmd;
        List<dynamic> userRequests = new List<dynamic>();

        try
        {
            con = connect("myProjDB"); // Create the connection

            // Create the command using the stored procedure
            cmd = CreateCommandWithStoredProceduregetRequestsPerUser("getRequestsPerUser", con, userId);

            // Add the return value parameter
            SqlParameter returnValue = new SqlParameter
            {
                ParameterName = "@RETURN_VALUE",
                Direction = ParameterDirection.ReturnValue
            };
            cmd.Parameters.Add(returnValue);

            // Execute the command and read the data
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            // Read the data from the data reader
            while (dataReader.Read())
            {
                dynamic request = new ExpandoObject();
                request.userId = Convert.ToInt32(dataReader["sellerId"]);
                request.buyerId = Convert.ToInt32(dataReader["buyyerId"]);
                request.bookId = Convert.ToInt32(dataReader["bookId"]);
                request.buyerName = Convert.ToString(dataReader["userName"]);
                request.bookName = Convert.ToString(dataReader["title"]);
                request.status = Convert.ToString(dataReader["requestStatus"]);
                request.statusN = 0;
                userRequests.Add(request);
            }

            dataReader.Close(); // Ensure the data reader is closed

            // Check the return value
            int status = (int)cmd.Parameters["@RETURN_VALUE"].Value;
            if (status == -1)
            {
                // Handle the case where the status is -1
                dynamic request = new ExpandoObject();
                request.statusN = status;
                userRequests.Add(request);
            }
        }
        catch (Exception ex)
        {
            // Write to log
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                // Close the database connection
                con.Close();
            }
        }

        return userRequests;
    }

    //---------------------------------------------------------------------------------
    // Create the SqlCommand using a stored procedure to get all requests to sale per user
    //---------------------------------------------------------------------------------

    private SqlCommand CreateCommandWithStoredProceduregetRequestsPerUser(String spName, SqlConnection con, int userId)
    {
        SqlCommand cmd = new SqlCommand(); // Create the command object

        cmd.Connection = con;              // Assign the connection to the command object
        cmd.CommandText = spName;          // Can be Select, Insert, Update, Delete 
        cmd.CommandTimeout = 10;           // Time to wait for the execution; the default is 30 seconds
        cmd.CommandType = CommandType.StoredProcedure; // The type of the command

        cmd.Parameters.AddWithValue("@userId", userId);

        return cmd;
    }




    //--------------------------------------------------------------------------------------------------
    // This method Get all users
    //--------------------------------------------------------------------------------------------------

    public List<dynamic> GetAllIusers()

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

        cmd = CreateCommandWithStoredProcedureGetAllIusers("GetAllIusers", con);             // create the command


        List<dynamic> users = new List<dynamic>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                dynamic user= new ExpandoObject();
                user.Id = Convert.ToInt32(dataReader["userId"]);
                user.UserName = Convert.ToString(dataReader["userName"]);
                user.Email = Convert.ToString(dataReader["email"]);
                users.Add(user);
            }
            return users;
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
    // Create the SqlCommand using a stored procedure to get all users
    //---------------------------------------------------------------------------------

    private SqlCommand CreateCommandWithStoredProcedureGetAllIusers(String spName, SqlConnection con)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        return cmd;
    }

    //--------------------------------------------------------------------------------------------------
    // This method reads all the requests to buy for a user
    //--------------------------------------------------------------------------------------------------

    public List<dynamic> getMyRequestToBuyPerUser(int userId)
    {
        SqlConnection con = null;
        SqlCommand cmd;
        List<dynamic> userRequestsToBuy = new List<dynamic>();

        try
        {
            con = connect("myProjDB"); // Create the connection

            // Create the command using the stored procedure
            cmd = CreateCommandWithStoredProceduregetRequestToBuy("getMyRequestToBuy", con, userId);

            // Add the return value parameter
            SqlParameter returnValue = new SqlParameter
            {
                ParameterName = "@RETURN_VALUE",
                Direction = ParameterDirection.ReturnValue
            };
            cmd.Parameters.Add(returnValue);

            // Execute the command and read the data
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            // Read the data from the data reader
            while (dataReader.Read())
            {
                dynamic requestToBuy = new ExpandoObject();
                requestToBuy.userId = Convert.ToInt32(dataReader["sellerId"]);
                requestToBuy.buyerId = Convert.ToInt32(dataReader["buyyerId"]);
                requestToBuy.bookId = Convert.ToInt32(dataReader["bookId"]);
                requestToBuy.sellerName = Convert.ToString(dataReader["userName"]);
                requestToBuy.bookName = Convert.ToString(dataReader["title"]);
                requestToBuy.status = Convert.ToString(dataReader["requestStatus"]);
                requestToBuy.statusN = 0;
                userRequestsToBuy.Add(requestToBuy);
            }

            dataReader.Close(); // Ensure the data reader is closed

            // Check the return value
            int status = (int)cmd.Parameters["@RETURN_VALUE"].Value;
            if (status == -1)
            {
                // Handle the case where the status is -1
                dynamic requestToBuy = new ExpandoObject();
                requestToBuy.statusN = status;
                userRequestsToBuy.Add(requestToBuy);
            }
        }
        catch (Exception ex)
        {
            // Write to log
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                // Close the database connection
                con.Close();
            }
        }

        return userRequestsToBuy;
    }

    //---------------------------------------------------------------------------------
    // Create the SqlCommand using a stored procedure to get all requests to buy per user
    //---------------------------------------------------------------------------------

    private SqlCommand CreateCommandWithStoredProceduregetRequestToBuy(String spName, SqlConnection con, int userId)
    {
        SqlCommand cmd = new SqlCommand(); // Create the command object

        cmd.Connection = con;              // Assign the connection to the command object
        cmd.CommandText = spName;          // Can be Select, Insert, Update, Delete 
        cmd.CommandTimeout = 10;           // Time to wait for the execution; the default is 30 seconds
        cmd.CommandType = CommandType.StoredProcedure; // The type of the command

        cmd.Parameters.AddWithValue("@userId", userId);

        return cmd;
    }
    //--------------------------------------------------------------------------------------------------
    // This method login google user
    //--------------------------------------------------------------------------------------------------
    public object LogInWithGoogle(IUser user, int timeout)
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

        cmd = CreateCommandWithStoredProcedureLogInWithGoogle("LogInWithGoogle", con, user, timeout);             // create the command

        // create an output parameter to get back from the store presigere 


        dynamic userDetails = new ExpandoObject(); // create a dynamic object 
        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                userDetails.userId = Convert.ToInt32(dataReader["userId"]);
                userDetails.userName = Convert.ToString(dataReader["userName"]);
            }
            return userDetails;
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
    // Create the SqlCommand using a stored procedure login/add new google user
    //---------------------------------------------------------------------------------

    private SqlCommand CreateCommandWithStoredProcedureLogInWithGoogle(String spName, SqlConnection con, IUser user, int timeout)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        cmd.Parameters.AddWithValue("@username", user.UserName);

        cmd.Parameters.AddWithValue("@email", user.EMail);

        cmd.Parameters.AddWithValue("@password", user.Password);

        cmd.Parameters.AddWithValue("@sessionTimeOut", timeout);

        return cmd;
    }

    //--------------------------------------------------------------------------------------------------
    // This method show all books recomended for a specific user
    //--------------------------------------------------------------------------------------------------

    public List<dynamic> getRecommendedBooksForUser(int userId)

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

        cmd = CreateCommandWithStoredProceduregetRecommendedBooksForUser("getHistoryPurchase", con, userId);             // create the command


        List<dynamic> Books = new List<dynamic>();
        List<UserPurchaseData> allUserPurchaseData = new List<UserPurchaseData>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                dynamic book = new ExpandoObject();
                book.Id = Convert.ToInt32(dataReader["id"]);
                book.Title = Convert.ToString(dataReader["title"]);
                book.SubTitle = Convert.ToString(dataReader["subTitle"]);
                book.IsEbook = Convert.ToByte(dataReader["isEbook"]);
                book.IsActive = Convert.ToByte(dataReader["isActive"]);
                book.IsAvailable = Convert.ToByte(dataReader["isAvailable"]);
                book.Price = (float)Convert.ToDouble(dataReader["price"]);
                book.Category = Convert.ToString(dataReader["category"]);
                book.SmallThumbnail = Convert.ToString(dataReader["smallThumbnail"]);
                book.Thumbnail = Convert.ToString(dataReader["thumbnail"]);
                book.NumOfPages = Convert.ToInt32(dataReader["numOfPages"]);
                book.Description = Convert.ToString(dataReader["description"]);
                book.PreviewLink = Convert.ToString(dataReader["previewLink"]);
                book.PublishDate = Convert.ToString(dataReader["publishedDate"]);
                book.FirstAuthorName = Convert.ToString(dataReader["firstAuthor"]);
                book.SecondAuthorName = Convert.ToString(dataReader["secondAuthor"]);
                book.NumOfReviews = Convert.ToInt32(dataReader["numOfReviews"]);
                book.Rating = (float)Convert.ToDouble(dataReader["rating"]);
                book.TextSnippet = Convert.ToString(dataReader["textSnippet"]);
                book.UserId = Convert.ToString(dataReader["userid"]);
                book.UserName = Convert.ToString(dataReader["userName"]);
                Books.Add(book);

                string userid = Convert.ToString(dataReader["userId"]);
                string id = Convert.ToString(dataReader["id"]);
                string rating = Convert.ToString(dataReader["rate"]);
                int userIdInt = 0;
                int bookId = 0;
                float ratingInt = 0;

                if(userid != "") { userIdInt = Convert.ToInt32(userid); }
                if(id != "") { bookId = Convert.ToInt32(id); }
                if(rating != "") { ratingInt = (float)Convert.ToDouble(rating); }

                UserPurchaseData purchaseData = new UserPurchaseData
                {
                    UserId = userIdInt,
                    BookId = bookId,
                    Rating = ratingInt,
                    Genre = Convert.ToString(dataReader["category"]),
                    Author = Convert.ToInt32(dataReader["firstAuthorId"]),
                    Title = Convert.ToString(dataReader["title"])
                };

                allUserPurchaseData.Add(purchaseData);

            }

            KnnUserRecommenderService knnAlgorithem = new KnnUserRecommenderService(allUserPurchaseData, 2, userId);

            Dictionary<int, double[]> usersPreferenceMatrix = knnAlgorithem.BuildUserPreferenceVectorsGeneralized(allUserPurchaseData);

            List<int> recommendedBookId = knnAlgorithem.RunKnnAlgorithmOnGeneralizedData(usersPreferenceMatrix);

            if(recommendedBookId == null) { return null; }

            List<dynamic> recommendedBooks = new List<dynamic>();

            foreach (int bookId in recommendedBookId)
            {
                foreach (dynamic book in Books)
                {
                    if(bookId == book.Id) { recommendedBooks.Add(book); }
                }
            }

            return recommendedBooks;
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
    // Create the SqlCommand using a stored procedure to get recommended books per user
    //---------------------------------------------------------------------------------

    private SqlCommand CreateCommandWithStoredProceduregetRecommendedBooksForUser(String spName, SqlConnection con, int userId)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        return cmd;
    }

}
